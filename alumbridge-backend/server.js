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

// Make io globally accessible
app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Your routes
const resourceRoutes = require("./routes/resourceRoutes");
app.use("/api/resources", resourceRoutes);

// Auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Comment routes
const commentRoutes = require("./routes/commentRoutes");
app.use("/api/comments", commentRoutes);

// User routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// Admin routes
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

// Notification routes
const notificationRoutes = require("./routes/notificationRoutes");
app.use("/api/notifications", notificationRoutes);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});