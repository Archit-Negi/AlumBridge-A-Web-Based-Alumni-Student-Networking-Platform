const express = require("express");
const db = require("../config/db");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

const router = express.Router();

// ============ CREATE RESOURCE (Alumni + Admin) ============

router.post("/", verifyToken, (req, res) => {

  if (req.user.role !== "alumni" && req.user.role !== "admin") {
    return res.status(403).json({
      message: "Only Alumni/Admin can post resources"
    });
  }

  const { title, description, link } = req.body;

  const insertSql =
    "INSERT INTO resources (title, description, link, posted_by) VALUES (?, ?, ?, ?)";

  db.query(insertSql, [title, description, link, req.user.id], (err) => {

    if (err) return res.status(500).json({ error: err.message });

    // 🎯 Give points only to alumni
    if (req.user.role === "alumni") {

      const rewardSql =
        "UPDATE users SET points = points + 10 WHERE id = ?";

      db.query(rewardSql, [req.user.id]);
    }

    res.status(201).json({
      message: "Resource added successfully 🚀"
    });
  });
});

// ================= VIEW ALL RESOURCES =================
router.get("/", verifyToken, (req, res) => {
  const sql = `
    SELECT 
      resources.*, 
      users.name AS posted_by_name,
      COUNT(likes.id) AS like_count
    FROM resources
    JOIN users ON resources.posted_by = users.id
    LEFT JOIN likes ON likes.resource_id = resources.id
    GROUP BY resources.id
    ORDER BY resources.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
});

// ================= UPDATE RESOURCE (Alumni - Own Only) =================
router.put("/:id", verifyToken, checkRole("alumni"), (req, res) => {
  const { title, description, link } = req.body;
  const resourceId = req.params.id;

  const sql = `
    UPDATE resources
    SET title = ?, description = ?, link = ?
    WHERE id = ? AND posted_by = ?
  `;

  db.query(
    sql,
    [title, description, link, resourceId, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res
          .status(403)
          .json({ message: "Not authorized or resource not found" });
      }

      res.json({ message: "Resource updated successfully" });
    }
  );
});

// ================= DELETE RESOURCE (Alumni - Own Only + Points Deduction) =================
router.delete("/:id", verifyToken, checkRole("alumni"), (req, res) => {
  const resourceId = req.params.id;

  const checkSql =
    "SELECT * FROM resources WHERE id = ? AND posted_by = ?";

  db.query(checkSql, [resourceId, req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res
        .status(403)
        .json({ message: "Not authorized or resource not found" });
    }

    // Delete resource
    const deleteSql =
      "DELETE FROM resources WHERE id = ? AND posted_by = ?";

    db.query(deleteSql, [resourceId, req.user.id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });

      // Deduct 10 points
      const deductSql =
        "UPDATE users SET points = points - 10 WHERE id = ?";

      db.query(deductSql, [req.user.id], (err3) => {
        if (err3) return res.status(500).json({ error: err3.message });

        res.json({
          message: "Resource deleted successfully",
          deduction: "10 points deducted ⚠️",
        });
      });
    });
  });
});

// ================= LIKE RESOURCE =================

router.post("/:id/like", verifyToken, (req, res) => {

  const resourceId = req.params.id;
  const userId = req.user.id;

  // ================= CHECK DUPLICATE LIKE =================
  const checkSql =
    "SELECT * FROM likes WHERE user_id = ? AND resource_id = ?";

  db.query(checkSql, [userId, resourceId], (err, result) => {

    if (err) return res.status(500).json({ error: err.message });

    if (result.length > 0) {
      return res.status(400).json({ message: "Already liked" });
    }

    // ================= INSERT LIKE =================
    const likeSql =
      "INSERT INTO likes (user_id, resource_id) VALUES (?, ?)";

    db.query(likeSql, [userId, resourceId], (err2) => {

      if (err2) return res.status(500).json({ error: err2.message });

      // ================= GET RESOURCE OWNER =================
      const ownerSql =
        "SELECT posted_by FROM resources WHERE id = ?";

      db.query(ownerSql, [resourceId], (err3, result2) => {

        if (err3) return res.status(500).json({ error: err3.message });

        const ownerId = result2[0].posted_by;

        // ================= ADD REWARD POINTS =================
        const rewardSql =
          "UPDATE users SET points = points + 5 WHERE id = ?";

        db.query(rewardSql, [ownerId]);

        // ================= ADD NOTIFICATION =================
        const notifySql =
          "INSERT INTO notifications (user_id, message) VALUES (?, ?)";

        db.query(notifySql, [
          ownerId,
          "Someone liked your resource 👍"
        ]);

        // ================= REAL-TIME EMIT =================
        const io = req.app.get("io");

        io.emit("likeUpdated", {
          resourceId: resourceId
        });

        // ================= RESPONSE =================
        res.json({
          message: "Liked successfully"
        });

      });

    });

  });

});

module.exports = router;