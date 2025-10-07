const express = require("express");
const router = express.Router();
const {
  initializePayment,
  verifyPayment,
  paystackWebhook,
} = require("../controllers/paymentController");

router.post("/initiate", initializePayment);
router.get("/verify/:reference", verifyPayment);
router.post("/webhook", express.json({ type: "*/*" }), paystackWebhook);

module.exports = router;
