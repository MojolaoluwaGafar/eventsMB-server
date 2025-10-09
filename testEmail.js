const nodemailer = require("nodemailer");

(async () => {
  const transporter = nodemailer.createTransport({
    host: "mail.mbevents.com",
    port: 465,
    secure: true,
    auth: {
      user: "no-reply@mbevents.com",
      pass: "yourpassword",
    },
  });

  try {
    await transporter.verify();
    console.log("✅ SMTP connection successful!");
  } catch (err) {
    console.error("❌ SMTP connection failed:", err);
  }
})();
