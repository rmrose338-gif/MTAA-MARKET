const express = require("express");
const db = require("../config/database");

const router = express.Router();
router.get("/", (_req, res) => {
  res.json(db.prepare("SELECT id, name FROM categories ORDER BY name").all());
});

module.exports = router;
