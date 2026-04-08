const express = require("express");
const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// SEARCH USERS
router.get("/search", verifyToken, (req, res) => {
    const { query } = req.query;
    const userId = req.user.id;

    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }

    // Search users by name, excluding current user and those already connected or pending
    const sql = `
        SELECT id, name, role, points 
        FROM users 
        WHERE (name LIKE ? OR role LIKE ?) 
        AND id != ?
        AND id NOT IN (
            SELECT receiver_id FROM connections WHERE sender_id = ?
            UNION
            SELECT sender_id FROM connections WHERE receiver_id = ?
        )
        LIMIT 20
    `;

    const searchTerm = `%${query}%`;
    db.query(sql, [searchTerm, searchTerm, userId, userId, userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// SEND CONNECTION REQUEST
router.post("/request", verifyToken, (req, res) => {
    const senderId = req.user.id;
    const { receiverId } = req.body;

    if (!receiverId) {
        return res.status(400).json({ message: "Receiver ID is required" });
    }

    const sql = "INSERT INTO connections (sender_id, receiver_id, status) VALUES (?, ?, 'pending')";
    
    db.query(sql, [senderId, receiverId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Connection request sent" });
    });
});

// GET PENDING REQUESTS
router.get("/requests", verifyToken, (req, res) => {
    const userId = req.user.id;

    const sql = `
        SELECT c.id as connectionId, u.id as userId, u.name, u.role 
        FROM connections c
        JOIN users u ON c.sender_id = u.id
        WHERE c.receiver_id = ? AND c.status = 'pending'
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// RESPOND TO REQUEST (Accept/Reject)
router.put("/respond", verifyToken, (req, res) => {
    const userId = req.user.id;
    const { connectionId, status } = req.body; // status: 'accepted' or 'rejected'

    if (!connectionId || !['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid request payload" });
    }

    const sql = "UPDATE connections SET status = ? WHERE id = ? AND receiver_id = ?";

    db.query(sql, [status, connectionId, userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Request not found or unauthorized" });
        }
        res.json({ message: `Connection request ${status}` });
    });
});

// LIST CONNECTIONS
router.get("/connections", verifyToken, (req, res) => {
    const userId = req.user.id;

    const sql = `
        SELECT u.id, u.name, u.role, u.points
        FROM users u
        JOIN connections c ON (u.id = c.sender_id OR u.id = c.receiver_id)
        WHERE (c.sender_id = ? OR c.receiver_id = ?) 
        AND c.status = 'accepted'
        AND u.id != ?
    `;

    db.query(sql, [userId, userId, userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

module.exports = router;
