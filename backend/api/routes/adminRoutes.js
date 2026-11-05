const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
const { requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();
const validOrderStatuses = new Set(["processing", "shipped", "complete", "cancelled"]);
const validComplaintStatuses = new Set(["open", "under_review", "resolved", "closed"]);

function recordAction(admin, action, entityType, entityId, details = null) {
  db.prepare(`INSERT INTO admin_activity_logs (admin_id, action, entity_type, entity_id, details)
    VALUES (?, ?, ?, ?, ?)`).run(admin.id, action, entityType, entityId, details);
}

function validId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

router.get("/setup-status", (_req, res) => {
  const setupAvailable = db.prepare("SELECT 1 FROM administrators LIMIT 1").get() === undefined;
  res.json({ setupAvailable });
});

router.post("/setup", async (req, res, next) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Enter a valid administrator email." });
    }
    if (password.length < 12 || password.length > 72) {
      return res.status(400).json({ message: "Administrator password must be between 12 and 72 characters." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const adminId = db.transaction(() => {
      if (db.prepare("SELECT 1 FROM administrators LIMIT 1").get()) return null;
      const result = db.prepare("INSERT INTO administrators (email, password_hash) VALUES (?, ?)").run(email, passwordHash);
      return Number(result.lastInsertRowid);
    })();

    if (!adminId) return res.status(409).json({ message: "An administrator account already exists. Please sign in." });
    const token = jwt.sign({ sub: String(adminId), scope: "admin" }, process.env.JWT_SECRET || "development-only-secret", { expiresIn: "8h" });
    return res.status(201).json({ admin: { id: adminId, email }, token });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const password = typeof req.body.password === "string" ? req.body.password : "";
    const admins = db.prepare("SELECT id, email, password_hash FROM administrators ORDER BY id").all();
    let matchedAdmin = null;
    for (const admin of admins) {
      if (await bcrypt.compare(password, admin.password_hash)) {
        matchedAdmin = admin;
        break;
      }
    }
    if (!matchedAdmin) {
      return res.status(401).json({ message: "Password is incorrect." });
    }
    const token = jwt.sign({ sub: String(matchedAdmin.id), scope: "admin" }, process.env.JWT_SECRET || "development-only-secret", { expiresIn: "8h" });
    return res.json({ admin: { id: matchedAdmin.id, email: matchedAdmin.email }, token });
  } catch (error) {
    return next(error);
  }
});

router.use(requireAdmin);

router.get("/me", (req, res) => res.json(req.admin));

router.get("/dashboard", (_req, res) => {
  const counts = db.prepare(`SELECT
    (SELECT COUNT(*) FROM users) AS users,
    (SELECT COUNT(*) FROM users WHERE role = 'buyer') AS customers,
    (SELECT COUNT(*) FROM users WHERE role = 'seller') AS sellers,
    (SELECT COUNT(*) FROM users WHERE role = 'seller' AND seller_status = 'pending') AS pending_sellers,
    (SELECT COUNT(*) FROM users WHERE account_status = 'suspended') AS suspended_accounts,
    (SELECT COUNT(*) FROM products) AS products,
    (SELECT COUNT(*) FROM products WHERE moderation_status = 'pending') AS pending_products,
    (SELECT COUNT(*) FROM products WHERE moderation_status = 'approved' AND stock = 0) AS out_of_stock,
    (SELECT COUNT(*) FROM products WHERE moderation_status = 'approved' AND stock BETWEEN 1 AND 5) AS low_stock,
    (SELECT COUNT(*) FROM orders) AS orders,
    (SELECT COUNT(*) FROM orders WHERE status = 'processing') AS pending_orders,
    (SELECT COUNT(*) FROM orders WHERE created_at >= datetime('now', '-7 days')) AS orders_last_7_days,
    (SELECT COUNT(*) FROM orders WHERE payment_method = 'mpesa_stk' AND payment_status = 'pending') AS pending_mpesa,
    (SELECT COUNT(*) FROM orders WHERE payment_method = 'mpesa_stk' AND payment_status = 'failed') AS failed_mpesa,
    (SELECT COUNT(*) FROM complaints WHERE status IN ('open', 'under_review')) AS open_complaints,
    (SELECT COALESCE(SUM(total), 0) FROM orders WHERE status = 'complete') AS completed_sales,
    (SELECT COALESCE(SUM(total), 0) FROM orders WHERE status = 'complete') AS total_sales`).get();
  const lowStockProducts = db.prepare(`SELECT p.id, p.name, p.stock, c.name AS category_name,
      u.name AS seller_name
    FROM products p JOIN categories c ON c.id = p.category_id JOIN users u ON u.id = p.seller_id
    WHERE p.moderation_status = 'approved' AND p.stock BETWEEN 0 AND 5
    ORDER BY p.stock ASC, p.name ASC LIMIT 8`).all();
  const recentOrders = db.prepare(`SELECT o.id, o.customer_name, o.total, o.status, o.payment_status,
      o.payment_method, o.created_at, u.name AS account_name
    FROM orders o LEFT JOIN users u ON u.id = o.user_id
    ORDER BY o.created_at DESC LIMIT 8`).all();
  const categoryCoverage = db.prepare(`SELECT c.name,
      COUNT(CASE WHEN p.moderation_status = 'approved' THEN 1 END) AS product_count
    FROM categories c LEFT JOIN products p ON p.category_id = c.id
    GROUP BY c.id ORDER BY product_count ASC, c.name ASC LIMIT 8`).all();
  const activity = db.prepare(`SELECT l.id, l.action, l.entity_type, l.entity_id, l.details, l.created_at,
      a.email AS admin_email
    FROM admin_activity_logs l LEFT JOIN administrators a ON a.id = l.admin_id
    ORDER BY l.created_at DESC LIMIT 12`).all();
  const recommendations = [];
  if (counts.pending_sellers) recommendations.push({ priority: "high", title: "Approve or vet pending sellers", detail: `${counts.pending_sellers} seller registration${counts.pending_sellers === 1 ? " is" : "s are"} waiting for review.` });
  if (counts.pending_products) recommendations.push({ priority: "high", title: "Review marketplace listings", detail: `${counts.pending_products} product listing${counts.pending_products === 1 ? " is" : "s are"} awaiting moderation.` });
  if (counts.open_complaints) recommendations.push({ priority: "high", title: "Resolve open reports", detail: `${counts.open_complaints} report${counts.open_complaints === 1 ? "" : "s"} still need attention.` });
  if (counts.failed_mpesa) recommendations.push({ priority: "high", title: "Investigate failed M-Pesa payments", detail: `${counts.failed_mpesa} failed prompt${counts.failed_mpesa === 1 ? "" : "s"} may require customer follow-up.` });
  if (counts.out_of_stock) recommendations.push({ priority: "medium", title: "Restore unavailable stock", detail: `${counts.out_of_stock} approved listing${counts.out_of_stock === 1 ? " is" : "s are"} out of stock.` });
  const emptyCategories = categoryCoverage.filter((category) => category.product_count === 0);
  if (emptyCategories.length) recommendations.push({ priority: "medium", title: "Complete category coverage", detail: `${emptyCategories.length} category${emptyCategories.length === 1 ? " has" : "ies have"} no approved products.` });
  recommendations.push({ priority: "low", title: "Strengthen launch operations", detail: "Back up the database, monitor callback logs, train sellers, publish a clear refund policy, and verify phone and delivery support." });
  res.json({ ...counts, low_stock_products: lowStockProducts, recent_orders: recentOrders, category_coverage: categoryCoverage, activity, recommendations });
});

router.get("/products", (req, res) => {
  const status = ["pending", "approved", "rejected"].includes(req.query.status) ? req.query.status : "";
  res.json(db.prepare(`SELECT p.id, p.name, p.description, p.price, p.stock, p.image_url, p.category_id,
      p.moderation_status, p.created_at, c.name AS category_name, u.id AS seller_id, u.name AS seller_name
    FROM products p JOIN categories c ON c.id = p.category_id JOIN users u ON u.id = p.seller_id
    WHERE (? = '' OR p.moderation_status = ?)
    ORDER BY CASE p.moderation_status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END, p.created_at DESC
    LIMIT 500`).all(status, status));
});

router.patch("/products/:id", (req, res, next) => {
  try {
    const id = validId(req.params.id);
    if (!id) return res.status(400).json({ message: "Choose a valid product." });
    const { name, description, price, stock, category_id } = req.body;
    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanDescription = typeof description === "string" ? description.trim() : "";
    const numericPrice = Number(price);
    const numericStock = Number(stock);
    const numericCategoryId = Number(category_id);
    if (cleanName.length < 2 || cleanName.length > 120) return res.status(400).json({ message: "Product name must be between 2 and 120 characters." });
    if (cleanDescription.length < 5 || cleanDescription.length > 2000) return res.status(400).json({ message: "Description must be between 5 and 2,000 characters." });
    if (!Number.isFinite(numericPrice) || numericPrice <= 0 || numericPrice > 1000000) return res.status(400).json({ message: "Enter a valid product price." });
    if (!Number.isInteger(numericStock) || numericStock < 0 || numericStock > 1000000) return res.status(400).json({ message: "Enter a valid stock quantity." });
    if (!Number.isInteger(numericCategoryId) || !db.prepare("SELECT 1 FROM categories WHERE id = ?").get(numericCategoryId)) {
      return res.status(400).json({ message: "Choose an available category." });
    }
    const result = db.prepare(`UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category_id = ?
      WHERE id = ?`).run(cleanName, cleanDescription, numericPrice, numericStock, numericCategoryId, id);
    if (!result.changes) return res.status(404).json({ message: "Product not found." });
    recordAction(req.admin, "edit", "product", id, JSON.stringify({ name: cleanName, price: numericPrice, stock: numericStock }));
    return res.json({ message: "Product updated." });
  } catch (error) {
    return next(error);
  }
});

router.patch("/products/:id/status", (req, res, next) => {
  const id = validId(req.params.id);
  const status = req.body.status;
  if (!id || !["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Choose a valid product and review status." });
  }
  try {
    const result = db.prepare("UPDATE products SET moderation_status = ? WHERE id = ?").run(status, id);
    if (!result.changes) return res.status(404).json({ message: "Product not found." });
    recordAction(req.admin, status === "rejected" ? "remove" : status, "product", id);
    return res.json({ message: `Product ${status === "rejected" ? "removed from the marketplace" : status}.` });
  } catch (error) {
    return next(error);
  }
});

