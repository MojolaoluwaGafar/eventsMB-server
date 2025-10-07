require("dotenv").config();
const axios = require("axios");
const Ticket = require("../models/Ticket");
const Event = require("../models/Event");

const PAYSTACK_BASE_URL = process.env.PAYSTACK_BASE_URL;
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

exports.initializePayment = async (req, res) => {
  try {
    const { email, amount, eventId, ticketType, userId } = req.body;
    console.log("Incoming payment request:", req.body);

    if (!email || !eventId || !ticketType || !userId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (amount === 0) {
      console.log("Free event detected — creating free ticket...");
      const reference = `free-${Date.now()}`;

      const ticket = new Ticket({
        user: userId,
        event: eventId,
        ticketType,
        amount: 0,
        reference,
        status: "paid"
      });

      await ticket.save();

      return res.json({
        success: true,
        message: "Free event ticket registered successfully",
        ticket,
      });
    }

    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        metadata: { eventId, ticketType, userId },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Paystack response:", paystackResponse.data);

    const { authorization_url, reference } = paystackResponse.data.data;

    const ticket = new Ticket({
      user: userId,
      event: eventId,
      ticketType,
      amount,
      reference,
      status: "pending",
    });

    await ticket.save();

    return res.json({
      success: true,
      authorization_url,
      reference,
    });
  } catch (error) {
    console.error("Payment init error:", error.message || error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
};


exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = response.data.data;

    if (data.status === "success") {
      const ticket = await Ticket.findOne({ reference });
      if (ticket) {
        ticket.status = "paid";
        await ticket.save();
      }

      return res.status(200).json({ success: true, data });
    } else {
      return res.status(400).json({ success: false, message: "Payment not successful" });
    }
  } catch (err) {
    console.error("Payment verification error:", err.response?.data || err.message);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

exports.paystackWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (event.event === "charge.success") {
      const { reference } = event.data;

      const ticket = await Ticket.findOne({ reference });
      if (ticket) {
        ticket.status = "paid";
        await ticket.save();
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.sendStatus(500);
  }
};
