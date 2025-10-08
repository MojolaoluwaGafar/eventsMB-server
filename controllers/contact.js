const sendMessage = require("../emails/sendMessage");

const contact = async (req, res) => {
    console.log("Incoming Message from Contact route");
    
  const { name, email, message } = req.body;
  console.log(req.body);
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const html = `
    <h3>New Contact Message</h3>
    <p><strong>First Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong><br/>${message}</p>
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
