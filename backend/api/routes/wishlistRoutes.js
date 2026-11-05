const express = require("express");
const db = require("../config/database");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);

router.get("/", (req, res) => {
  const items = db.prepare(`SELECT p.id, p.name, p.description, p.price, p.image_url, p.stock,
      p.category_id, c.name AS category_name, u.name AS seller_name,
      CASE WHEN u.public_contact = 1 THEN u.phone ELSE NULL END AS seller_phone,
      CASE WHEN u.public_contact = 1 THEN u.market_area ELSE NULL END AS seller_area,
      wi.created_at AS saved_at
    FROM wishlist_items wi
    JOIN products p ON p.id = wi.product_id
    JOIN categories c ON c.id = p.category_id
    JOIN users u ON u.id = p.seller_id
    WHERE wi.user_id = ? AND p.moderation_status = 'approved'
      AND u.account_status = 'active' AND u.seller_status = 'approved'
    ORDER BY wi.created_at DESC`).all(req.user.id);
  return res.json(items);
});

router.post("/", (req, res, next) => {
  const productId = Number(req.body.product_id);
  if (!Number.isInteger(productId) || productId < 1) {
    return res.status(400).json({ message: "Choose a valid product to save." });
  }
  try {
    const product = db.prepare(`SELECT 1 FROM products p JOIN users u ON u.id = p.seller_id
      WHERE p.id = ? AND p.moderation_status = 'approved'
        AND u.account_status = 'active' AND u.seller_status = 'approved'`).get(productId);
    if (!product) return res.status(404).json({ message: "This product is no longer available to save." });
    db.prepare("INSERT OR IGNORE INTO wishlist_items (user_id, product_id) VALUES (?, ?)")
      .run(req.user.id, productId);
    return res.status(201).json({ product_id: productId, saved: true });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:productId", (req, res) => {
  const productId = Number(req.params.productId);
  if (!Number.isInteger(productId) || productId < 1) {
    return res.status(400).json({ message: "Choose a valid saved product." });
  }
  const result = db.prepare("DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?")
    .run(req.user.id, productId);
  if (!result.changes) return res.status(404).json({ message: "That product is not in your wishlist." });
  return res.json({ product_id: productId, saved: false });
});

module.exports = router;
