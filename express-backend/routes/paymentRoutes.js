const express = require("express");
const { getPaymentStatus, handleMpesaCallback, retryStkPush } = require("../controllers/paymentController");
const { optionalAuth } = require("../middleware/authenticate");

const router = express.Router();

router.post("/mpesa/callback", handleMpesaCallback);
router.get("/:id/status", optionalAuth, getPaymentStatus);
router.post("/:id/stk", optionalAuth, retryStkPush);

module.exports = router;
