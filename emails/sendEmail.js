const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"MB EVENTS" <${process.env.APP_EMAIL}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
