const express = require("express");
const db = require("../config/database");
const { optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/", optionalAuth, (req, res, next) => {
  const subject = typeof req.body.subject === "string" ? req.body.subject.trim() : "";
  const description = typeof req.body.description === "string" ? req.body.description.trim() : "";
  const orderId = req.body.order_id === undefined || req.body.order_id === null || req.body.order_id === ""
    ? null
    : Number(req.body.order_id);
  const customerName = req.user?.name || (typeof req.body.customer_name === "string" ? req.body.customer_name.trim() : "");
  const customerPhone = req.user?.phone || (typeof req.body.customer_phone === "string" ? req.body.customer_phone.trim() : "");
  const phoneDigits = customerPhone.replace(/\D/g, "");
  if (subject.length < 3 || subject.length > 120) return res.status(400).json({ message: "Subject must be between 3 and 120 characters." });
  if (description.length < 10 || description.length > 2000) return res.status(400).json({ message: "Describe the issue in 10 to 2,000 characters." });
  if (orderId !== null && (!Number.isInteger(orderId) || orderId < 1)) return res.status(400).json({ message: "Choose a valid order." });
  if (!req.user && (orderId === null || customerName.length < 2 || customerName.length > 80
    || !/^\+?[\d\s()-]{7,20}$/.test(customerPhone) || phoneDigits.length < 7)) {
    return res.status(400).json({ message: "Guest reports need the order number, your name, and the phone number used at checkout." });
  }
  try {
    if (orderId !== null) {
      if (req.user) {
        const order = db.prepare(`SELECT o.id FROM orders o WHERE o.id = ? AND (
          o.user_id = ? OR EXISTS (
            SELECT 1 FROM order_items oi JOIN products p ON p.id = oi.product_id
            WHERE oi.order_id = o.id AND p.seller_id = ?
          )
        )`).get(orderId, req.user.id, req.user.id);
        if (!order) return res.status(404).json({ message: "Order not found for your account." });
      } else {
        const order = db.prepare("SELECT customer_phone FROM orders WHERE id = ?").get(orderId);
        if (!order || String(order.customer_phone || "").replace(/\D/g, "") !== phoneDigits) {
          return res.status(404).json({ message: "Order not found for the phone number provided." });
        }
      }
    }
    const result = db.prepare(`INSERT INTO complaints (user_id, order_id, customer_name, customer_phone, subject, description)
      VALUES (?, ?, ?, ?, ?, ?)`).run(req.user?.id || null, orderId, customerName || null, customerPhone || null, subject, description);
    return res.status(201).json({ id: Number(result.lastInsertRowid), status: "open" });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
