const axios = require("axios");
const USER =require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const { sendWelcomeEmail, sendNewsletter, sendResetPasswordEmail } = require("../emails/sendMail")

const generateToken = (userId , email, fullName )=>{
    const token = jwt.sign({userId, email, fullName}, process.env.JWT_SECRET, {expiresIn : "1d"});
    console.log(token);
    
    return token;
}

exports.signUp = async (req,res) => {
    console.log("incoming signup request");
    
    const { email , fullName , password } = req.body
    console.log(req.body);

   try {

     if (!email || !fullName || !password) {
            return res.status(400).json({message: "Please provide all credentials"})
        }

    const existingUser = await USER.findOne({email})
     if (existingUser) {
            return res.status(400).json({success: false, message : "User already exist"})
        }
    const newUser = new USER({
           email,
           fullName,
           password 
        })
    await newUser.save()


    const clientUrl = `${process.env.FRONTEND_URL}/api/auth/signin`

    await sendWelcomeEmail({
       fullName : newUser.fullName,
       clientUrl,
       email : newUser.email
    })

     res.status(200).json({success: true, message: "Signup successful", user : {email : newUser.email , fullName : newUser.fullName }})
   } catch (error) {
    console.log(error);
    res.status(400).json({success: false, message : error.message})
   } 
    
}

exports.signIn = async (req,res) => {
    console.log("incoming sign in req");

    const {email, password} = req.body;
    console.log(req.body);

    try {
        if (!email || !password) {
           return res.status(400).json({message: "Please provide all credentials"}) 
        }
        const user = await USER.findOne({email})
        if (!user) {
           return res.status(404).json({message: "user not found"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
           return res.status(401).json({message : "Invalid credential"}) 
        }
        const token =generateToken( user._id,user.email, user.fullName)
        console.log("user signed in successfully");
        
        res.status(200).json({
            message: "Signin successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Signup failed", error : error.message})
    }
}

exports.googleAuth = async (req, res) => {
  const { token } = req.body;

  try {
    // Get user info from Google
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { email, name, email_verified } = response.data;

    if (!email_verified) {
      return res.status(400).json({ message: "Email not verified" });
    }

    let user = await USER.findOne({ email });

    if (!user) {
      user = new USER({
        email,
        fullName: name,
        password: "",
      });
      await user.save();
    }

    const jwtToken = generateToken(user._id, user.email, user.fullName, { expiresIn: "7d" });


    res.status(200).json({
      message: "Login successful",
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Google sign-in error:", error.message);
    res.status(500).json({ message: "Google login failed" });
  }
};

exports.subscribe = async (req,res) => {
    console.log("incoming newsletter subscription");
//     const { email } = req.body;
//     console.log(req.body);
//     try {
//         if (!email) {
//             return res.status(400).json({success : false, message : "Email is required"})
//         }
//         console.log("Preparing to send newsletter...");

//     await sendNewsletter({
//        email
//     })
//     console.log("Newsletter sent successfully.");

//     res.status(200).json({success : true, message : "Thank you for subscribing!"})
//     } catch (error) {
//   console.error("Subscription error:", error);
//   res.status(500).json({ error: "Failed to subscribe" });
// }
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  
    const html = `
      <h2>Welcome to MB Events Newsletter</h2>
      <p>Thanks for subscribing! You’ll now receive updates about our latest events and offers.</p>
    `;

  try {
    await sendEmail(email, "Welcome to MB Events!", html);

    res.status(200).json({ message: "Subscription successful" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Failed to subscribe" });
  }
}

exports.forgotPassword = async (req,res) => {
    console.log("Password reset request incoming");
    const { email } = req.body;
    console.log(req.body);
    try {
        if (!email) {
            return res.status(400).json({success : false, message : "Please provide an email"})
        }

        const user = await USER.findOne({ email })
        if (!user) {
            return res.status(400).json({success : false,  message : "User not found"})
        }
        const resetToken = generateToken( user._id, email)

        user.resetToken = resetToken
        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; //15minutes
        await user.save()
        
        const resetLink = `${process.env.FRONTEND_URL}/auth/resetPassword/${resetToken}`
        await sendResetPasswordEmail({
            email : user.email , resetLink 
        })
        res.status(200).json({
            success: true , message : "Password reset link sent to your email", resetToken
        })
    } catch (error) {
        console.log(error, "error sending email");
        res.status(400).json({success : false, message : "Something went wrong", error : error.message})
    }
}

exports.resetPassword = async (req,res) => {
    console.log("incoming password reset request");
    const {password} = req.body;
    console.log(req.body);
    const { token } = req.params
    try {
        if (!password || !token) {
           return res.status(400).json({success : false , message : "Invalid or expired token"})
        }
        const decoded= jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.userId
        console.log("Received token:", token);
        const hashedPassword = await bcrypt.hash(password, 10)
        await USER.findByIdAndUpdate(userId, { password: hashedPassword })
        return res.status(200).json({message : "Password reset successful"})
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({message : "Invalid or expired token"})
    }
}
// exports.updatePassword = async (req,res) => {
//     console.log("incoming password update request");
//     const { currentPassword, newPassword } = req.body;
//     try {
        
//     } catch (error) {
        
//     }
// }