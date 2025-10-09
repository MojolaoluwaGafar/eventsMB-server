const sendMessage = require("../emails/sendMessage");

const contact = async (req, res) => {
console.log("Incoming Message from Contact route");
    
  const { name, email, message } = req.body;
  console.log(req.body);
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

 const html = `
  <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f8fa; padding: 30px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); overflow: hidden;">
      <div style="background-color: #111827; color: #ffffff; text-align: center; padding: 25px;">
        <h2 style="margin: 0; font-size: 22px; letter-spacing: 0.5px;">📩 New Contact Message</h2>
        <p style="margin-top: 6px; font-size: 14px; color: #d1d5db;">from MB Events Website</p>
      </div>

      <div style="padding: 25px 30px;">
        <p style="font-size: 16px; color: #111827; margin-bottom: 20px;">Hey Team,</p>
        <p style="font-size: 15px; color: #374151;">You’ve received a new contact form submission. Here are the details:</p>
        
        <div style="margin: 25px 0;">
          <p style="font-size: 15px; margin: 6px 0;"><strong style="color: #111827;">👤 Name:</strong> ${name}</p>
          <p style="font-size: 15px; margin: 6px 0;"><strong style="color: #111827;">📧 Email:</strong> ${email}</p>
          <p style="font-size: 15px; margin: 6px 0;"><strong style="color: #111827;">💬 Message:</strong></p>
          <blockquote style="background-color: #f3f4f6; border-left: 4px solid #111827; padding: 10px 15px; margin-top: 8px; border-radius: 6px; color: #374151; font-style: italic;">
            ${message}
          </blockquote>
        </div>

        <p style="font-size: 14px; color: #6b7280;">Please respond promptly to maintain great communication with our users.</p>
      </div>

      <div style="background-color: #111827; color: #d1d5db; text-align: center; padding: 18px; font-size: 13px;">
        © ${new Date().getFullYear()} MB Events. All Rights Reserved.<br/>
        <span style="color: #9ca3af;">This email was generated automatically by your website contact form.</span>
      </div>
    </div>
  </div>
`;

  try {
    await sendMessage(
      process.env.RECEIVER_EMAIL,
      "New Contact Form Submission",
      html
    );
    console.log("Message received :", message );
    
    res.status(200).json({ success: true, message: "Message sent!" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

module.exports = { contact };
