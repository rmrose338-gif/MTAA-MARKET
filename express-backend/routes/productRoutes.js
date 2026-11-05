const express = require("express");
const db = require("../config/database");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();
const productSelect = `SELECT p.id, p.name, p.description, p.price, p.image_url, p.stock, p.category_id, p.moderation_status,
  c.name AS category_name, u.name AS seller_name, u.is_demo_profile AS seller_is_demo,
  COALESCE((SELECT SUM(oi.quantity) FROM order_items oi JOIN orders o ON o.id = oi.order_id
    WHERE oi.product_id = p.id AND o.status = 'complete'), 0) AS sold_count,
  CASE WHEN u.public_contact = 1 THEN u.phone ELSE NULL END AS seller_phone,
  CASE WHEN u.public_contact = 1 THEN u.market_area ELSE NULL END AS seller_area
  FROM products p JOIN categories c ON c.id = p.category_id JOIN users u ON u.id = p.seller_id`;
const clothingCategories = new Set([
  "Fashion",
  "Clothing & Accessories",
  "Kids' Clothing",
  "Teen Clothing",
  "Adult Clothing",
  "Older Adults' Clothing",
  "Baby & Kids",
  "Shoes & Footwear",
]);

router.get("/", requireAuth, requireRole("buyer"), (req, res) => {
  const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 100) : "";
  const category = typeof req.query.category === "string" ? req.query.category.trim().slice(0, 80) : "";
  const minPrice = req.query.min_price === undefined || req.query.min_price === "" ? null : Number(req.query.min_price);
  const maxPrice = req.query.max_price === undefined || req.query.max_price === "" ? null : Number(req.query.max_price);
  if ((minPrice !== null && (!Number.isFinite(minPrice) || minPrice < 0))
    || (maxPrice !== null && (!Number.isFinite(maxPrice) || maxPrice < 0))) {
    return res.status(400).json({ message: "Enter valid minimum and maximum prices." });
  }
  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    return res.status(400).json({ message: "Minimum price cannot be greater than maximum price." });
  }
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 100, 1), 100);
  const products = db.prepare(`${productSelect}
    WHERE p.stock > 0 AND p.moderation_status = 'approved' AND u.account_status = 'active'
    AND u.seller_status = 'approved' AND (? = '' OR p.name LIKE ? OR p.description LIKE ?)
    AND (? = '' OR c.name = ?)
    AND (? IS NULL OR p.price >= ?)
    AND (? IS NULL OR p.price <= ?)
    ORDER BY p.created_at DESC LIMIT ?`).all(
    search, `%${search}%`, `%${search}%`, category, category,
    minPrice, minPrice, maxPrice, maxPrice, limit,
  );

  const makeupCollection = products.find((product) => product.category_name === "Beauty & Personal Care" && /makeup/i.test(product.name));
  const includeMakeupVariants = req.query.include_makeup_variants === "true";
  if (!makeupCollection || search || includeMakeupVariants) return res.json(products);

  return res.json(products.filter((product) => {
    if (product.id === makeupCollection.id) return true;
    if (product.category_name !== "Beauty & Personal Care") return true;
    return !/(lipstick|foundation|face powder|mascara|eyeliner|nail polish|makeup brush)/i.test(product.name);
  }));
});

