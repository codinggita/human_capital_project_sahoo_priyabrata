// Handle synchronous uncaught exceptions gracefully before starting anything
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from the root directory
dotenv.config({ path: path.join(__dirname, "../.env") });

// Import the configured Express app and database connection logic
const app = require("./app");
const connectDB = require("./config/db");

// Connect database before starting the server to ensure safety
connectDB();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const { Server } = require("socket.io");

// Start the Express server securely
const server = app.listen(PORT, () => {
  console.log(
    `[🚀 Server] Running efficiently in ${NODE_ENV} mode on port ${PORT}...`,
  );
});

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  }
});

// Expose io instance to Express app
app.set("io", io);

// Handle connections
io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id);
  // Allow admins to subscribe to admin notifications
  socket.on("join_admin", () => {
    console.log("Socket joined admin_room:", socket.id);
    socket.join("admin_room");
  });
  
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Handle asynchronous unhandled rejections gracefully
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
