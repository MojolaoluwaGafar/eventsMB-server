const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const auth = require("../middleware/auth");

// GET all tickets for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }).populate("event");
    res.json({ tickets });
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ tickets: [], message: "Server error" });
  }
});

// GET single ticket
router.get("/:id", auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("event");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    if (ticket.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });
    res.json({ ticket });
  } catch (err) {
    console.error("Error fetching ticket:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
