const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    ticketType: {
      type: String,
      enum: ["regular", "vip", "free"],
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    reference: {
      type: String,
      default: function () {
        // Auto-generate reference if not provided
        return `REF-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      },
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "free"],
      default: "pending",
    },
    paymentGateway: {
      type: String,
      enum: ["paystack", "flutterwave", "none"],
      default: "paystack",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
