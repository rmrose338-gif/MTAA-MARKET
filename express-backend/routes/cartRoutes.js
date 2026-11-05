const express = require("express");
const db = require("../config/database");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const { normalizeProductOptions } = require("../utils/productOptions");

const router = express.Router();
router.use(requireAuth, requireRole("buyer"));

router.get("/", (req, res) => {
  const items = db.prepare(`SELECT ci.product_id, ci.options, ci.quantity, p.name, p.price, p.image_url, p.stock, u.name AS seller_name
    FROM cart_items ci JOIN products p ON p.id = ci.product_id JOIN users u ON u.id = p.seller_id
    WHERE ci.user_id = ? AND p.moderation_status = 'approved'
      AND u.account_status = 'active' AND u.seller_status = 'approved'
    ORDER BY ci.created_at`).all(req.user.id);
  res.json(items.map(({ options, ...item }) => ({ ...item, options: JSON.parse(options) })));
});

router.post("/", (req, res, next) => {
  try {
    const productId = Number(req.body.product_id);
    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      return res.status(400).json({ message: "Choose a valid product and quantity." });
    }
    const product = db.prepare(`SELECT p.id, p.stock, p.name, c.name AS category_name
      FROM products p JOIN categories c ON c.id = p.category_id JOIN users u ON u.id = p.seller_id
      WHERE p.id = ? AND p.moderation_status = 'approved'
        AND u.account_status = 'active' AND u.seller_status = 'approved'`).get(productId);
    if (!product) return res.status(404).json({ message: "Product not found." });
    const options = normalizeProductOptions(product, req.body.options);
    const optionsJson = JSON.stringify(options);
    const existing = db.prepare("SELECT quantity FROM cart_items WHERE user_id = ? AND product_id = ? AND options = ?").get(req.user.id, productId, optionsJson);
    const nextQuantity = (existing?.quantity || 0) + quantity;
    const productQuantity = db.prepare("SELECT COALESCE(SUM(quantity), 0) AS quantity FROM cart_items WHERE user_id = ? AND product_id = ?")
      .get(req.user.id, productId).quantity;
    if (productQuantity + quantity > product.stock) return res.status(400).json({ message: "There is not enough stock for that quantity." });
    db.prepare(`INSERT INTO cart_items (user_id, product_id, options, quantity) VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, product_id, options) DO UPDATE SET quantity = excluded.quantity`).run(req.user.id, productId, optionsJson, nextQuantity);
    return res.status(201).json({ message: "Added to cart." });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:productId", (req, res, next) => {
  try {
    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) return res.status(400).json({ message: "Enter a valid quantity." });
    const product = db.prepare(`SELECT p.stock, p.name, c.name AS category_name
      FROM products p JOIN categories c ON c.id = p.category_id JOIN users u ON u.id = p.seller_id
      WHERE p.id = ? AND p.moderation_status = 'approved'
        AND u.account_status = 'active' AND u.seller_status = 'approved'`).get(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found." });
    const options = normalizeProductOptions(product, req.body.options);
    const otherOptionsQuantity = db.prepare("SELECT COALESCE(SUM(quantity), 0) AS quantity FROM cart_items WHERE user_id = ? AND product_id = ? AND options != ?")
      .get(req.user.id, req.params.productId, JSON.stringify(options)).quantity;
    if (quantity + otherOptionsQuantity > product.stock) return res.status(400).json({ message: "There is not enough stock for that quantity." });
    const result = db.prepare("UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ? AND options = ?")
      .run(quantity, req.user.id, req.params.productId, JSON.stringify(options));
    if (!result.changes) return res.status(404).json({ message: "Cart item not found." });
    return res.json({ message: "Cart updated." });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:productId", (req, res, next) => {
  try {
    const product = db.prepare(`SELECT p.name, c.name AS category_name
      FROM products p JOIN categories c ON c.id = p.category_id WHERE p.id = ?`).get(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found." });
    const options = normalizeProductOptions(product, req.query.options ? JSON.parse(req.query.options) : {});
    db.prepare("DELETE FROM cart_items WHERE user_id = ? AND product_id = ? AND options = ?")
      .run(req.user.id, req.params.productId, JSON.stringify(options));
    return res.json({ message: "Cart item removed." });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
