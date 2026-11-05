const jwt = require("jsonwebtoken");
const db = require("../config/database");

function requireAuth(req, res, next) {
  const header = req.get("authorization") || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Please log in to continue." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "development-only-secret");
    const user = db.prepare(`SELECT id, name, phone, role, market_area, delivery_address, public_contact, account_status, seller_status
      FROM users WHERE id = ?`).get(payload.sub);
    if (!user) return res.status(401).json({ message: "Your account could not be found." });
    if (user.account_status === "suspended") return res.status(403).json({ message: "This account is suspended. Please contact Mtaa Market support." });
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: "Your session is invalid or has expired. Please log in again." });
  }
}

function optionalAuth(req, res, next) {
  const header = req.get("authorization") || "";
  if (!header) return next();

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Your session is invalid or has expired. Please sign in again." });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET || "development-only-secret");
  } catch {
    return res.status(401).json({ message: "Your session is invalid or has expired. Please sign in again." });
  }
  const user = db.prepare(`SELECT id, name, phone, role, market_area, delivery_address, public_contact, account_status, seller_status
    FROM users WHERE id = ?`).get(payload.sub);
  if (!user) return res.status(401).json({ message: "Your account could not be found." });
  if (user.account_status === "suspended") return res.status(403).json({ message: "This account is suspended. Please contact Mtaa Market support." });
  req.user = user;
  return next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) return res.status(403).json({ message: `A ${role} account is required.` });
    if (role === "seller" && req.user.seller_status !== "approved") {
      return res.status(403).json({ message: "Your seller account must be approved before you can manage listings or orders." });
    }
    return next();
  };
}

function requireAdmin(req, res, next) {
  const header = req.get("authorization") || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return res.status(401).json({ message: "Administrator sign-in is required." });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "development-only-secret");
    if (payload.scope !== "admin") return res.status(403).json({ message: "Administrator access is required." });
    const admin = db.prepare("SELECT id, email, created_at FROM administrators WHERE id = ?").get(payload.sub);
    if (!admin) return res.status(401).json({ message: "This administrator account is no longer available." });
    req.admin = admin;
    return next();
  } catch {
    return res.status(401).json({ message: "Your administrator session is invalid or has expired. Please sign in again." });
  }
}

module.exports = { requireAuth, optionalAuth, requireRole, requireAdmin };
