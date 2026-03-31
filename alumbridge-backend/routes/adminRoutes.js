const express = require("express");
const db = require("../config/db");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

const router = express.Router();

// ================= VIEW ALL USERS =================
router.get("/users", verifyToken, checkRole("admin"), (req, res) => {
  const sql = "SELECT id, name, email, role, points FROM users";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
});

// ================= DELETE ANY USER =================
router.delete("/users/:id", verifyToken, checkRole("admin"), (req, res) => {
  const userId = req.params.id;

  const sql = "DELETE FROM users WHERE id = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: "User deleted successfully" });
  });
});

// ================= DELETE ANY RESOURCE =================
router.delete("/resources/:id", verifyToken, checkRole("admin"), (req, res) => {
  const resourceId = req.params.id;

  const sql = "DELETE FROM resources WHERE id = ?";

  db.query(sql, [resourceId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: "Resource deleted by admin" });
  });
});

// ================= LEADERBOARD =================
router.get("/leaderboard", verifyToken, checkRole("admin"), (req, res) => {
  const sql = `
    SELECT id, name, role, points
    FROM users
    ORDER BY points DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
});

module.exports = router;