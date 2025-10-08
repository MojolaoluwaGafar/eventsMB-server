const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"MB Events" <${process.env.APP_EMAIL}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Email sending failed");
  }
};


module.exports = { sendEmail };
