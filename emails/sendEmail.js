// const nodemailer = require("nodemailer");

// const sendEmail = async (to, subject, html) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       service: process.env.EMAIL_SERVICE,
//       auth: {
//       user: process.env.APP_EMAIL,
//       pass: process.env.APP_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: `"MB Events" <${process.env.APP_EMAIL}>`,
//       to,
//       subject,
//       html,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Email sent successfully to ${to}`);
//   } catch (error) {
//     console.error("Email sending failed:", error);
//     throw new Error("Email sending failed");
//   }
// };


// module.exports = { sendEmail };

const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    // Create reusable transporter object using Gmail + App Password
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // SSL port
      secure: true, // true for port 465, false for 587
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // prevents Render SSL rejection errors
      },
      connectionTimeout: 15000, // 15 seconds timeout (prevents hanging)
    });

    // Define mail options
    const mailOptions = {
      from: `"MB Events" <${process.env.APP_EMAIL}>`,
      to,
      subject,
      html,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
    console.log("Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw new Error("Email sending failed");
  }
};

module.exports = { sendEmail };