router.get("/sellers", (_req, res) => {
  res.json(db.prepare(`SELECT id, name, phone, email, market_area, seller_status, account_status, created_at,
      (SELECT COUNT(*) FROM products p WHERE p.seller_id = users.id) AS product_count
    FROM users WHERE role = 'seller' ORDER BY created_at DESC LIMIT 500`).all());
});

router.patch("/sellers/:id/status", (req, res, next) => {
  const id = validId(req.params.id);
  const status = req.body.status;
  if (!id || !["approved", "suspended", "pending"].includes(status)) {
    return res.status(400).json({ message: "Choose a valid seller review status." });
  }
  try {
    const result = db.prepare(`UPDATE users SET seller_status = ?, account_status = ?
      WHERE id = ? AND role = 'seller'`).run(status, status === "suspended" ? "suspended" : "active", id);
    if (!result.changes) return res.status(404).json({ message: "Seller not found." });
    recordAction(req.admin, status, "seller", id);
    return res.json({ message: `Seller account ${status}.` });
  } catch (error) {
    return next(error);
  }
});

router.get("/customers", (_req, res) => {
  res.json(db.prepare(`SELECT id, name, phone, email, created_at, account_status,
      (SELECT COUNT(*) FROM orders o WHERE o.user_id = users.id) AS order_count
    FROM users WHERE role = 'buyer' ORDER BY created_at DESC LIMIT 500`).all());
});

