const express = require("express");
const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// ── GET all notifications for the logged-in user ─────────────
router.get("/", verifyToken, (req, res) => {
  const sql = `
    SELECT id, message, created_at
    FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 20
  `;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ── MARK all as read (clear) ──────────────────────────────────
router.delete("/", verifyToken, (req, res) => {
  const sql = "DELETE FROM notifications WHERE user_id = ?";

  db.query(sql, [req.user.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Notifications cleared" });
  });
});

module.exports = router;
