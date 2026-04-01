const db = require("./config/db");

const createTableQuery = `
CREATE TABLE IF NOT EXISTS referrals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  alumni_id INT,
  student_name VARCHAR(255) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  message TEXT,
  status ENUM('Pending', 'Selected', 'Rejected') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (alumni_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

db.query(createTableQuery, (err, results) => {
  if (err) {
    console.error("Error creating referrals table:", err.message);
  } else {
    console.log("Referrals table created successfully.");
  }
  process.exit();
});