router.patch("/customers/:id/status", (req, res, next) => {
  const id = validId(req.params.id);
  const status = req.body.status;
  if (!id || !["active", "suspended"].includes(status)) {
    return res.status(400).json({ message: "Choose a valid customer account status." });
  }
  try {
    const result = db.prepare("UPDATE users SET account_status = ? WHERE id = ? AND role = 'buyer'").run(status, id);
    if (!result.changes) return res.status(404).json({ message: "Customer not found." });
    recordAction(req.admin, status, "customer", id);
    return res.json({ message: `Customer account ${status}.` });
  } catch (error) {
    return next(error);
  }
});

router.get("/orders", (_req, res) => {
  res.json(db.prepare(`SELECT o.id, o.customer_name, o.customer_phone, o.total, o.status,
      o.delivery_method, o.delivery_option, o.created_at, u.name AS account_name,
      (SELECT GROUP_CONCAT(p.name || ' x' || oi.quantity, ', ')
        FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = o.id) AS items
    FROM orders o LEFT JOIN users u ON u.id = o.user_id ORDER BY o.created_at DESC LIMIT 500`).all());
});

router.get("/payments", (_req, res) => {
  res.json(db.prepare(`SELECT p.id, p.order_id, p.method, p.status, p.receipt_number,
      p.checkout_request_id, p.result_description, p.created_at, p.updated_at,
      o.total, o.customer_name, o.customer_phone, o.status AS order_status,
      u.name AS account_name
    FROM payments p JOIN orders o ON o.id = p.order_id
    LEFT JOIN users u ON u.id = o.user_id
    ORDER BY p.created_at DESC LIMIT 500`).all());
});

