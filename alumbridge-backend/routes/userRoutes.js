const express = require("express");
const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", verifyToken, (req, res) => {

  const userId = req.user.id;

  const userSql = "SELECT id, name, role, points FROM users WHERE id = ?";

  const resourceSql = "SELECT * FROM resources WHERE posted_by = ?";

  db.query(userSql, [userId], (err, userResult) => {

    if (err) return res.status(500).json({ error: err.message });

    db.query(resourceSql, [userId], (err, resourceResult) => {

      if (err) return res.status(500).json({ error: err.message });

      res.json({
        user: userResult[0],
        resources: resourceResult
      });

    });

  });

});

router.get("/leaderboard", verifyToken, (req, res) => {

  const sql = `
    SELECT id, name, role, points 
    FROM users 
    WHERE role = 'alumni'
    ORDER BY points DESC
  `;

  db.query(sql, (err, result) => {

    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(result);

  });

});

module.exports = router;