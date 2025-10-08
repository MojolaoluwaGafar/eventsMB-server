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
// emails/sendEmail.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL || "MB Events <no-reply@mbevents.com>",
      to,
      subject,
      html,
    });

    console.log(` Email sent successfully to ${to}`);
    return response;
  } catch (error) {
    console.error(" Email sending failed:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = { sendEmail };