router.patch("/orders/:id/status", (req, res, next) => {
  const id = validId(req.params.id);
  const status = req.body.status;
  if (!id || !validOrderStatuses.has(status)) return res.status(400).json({ message: "Choose a valid order status." });
  try {
    const result = db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
    if (!result.changes) return res.status(404).json({ message: "Order not found." });
    recordAction(req.admin, status, "order", id);
    return res.json({ message: `Order marked ${status}.` });
  } catch (error) {
    return next(error);
  }
});

router.get("/categories", (_req, res) => {
  res.json(db.prepare(`SELECT c.id, c.name, COUNT(p.id) AS product_count
    FROM categories c LEFT JOIN products p ON p.category_id = c.id
    GROUP BY c.id ORDER BY c.name`).all());
});

router.post("/categories", (req, res, next) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  if (name.length < 2 || name.length > 80) return res.status(400).json({ message: "Category name must be between 2 and 80 characters." });
  try {
    const result = db.prepare("INSERT INTO categories (name) VALUES (?)").run(name);
    const id = Number(result.lastInsertRowid);
    recordAction(req.admin, "create", "category", id, name);
    return res.status(201).json({ id, name, product_count: 0 });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") return res.status(409).json({ message: "That category already exists." });
    return next(error);
  }
});

router.patch("/categories/:id", (req, res, next) => {
  const id = validId(req.params.id);
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  if (!id || name.length < 2 || name.length > 80) return res.status(400).json({ message: "Enter a valid category name." });
  try {
    const result = db.prepare("UPDATE categories SET name = ? WHERE id = ?").run(name, id);
    if (!result.changes) return res.status(404).json({ message: "Category not found." });
    recordAction(req.admin, "edit", "category", id, name);
    return res.json({ message: "Category updated." });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") return res.status(409).json({ message: "That category already exists." });
    return next(error);
  }
});

router.delete("/categories/:id", (req, res, next) => {
  const id = validId(req.params.id);
  if (!id) return res.status(400).json({ message: "Choose a valid category." });
  try {
    const result = db.prepare("DELETE FROM categories WHERE id = ?").run(id);
    if (!result.changes) return res.status(404).json({ message: "Category not found." });
    recordAction(req.admin, "delete", "category", id);
    return res.json({ message: "Category deleted." });
  } catch (error) {
    return next(error);
  }
});

router.get("/complaints", (_req, res) => {
  res.json(db.prepare(`SELECT c.id, c.order_id, c.subject, c.description, c.status, c.created_at, c.updated_at,
      COALESCE(u.name, c.customer_name) AS customer_name, COALESCE(u.phone, c.customer_phone) AS customer_phone
    FROM complaints c LEFT JOIN users u ON u.id = c.user_id ORDER BY
      CASE c.status WHEN 'open' THEN 0 WHEN 'under_review' THEN 1 ELSE 2 END, c.created_at DESC LIMIT 500`).all());
});

