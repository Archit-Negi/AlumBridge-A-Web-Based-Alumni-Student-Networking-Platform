require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Referral routes
const referralRoutes = require("./routes/referralRoutes");
app.use("/api/referrals", referralRoutes);

// Network routes
const networkRoutes = require("./routes/networkRoutes");
app.use("/api/network", networkRoutes);

// Message routes
const messageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", messageRoutes);

// Your other routes
const resourceRoutes = require("./routes/resourceRoutes");
app.use("/api/resources", resourceRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const commentRoutes = require("./routes/commentRoutes");
app.use("/api/comments", commentRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const notificationRoutes = require("./routes/notificationRoutes");
app.use("/api/notifications", notificationRoutes);

const db = require("./config/db");

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their private room.`);
  });

  socket.on("send_message", ({ senderId, receiverId, content }) => {
    // Save to DB
    const sql = "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)";
    db.query(sql, [senderId, receiverId, content], (err, result) => {
      if (err) {
        console.error("Error saving message:", err.message);
        return;
      }
      
      // Emit to receiver's room
      io.to(`user_${receiverId}`).emit("receive_message", {
        id: result.insertId,
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        created_at: new Date()
      });

      // Emit back to sender (for confirmation/sync)
      socket.emit("message_sent", {
        id: result.insertId,
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        created_at: new Date()
      });
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});