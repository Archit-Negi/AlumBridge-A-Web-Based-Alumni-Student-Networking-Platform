const express = require("express");
const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// ================= ADD COMMENT (REAL-TIME) =================
router.post("/:id", verifyToken, (req, res) => {

  const resourceId = req.params.id;
  const userId = req.user.id;
  const { text } = req.body;
  console.log("Comment API HIT");
  console.log(req.body);

  if (!text) {
    return res.status(400).json({ message: "Comment cannot be empty" });
  }

  const sql =
    "INSERT INTO comments (user_id, resource_id, comment) VALUES (?, ?, ?)";

  db.query(sql, [userId, resourceId, text], (err) => {

    if (err) return res.status(500).json({ error: err.message });

    // 🔴 GET USER NAME FOR REAL-TIME
    const userSql = "SELECT name FROM users WHERE id = ?";

    db.query(userSql, [userId], (err2, result) => {

      const userName = result[0].name;

      // 🔴 SOCKET EMIT
      const io = req.app.get("io");

      io.emit("newComment", {
        resourceId,
        name: userName,
        text
      });

      res.json({ message: "Comment added" });

    });

  });

});

// ================= GET COMMENTS =================
router.get("/:id", verifyToken, (req, res) => {

  const resourceId = req.params.id;

  const sql = `
  SELECT comments.id, comments.comment, users.name
  FROM comments
  JOIN users ON comments.user_id = users.id
  WHERE resource_id = ?
  ORDER BY comments.created_at DESC
`;

  db.query(sql, [resourceId], (err, results) => {

    if (err) return res.status(500).json({ error: err.message });

    res.json(results);

  });

});

module.exports = router;