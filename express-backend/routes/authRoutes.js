const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
const { requireAuth } = require("../middleware/authMiddleware");
const { normalizeKenyanPhone } = require("../utils/phone");

const router = express.Router();

function issueToken(user) {
  return jwt.sign({ sub: user.id }, process.env.JWT_SECRET || "development-only-secret", { expiresIn: "7d" });
}

router.post("/register", async (req, res, next) => {
  try {
    const phone = normalizeKenyanPhone(req.body.phone);
    const password = typeof req.body.password === "string" ? req.body.password : "";
    const role = req.body.role === "seller" ? "seller" : req.body.role === "buyer" || req.body.role === undefined ? "buyer" : null;
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const marketArea = typeof req.body.market_area === "string" ? req.body.market_area.trim() : "";
    const publicContact = role === "seller" && req.body.public_contact === true ? 1 : 0;
    if (!role) return res.status(400).json({ message: "Choose a buyer or seller account." });
    if (name.length < 2 || name.length > 80) return res.status(400).json({ message: "Enter a name between 2 and 80 characters." });
    if (marketArea.length > 100) return res.status(400).json({ message: "Market area must be 100 characters or fewer." });
    if (!phone) return res.status(400).json({ message: "Enter a valid Kenyan mobile number, such as 0712 345 678." });
    if (password.length < 8 || password.length > 72) return res.status(400).json({ message: "Password must be between 8 and 72 characters." });

    if (role === "buyer" && db.prepare("SELECT 1 FROM users WHERE role = 'buyer' AND name = ? COLLATE NOCASE").get(name)) {
      return res.status(409).json({ message: "A customer account already uses that name. Choose a different name or sign in." });
    }
    if (db.prepare("SELECT 1 FROM users WHERE phone = ?").get(phone)) {
      return res.status(409).json({ message: "An account already uses that phone number. Please sign in instead." });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const sellerStatus = role === "seller" ? "pending" : "approved";
    const result = db.prepare(`INSERT INTO users
      (name, phone, market_area, public_contact, password_hash, role, seller_status)
      VALUES (?, ?, ?, ?, ?, ?, ?)`).run(name, phone, marketArea || null, publicContact, passwordHash, role, sellerStatus);
    const user = {
      id: Number(result.lastInsertRowid), name, phone, market_area: marketArea, delivery_address: "",
      public_contact: publicContact, role, account_status: "active", seller_status: sellerStatus,
    };
    return res.status(201).json({ user, token: issueToken(user) });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ message: "An account already uses that phone number. Please sign in instead." });
    }
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const identifier = typeof req.body.phone === "string" ? req.body.phone : req.body.email;
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const phone = normalizeKenyanPhone(identifier);
    const legacyEmail = typeof identifier === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim())
      ? identifier.trim().toLowerCase()
      : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";
    const nameMatches = name
      ? db.prepare(`SELECT id, name, phone, market_area, delivery_address, public_contact, role, account_status, seller_status, password_hash
        FROM users WHERE role = 'buyer' AND name = ? COLLATE NOCASE`).all(name)
      : [];
    const authenticatedNames = [];
    for (const candidate of nameMatches) {
      if (await bcrypt.compare(password, candidate.password_hash)) authenticatedNames.push(candidate);
    }
    if (authenticatedNames.length > 1) {
      return res.status(409).json({ message: "More than one customer account uses that name. Please contact support to make the name unique." });
    }
    if (nameMatches.length && !authenticatedNames.length) {
      return res.status(401).json({
        message: "We couldn't sign you in. Check your name and password, or create a customer or seller account if you haven't registered yet.",
      });
    }
    const record = authenticatedNames[0] || (phone
      ? db.prepare(`      SELECT id, name, phone, market_area, delivery_address, public_contact, role, account_status, seller_status, password_hash
        FROM users WHERE phone = ?`).get(phone)
      : legacyEmail
        ? db.prepare(`        SELECT id, name, phone, market_area, delivery_address, public_contact, role, account_status, seller_status, password_hash
          FROM users WHERE email = ?`).get(legacyEmail)
        : null);
    if (!record || !(await bcrypt.compare(password, record.password_hash))) {
      return res.status(401).json({
        message: "We couldn't sign you in. Check your details, or create a customer or seller account if you haven't registered yet.",
      });
    }
    if (record.account_status === "suspended" || record.seller_status === "suspended") {
      return res.status(403).json({ message: "This account is suspended. Please contact Mtaa Market support." });
    }
    const user = {
      id: record.id,
      name: record.name,
      phone: record.phone,
      market_area: record.market_area,
      delivery_address: record.delivery_address,
      public_contact: record.public_contact,
      role: record.role,
      account_status: record.account_status,
      seller_status: record.seller_status,
    };
    return res.json({ user, token: issueToken(user) });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", requireAuth, (req, res) => res.json(req.user));

router.patch("/me", requireAuth, (req, res, next) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const phone = normalizeKenyanPhone(req.body.phone);
  const marketArea = typeof req.body.market_area === "string" ? req.body.market_area.trim() : req.user.market_area || "";
  const deliveryAddress = typeof req.body.delivery_address === "string"
    ? req.body.delivery_address.trim()
    : req.user.delivery_address || "";
  const publicContact = req.body.public_contact === undefined
    ? req.user.public_contact
    : req.body.public_contact === true ? 1 : 0;
  if (name.length < 2 || name.length > 80) return res.status(400).json({ message: "Enter a name between 2 and 80 characters." });
  if (marketArea.length > 100) return res.status(400).json({ message: "Market area must be 100 characters or fewer." });
  if (deliveryAddress.length > 300 || (deliveryAddress && deliveryAddress.length < 8)) {
    return res.status(400).json({ message: "Enter a delivery address between 8 and 300 characters." });
  }
  if (!phone) return res.status(400).json({ message: "Enter a valid Kenyan mobile number, such as 0712 345 678." });
  try {
    db.prepare("UPDATE users SET name = ?, phone = ?, market_area = ?, delivery_address = ?, public_contact = ? WHERE id = ?")
      .run(name, phone, marketArea || null, deliveryAddress || null, publicContact, req.user.id);
    return res.json({ ...req.user, name, phone, market_area: marketArea, delivery_address: deliveryAddress, public_contact: publicContact });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ message: "Another account already uses that phone number." });
    }
    return next(error);
  }
});

module.exports = router;
