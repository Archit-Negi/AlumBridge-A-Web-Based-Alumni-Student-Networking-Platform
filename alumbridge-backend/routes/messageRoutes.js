const express = require("express");
const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// GET CHAT HISTORY WITH A SPECIFIC USER
router.get("/:otherUserId", verifyToken, (req, res) => {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    const sql = `
        SELECT * FROM messages 
        WHERE (sender_id = ? AND receiver_id = ?) 
        OR (sender_id = ? AND receiver_id = ?)
        ORDER BY created_at ASC
    `;

    db.query(sql, [userId, otherUserId, otherUserId, userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET RECENT CONVERSATIONS (The users you've chatted with)
router.get("/conversations/list", verifyToken, (req, res) => {
    const userId = req.user.id;

    const sql = `
        SELECT DISTINCT u.id, u.name, u.role
        FROM users u
        INNER JOIN (
            SELECT receiver_id as peer_id FROM messages WHERE sender_id = ?
            UNION
            SELECT sender_id as peer_id FROM messages WHERE receiver_id = ?
        ) AS peers ON u.id = peers.peer_id
    `;

    db.query(sql, [userId, userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

module.exports = router;
