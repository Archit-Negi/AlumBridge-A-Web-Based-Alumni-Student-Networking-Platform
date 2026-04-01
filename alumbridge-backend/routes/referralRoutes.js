const express = require("express");
const db = require("../config/db");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

const router = express.Router();

// ================= CREATE A REFERRAL (Alumni) =================
router.post("/", verifyToken, checkRole("alumni"), (req, res) => {
  const alumniId = req.user.id;
  const { student_name, student_email, company, role, message } = req.body;

  if (!student_name || !student_email || !company || !role) {
    return res.status(400).json({ error: "Please provide all required fields." });
  }

  const sqlInsert = `
    INSERT INTO referrals (alumni_id, student_name, student_email, company, role, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sqlInsert, [alumniId, student_name, student_email, company, role, message || ""], (err, insertResult) => {
    if (err) return res.status(500).json({ error: err.message });

    // Give 10 points to alumni locally
    const sqlUpdatePoints = "UPDATE users SET points = points + 10 WHERE id = ?";
    db.query(sqlUpdatePoints, [alumniId], (errPoints) => {
      if (errPoints) return res.status(500).json({ error: errPoints.message });

      res.status(201).json({ message: "Referral submitted successfully. You earned 10 points!", pointsAwarded: 10 });
    });
  });
});

// ================= GET MY REFERRALS (Alumni) =================
router.get("/my-referrals", verifyToken, checkRole("alumni"), (req, res) => {
  const alumniId = req.user.id;
  const sql = "SELECT * FROM referrals WHERE alumni_id = ? ORDER BY created_at DESC";

  db.query(sql, [alumniId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ================= GET ALL REFERRALS (Admin) =================
router.get("/", verifyToken, checkRole("admin"), (req, res) => {
  const sql = `
    SELECT r.*, u.name as alumni_name, u.email as alumni_email 
    FROM referrals r
    JOIN users u ON r.alumni_id = u.id
    ORDER BY r.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ================= UPDATE REFERRAL STATUS (Admin) =================
router.patch("/:id/status", verifyToken, checkRole("admin"), (req, res) => {
  const referralId = req.params.id;
  const { status } = req.body;

  if (!["Pending", "Selected", "Rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  // First fetch the referral to know its previous status and the alumni_id
  const sqlFetch = "SELECT alumni_id, status FROM referrals WHERE id = ?";
  db.query(sqlFetch, [referralId], (err, fetchedResults) => {
    if (err) return res.status(500).json({ error: err.message });
    if (fetchedResults.length === 0) return res.status(404).json({ error: "Referral not found." });

    const referral = fetchedResults[0];

    // If already in the target status, do nothing
    if (referral.status === status) {
      return res.json({ message: `Referral is already ${status}` });
    }

    const sqlUpdateStatus = "UPDATE referrals SET status = ? WHERE id = ?";
    db.query(sqlUpdateStatus, [status, referralId], (errUpdate) => {
      if (errUpdate) return res.status(500).json({ error: errUpdate.message });

      // If updating to Selected, give 50 points
      if (status === "Selected" && referral.status !== "Selected") {
        const sqlPoints = "UPDATE users SET points = points + 50 WHERE id = ?";
        db.query(sqlPoints, [referral.alumni_id], (errPoints) => {
          if (errPoints) return res.status(500).json({ error: errPoints.message });
          res.json({ message: "Referral status updated to Selected. 50 bonus points awarded to the alumni." });
        });
      } 
      // If updating from Selected to something else, we could deduct the 50 points, but to keep it simple and match requirements we'll just return. 
      else {
        res.json({ message: `Referral status updated to ${status}.` });
      }
    });
  });
});

module.exports = router;
