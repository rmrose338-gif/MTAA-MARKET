const express = require("express");
const db = require("../config/database");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const { normalizeKenyanPhone } = require("../utils/phone");
const { getConfiguration } = require("../services/mpesaService");
const Payment = require("../models/Payment");
const {
  getPaymentStatus,
  handleMpesaCallback,
  retryStkPush,
  sendStkPush,
} = require("../controllers/paymentController");

const router = express.Router();

router.get("/payment-options", (_req, res) => {
  const mpesa = getConfiguration();
  res.json({
    mpesa_stk_enabled: mpesa.configured,
    mpesa_environment: mpesa.configured ? mpesa.environment : null,
    mpesa_missing_settings: mpesa.missingSettings,
  });
});

const deliveryOptions = {
  motorbike: { fee: 150, estimate: "About 30-60 minutes after the seller accepts (estimate)" },
  uber: { fee: 350, estimate: "About 45-90 minutes after the seller accepts (estimate)" },
  pickup: { fee: 0, estimate: "Collection time confirmed by the seller" },
  "seller-arranged": { fee: 0, estimate: "Delivery cost and timing confirmed by the seller" },
};

router.post("/", requireAuth, requireRole("buyer"), async (req, res, next) => {
  try {
    const deliveryMethod = req.body.delivery_method;
    const deliveryOption = typeof req.body.delivery_option === "string"
      ? req.body.delivery_option
      : deliveryMethod === "pickup" ? "pickup" : "seller-arranged";
    const delivery = deliveryOptions[deliveryOption];
    const deliveryAddress = typeof req.body.delivery_address === "string" ? req.body.delivery_address.trim() : "";
    const customerPhone = typeof req.body.customer_phone === "string" ? req.body.customer_phone.trim() : "";
    const customerName = req.user.name;
    const paymentMethod = req.body.payment_method || "cash";
    const phoneDigits = customerPhone.replace(/\D/g, "");
    if (!["delivery", "pickup"].includes(deliveryMethod)
      || !delivery
      || (deliveryOption === "pickup") !== (deliveryMethod === "pickup")) {
      return res.status(400).json({ message: "Choose a valid delivery or seller pickup option." });
    }
    if (!["cash", "mpesa_direct", "mpesa_stk"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Choose cash, direct seller payment, or M-Pesa STK Push." });
    }
    if (!/^\+?[\d\s()-]{7,20}$/.test(customerPhone) || phoneDigits.length < 7) {
      return res.status(400).json({ message: "Enter a valid phone number so the seller can contact you." });
    }
    if (paymentMethod === "mpesa_stk" && !normalizeKenyanPhone(customerPhone)) {
      return res.status(400).json({ message: "Enter a valid Kenyan mobile number for the M-Pesa prompt." });
    }
    if (paymentMethod === "mpesa_stk" && !getConfiguration().configured) {
      return res.status(503).json({ message: "M-Pesa payments are not configured. Add the Daraja credentials and public HTTPS callback settings to the API environment." });
    }
    if (deliveryMethod === "delivery" && (deliveryAddress.length < 8 || deliveryAddress.length > 300)) {
      return res.status(400).json({ message: "Enter a delivery location between 8 and 300 characters." });
    }

    const placeOrder = db.transaction(() => {
      const items = db.prepare(`SELECT ci.product_id, ci.options, ci.quantity, p.name, p.price, p.stock, p.seller_id
        FROM cart_items ci JOIN products p ON p.id = ci.product_id JOIN users seller ON seller.id = p.seller_id
        WHERE ci.user_id = ? AND p.moderation_status = 'approved'
          AND seller.account_status = 'active' AND seller.seller_status = 'approved'`).all(req.user.id);
      if (!items.length) {
        const error = new Error("Your cart is empty.");
        error.status = 400;
        throw error;
      }
      const productQuantities = new Map();
      for (const item of items) {
        productQuantities.set(item.product_id, (productQuantities.get(item.product_id) || 0) + item.quantity);
      }
      for (const item of items) {
        if (productQuantities.get(item.product_id) > item.stock) {
          const error = new Error(`${item.name} does not have enough stock.`);
          error.status = 409;
          throw error;
        }
      }
      const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
      const orderResult = db.prepare(`INSERT INTO orders
        (user_id, customer_name, total, delivery_method, delivery_option, delivery_fee, estimated_delivery,
         delivery_address, customer_phone, payment_method, payment_status, payment_access_token_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
        req.user.id, customerName, total, deliveryMethod,
        deliveryOption, delivery.fee, delivery.estimate,
        deliveryMethod === "delivery" ? deliveryAddress : null,
        customerPhone,
        paymentMethod,
        paymentMethod === "mpesa_stk" ? "pending" : paymentMethod === "mpesa_direct" ? "unverified" : "not_required",
        null,
      );
      const orderId = Number(orderResult.lastInsertRowid);
      Payment.createForOrder({
        orderId,
        method: paymentMethod,
        status: paymentMethod === "mpesa_stk" ? "pending" : paymentMethod === "mpesa_direct" ? "unverified" : "not_required",
        accessTokenHash: null,
      });
      const addOrderItem = db.prepare("INSERT INTO order_items (order_id, product_id, quantity, price, options) VALUES (?, ?, ?, ?, ?)");
      const decreaseStock = db.prepare("UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?");
      for (const item of items) {
        addOrderItem.run(orderId, item.product_id, item.quantity, item.price, item.options);
        const result = decreaseStock.run(item.quantity, item.product_id, item.quantity);
        if (!result.changes) {
          const error = new Error(`${item.name} is no longer available in that quantity.`);
          error.status = 409;
          throw error;
        }
      }
      db.prepare("DELETE FROM cart_items WHERE user_id = ?").run(req.user.id);
      return {
        id: orderId,
        customer_name: customerName,
        customer_phone: customerPhone,
        total,
        delivery_option: deliveryOption,
        delivery_fee: delivery.fee,
        estimated_delivery: delivery.estimate,
        payment_method: paymentMethod,
        payment_status: paymentMethod === "mpesa_stk" ? "pending" : paymentMethod === "mpesa_direct" ? "unverified" : "not_required",
        payment_access_token: null,
      };
    });
    const order = placeOrder();
    if (paymentMethod !== "mpesa_stk") return res.status(201).json(order);
    return res.status(201).json(await sendStkPush(order));
  } catch (error) {
    return next(error);
  }
});

router.post("/mpesa/callback", handleMpesaCallback);
router.get("/:id/payment-status", requireAuth, requireRole("buyer"), getPaymentStatus);
router.post("/:id/mpesa", requireAuth, requireRole("buyer"), retryStkPush);

router.get("/", requireAuth, requireRole("buyer"), (req, res) => {
  const orders = db.prepare(`SELECT id, total, status, delivery_method, delivery_option, delivery_fee,
      estimated_delivery, delivery_address, customer_phone, payment_method, payment_status,
      mpesa_receipt_number, payment_result_description, created_at
    FROM orders WHERE user_id = ? ORDER BY created_at DESC`).all(req.user.id);
  const getItems = db.prepare(`SELECT oi.product_id, p.name, oi.quantity, oi.price, oi.options
    FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?`);
  res.json(orders.map((order) => ({
    ...order,
    items: getItems.all(order.id).map(({ options, ...item }) => ({ ...item, options: JSON.parse(options) })),
  })));
});

router.get("/seller/summary", requireAuth, requireRole("seller"), (req, res) => {
  const products = db.prepare(`SELECT id, name, price, image_url, stock, moderation_status
    FROM products WHERE seller_id = ? ORDER BY created_at DESC`).all(req.user.id);
  const orders = db.prepare(`SELECT DISTINCT o.id, o.total, o.status, o.created_at, COALESCE(o.customer_name, customer.name, 'Guest customer') AS customer_name,
      o.delivery_method, o.delivery_option, o.delivery_fee, o.estimated_delivery,
      o.delivery_address, o.customer_phone, o.payment_method, o.payment_status, o.mpesa_receipt_number,
      (SELECT GROUP_CONCAT(p2.name || CASE WHEN oi2.options != '{}' THEN ' (' || oi2.options || ')' ELSE '' END, ', ')
        FROM order_items oi2 JOIN products p2 ON p2.id = oi2.product_id
        WHERE oi2.order_id = o.id AND p2.seller_id = ?) AS product_choices
    FROM orders o JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON p.id = oi.product_id LEFT JOIN users customer ON customer.id = o.user_id
    WHERE p.seller_id = ? ORDER BY o.created_at DESC LIMIT 20`).all(req.user.id, req.user.id);
  const totals = db.prepare(`SELECT COALESCE(SUM(oi.price * oi.quantity), 0) AS sales, COUNT(DISTINCT o.id) AS order_count
    FROM orders o JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON p.id = oi.product_id WHERE p.seller_id = ? AND o.status = 'complete'`).get(req.user.id);
  const orderCount = db.prepare(`SELECT COUNT(DISTINCT o.id) AS order_count,
      COUNT(DISTINCT CASE WHEN o.status = 'processing' THEN o.id END) AS pending_orders
    FROM orders o JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON p.id = oi.product_id WHERE p.seller_id = ?`).get(req.user.id);
  const salesByMonth = db.prepare(`SELECT strftime('%Y-%m', o.created_at) AS month,
      COALESCE(SUM(oi.price * oi.quantity), 0) AS sales,
      COUNT(DISTINCT o.id) AS order_count
    FROM orders o JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON p.id = oi.product_id
    WHERE p.seller_id = ? AND o.status = 'complete'
      AND date(o.created_at) >= date('now', 'start of month', '-5 months')
    GROUP BY strftime('%Y-%m', o.created_at) ORDER BY month`).all(req.user.id);
  res.json({
    products,
    orders,
    totals: { ...totals, ...orderCount },
    sales_by_month: salesByMonth,
  });
});

module.exports = router;