router.patch("/complaints/:id/status", (req, res, next) => {
  const id = validId(req.params.id);
  const status = req.body.status;
  if (!id || !validComplaintStatuses.has(status)) return res.status(400).json({ message: "Choose a valid complaint status." });
  try {
    const result = db.prepare("UPDATE complaints SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(status, id);
    if (!result.changes) return res.status(404).json({ message: "Complaint not found." });
    recordAction(req.admin, status, "complaint", id);
    return res.json({ message: `Complaint marked ${status.replace("_", " ")}.` });
  } catch (error) {
    return next(error);
  }
});

router.get("/analytics", (_req, res) => {
  const monthlySalesByMonth = new Map(db.prepare(`SELECT strftime('%Y-%m', created_at) AS month,
      COUNT(*) AS orders,
      SUM(CASE WHEN status = 'complete' THEN 1 ELSE 0 END) AS completed_orders,
      COALESCE(SUM(CASE WHEN status = 'complete' THEN total ELSE 0 END), 0) AS sales
    FROM orders
    WHERE created_at >= date('now', 'start of month', '-11 months')
      AND created_at < date('now', 'start of month', '+1 month')
    GROUP BY month`).all().map((row) => [row.month, row]));
  const monthlySales = db.prepare(`WITH RECURSIVE months(month, offset) AS (
      SELECT strftime('%Y-%m', 'now', 'start of month', '-11 months'), 0
      UNION ALL
      SELECT strftime('%Y-%m', 'now', 'start of month', printf('%+d months', offset - 10)), offset + 1
      FROM months WHERE offset < 11
    )
    SELECT month FROM months ORDER BY month`).all().map(({ month }) => ({
    month,
    orders: monthlySalesByMonth.get(month)?.orders || 0,
    completed_orders: monthlySalesByMonth.get(month)?.completed_orders || 0,
    sales: monthlySalesByMonth.get(month)?.sales || 0,
  }));
  const summary = db.prepare(`SELECT
      COUNT(CASE WHEN status = 'complete' THEN 1 END) AS completed_orders,
      COUNT(*) AS total_orders,
      COALESCE(SUM(CASE WHEN status = 'complete' THEN total ELSE 0 END), 0) AS completed_sales
    FROM orders`).get();
  const topProducts = db.prepare(`SELECT p.id AS product_id, p.name, SUM(oi.quantity) AS units_sold,
      SUM(oi.quantity * oi.price) AS sales
    FROM order_items oi JOIN products p ON p.id = oi.product_id
    JOIN orders o ON o.id = oi.order_id WHERE o.status = 'complete'
    GROUP BY p.id ORDER BY units_sold DESC LIMIT 10`).all();
  res.json({
    summary: {
      ...summary,
      average_order_value: summary.completed_orders ? summary.completed_sales / summary.completed_orders : 0,
    },
    monthly_sales: monthlySales,
    top_products: topProducts,
  });
});

router.get("/settings", (_req, res) => {
  const admins = db.prepare("SELECT id, email, created_at FROM administrators ORDER BY created_at").all();
  const activity = db.prepare(`SELECT l.id, l.action, l.entity_type, l.entity_id, l.details, l.created_at, a.email AS admin_email
    FROM admin_activity_logs l LEFT JOIN administrators a ON a.id = l.admin_id
    ORDER BY l.created_at DESC LIMIT 30`).all();
  res.json({ admins, activity });
});

router.post("/settings/password", async (req, res, next) => {
  try {
    const currentPassword = typeof req.body.current_password === "string" ? req.body.current_password : "";
    const newPassword = typeof req.body.new_password === "string" ? req.body.new_password : "";
    const admin = db.prepare("SELECT password_hash FROM administrators WHERE id = ?").get(req.admin.id);
    if (!(await bcrypt.compare(currentPassword, admin.password_hash))) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }
    if (newPassword.length < 12 || newPassword.length > 72) {
      return res.status(400).json({ message: "New password must be between 12 and 72 characters." });
    }
    db.prepare("UPDATE administrators SET password_hash = ? WHERE id = ?").run(await bcrypt.hash(newPassword, 12), req.admin.id);
    recordAction(req.admin, "change_password", "administrator", req.admin.id);
    return res.json({ message: "Administrator password changed." });
  } catch (error) {
    return next(error);
  }
});

router.post("/settings/admins", async (req, res, next) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: "Enter a valid administrator email." });
    if (password.length < 12 || password.length > 72) return res.status(400).json({ message: "Administrator password must be between 12 and 72 characters." });
    const result = db.prepare("INSERT INTO administrators (email, password_hash) VALUES (?, ?)").run(email, await bcrypt.hash(password, 12));
    const id = Number(result.lastInsertRowid);
    recordAction(req.admin, "create", "administrator", id, email);
    return res.status(201).json({ id, email });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") return res.status(409).json({ message: "An administrator already uses that email." });
    return next(error);
  }
});

module.exports = router;
