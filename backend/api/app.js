const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const jobRoutes = require("./routes/jobRoutes");
const adminRoutes = require("./routes/adminRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const { getSalesAnalysis } = require("./services/pythonService");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
const configuredOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const allowedOrigin = /^https?:\/\//i.test(configuredOrigin)
  ? configuredOrigin
  : `https://${configuredOrigin}`;
const allowedOrigins = [
  allowedOrigin,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "100kb" }));
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.get("/api/analytics/sales", async (_req, res, next) => {
  try {
    res.json(await getSalesAnalysis());
  } catch (error) {
    next(error);
  }
});
app.use(notFound);
app.use(errorHandler);

module.exports = app;
