// const nodemailer = require("nodemailer");
// const {
//   createResetEmailTemplate,
//   createWelcomeEmailTemplate, newsletterTemplate
// } = require("./emailTemplates");

// const sendEmail = async ({ to, subject, html }) => {
//   const transporter = nodemailer.createTransport({
//     service: process.env.EMAIL_SERVICE,
//     auth: {
//       user: process.env.APP_EMAIL,
//       pass: process.env.APP_PASSWORD,
//     },
//   });

//   try {
//     // Use await to send the email and wait for the result
//     const info = await transporter.sendMail({
//       from: process.env.APP_EMAIL,
//       to: to, // list of receivers
//       subject: subject, // Subject line
//       html: html, // html body
//     });
//     console.log(`Email sent: ${info.response}`);
//   } catch (error) {
//     console.log(error);
//   }
// };

// const sendWelcomeEmail = ({ fullName, clientUrl, email }) => {
//   const subject = "Welcome to MB Events";
//   const html = createWelcomeEmailTemplate(fullName, clientUrl);

//   sendEmail({ to: email, subject, html });
// };

// const sendNewsletter = async ({email})=>{
//   const subject = "Your Weekly Dose of Updates Awaits";
//   const html = newsletterTemplate()

//   await sendEmail({to : email, subject, html })
// }

// const sendResetPasswordEmail = ({ resetLink, email }) => {
//   const subject = "Reset Password";
//   const html = createResetEmailTemplate( resetLink);

//   sendEmail({ to: email, subject, html });
// };


// module.exports = { sendWelcomeEmail, sendNewsletter, sendResetPasswordEmail };
const { Resend } = require("resend");
const {
  createResetEmailTemplate,
  createWelcomeEmailTemplate,
  newsletterTemplate,
} = require("./emailTemplates");

const resend = new Resend(process.env.RESEND_API_KEY);

// Generic reusable email sender
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await resend.emails.send({
      from: process.env.FROM_EMAIL || "MB Events <no-reply@mbevents.com>",
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent successfully to ${to}`);
    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Email sending failed");
  }
};

// Welcome Email
const sendWelcomeEmail = async ({ fullName, clientUrl, email }) => {
  const subject = "Welcome to MB Events";
  const html = createWelcomeEmailTemplate(fullName, clientUrl);
  await sendEmail({ to: email, subject, html });
};

// Newsletter Email
const sendNewsletter = async ({ email }) => {
  const subject = "Your Weekly Dose of Updates Awaits";
  const html = newsletterTemplate();
  await sendEmail({ to: email, subject, html });
};

// Reset Password Email
const sendResetPasswordEmail = async ({ resetLink, email }) => {
  const subject = "Reset Your Password";
  const html = createResetEmailTemplate(resetLink);
  await sendEmail({ to: email, subject, html });
};

module.exports = {
  sendWelcomeEmail,
  sendNewsletter,
  sendResetPasswordEmail,
};