router.get("/:id", requireAuth, requireRole("buyer"), (req, res) => {
  const product = db.prepare(`${productSelect}
    WHERE p.id = ? AND p.moderation_status = 'approved' AND u.account_status = 'active' AND u.seller_status = 'approved'`)
    .get(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found." });
  return res.json(product);
});

router.post("/", requireAuth, requireRole("seller"), (req, res, next) => {
  try {
    const { name, description, price, category_id, stock = 0 } = req.body;
    const imageUrl = typeof req.body.image_url === "string" ? req.body.image_url.trim() : "";
    if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 120) return res.status(400).json({ message: "Product name must be between 2 and 120 characters." });
    if (typeof description !== "string" || description.trim().length < 5 || description.trim().length > 2000) return res.status(400).json({ message: "Description must be between 5 and 2,000 characters." });
    if (!Number.isFinite(Number(price)) || Number(price) <= 0 || Number(price) > 1000000) return res.status(400).json({ message: "Enter a valid product price." });
    if (!Number.isInteger(Number(category_id)) || !Number.isInteger(Number(stock)) || Number(stock) < 0 || Number(stock) > 1000000) return res.status(400).json({ message: "Choose a category and enter a valid stock quantity." });
    const validImageUrl = /^https?:\/\//i.test(imageUrl) || (/^\/images\/[a-z0-9/_-]+\.[a-z0-9]{2,5}$/i.test(imageUrl) && !imageUrl.includes(".."));
    if (imageUrl.length > 2000 || !validImageUrl) return res.status(400).json({ message: "Add a public photo URL of this product or use an existing /images asset." });
    const category = db.prepare("SELECT name FROM categories WHERE id = ?").get(Number(category_id));
    if (!category) return res.status(400).json({ message: "Choose an available product category." });
    if (clothingCategories.has(category.name) && (Number(price) < 30 || Number(price) > 1000)) {
      return res.status(400).json({ message: "Clothing and footwear prices must be between KSh 30 and KSh 1,000." });
    }
    const result = db.prepare(`INSERT INTO products
      (seller_id, category_id, name, description, price, image_url, stock, moderation_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`).run(
      req.user.id, Number(category_id), name.trim(), description.trim(), Number(price), imageUrl, Number(stock),
    );
    const product = db.prepare(`${productSelect} WHERE p.id = ?`).get(result.lastInsertRowid);
    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id", requireAuth, requireRole("seller"), (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: "Choose a valid product." });
  const product = db.prepare("SELECT id FROM products WHERE id = ? AND seller_id = ?").get(id, req.user.id);
  if (!product) return res.status(404).json({ message: "Product not found in your listings." });
  const { name, description, price, category_id, stock } = req.body;
  const cleanName = typeof name === "string" ? name.trim() : "";
  const cleanDescription = typeof description === "string" ? description.trim() : "";
  const imageUrl = typeof req.body.image_url === "string" ? req.body.image_url.trim() : "";
  const numericPrice = Number(price);
  const numericCategoryId = Number(category_id);
  const numericStock = Number(stock);
  if (cleanName.length < 2 || cleanName.length > 120) return res.status(400).json({ message: "Product name must be between 2 and 120 characters." });
  if (cleanDescription.length < 5 || cleanDescription.length > 2000) return res.status(400).json({ message: "Description must be between 5 and 2,000 characters." });
  if (!Number.isFinite(numericPrice) || numericPrice <= 0 || numericPrice > 1000000) return res.status(400).json({ message: "Enter a valid product price." });
  if (!Number.isInteger(numericCategoryId) || !Number.isInteger(numericStock) || numericStock < 0 || numericStock > 1000000) {
    return res.status(400).json({ message: "Choose a category and enter a valid stock quantity." });
  }
  const validImageUrl = /^https?:\/\//i.test(imageUrl) || (/^\/images\/[a-z0-9/_-]+\.[a-z0-9]{2,5}$/i.test(imageUrl) && !imageUrl.includes(".."));
  if (imageUrl.length > 2000 || !validImageUrl) return res.status(400).json({ message: "Add a public photo URL of this product or use an existing /images asset." });
  const category = db.prepare("SELECT name FROM categories WHERE id = ?").get(numericCategoryId);
  if (!category) return res.status(400).json({ message: "Choose an available product category." });
  if (clothingCategories.has(category.name) && (numericPrice < 30 || numericPrice > 1000)) {
    return res.status(400).json({ message: "Clothing and footwear prices must be between KSh 30 and KSh 1,000." });
  }
  try {
    db.prepare(`UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, stock = ?,
      category_id = ?, moderation_status = 'pending' WHERE id = ? AND seller_id = ?`)
      .run(cleanName, cleanDescription, numericPrice, imageUrl, numericStock, numericCategoryId, id, req.user.id);
    return res.json({ message: "Product updated and submitted for administrator review." });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", requireAuth, requireRole("seller"), (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: "Choose a valid product." });
  const product = db.prepare("SELECT id FROM products WHERE id = ? AND seller_id = ?").get(id, req.user.id);
  if (!product) return res.status(404).json({ message: "Product not found in your listings." });
  if (db.prepare("SELECT 1 FROM order_items WHERE product_id = ? LIMIT 1").get(id)) {
    return res.status(409).json({ message: "This product has order history and cannot be deleted. Set its stock to 0 to stop new orders." });
  }
  try {
    db.prepare("DELETE FROM products WHERE id = ? AND seller_id = ?").run(id, req.user.id);
    return res.json({ message: "Product deleted." });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
