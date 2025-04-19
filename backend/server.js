const http = require('http');
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

// Models
const ChatMessage = require("./models/ChatMessage");
const Enrollment = require("./models/Enrollment");
const User = require("./models/User");
const Notification = require("./models/Notification");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ✅ Initialize socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with frontend URL in production
    methods: ["GET", "POST"]
  }
});

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/videos", require("./routes/videoRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/enroll", require("./routes/enrollmentRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));




// ✅ Socket.io Authentication
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Auth token missing"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error("User not found");

    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Authentication failed"));
  }
});

// ✅ Real-time Communication Logic
io.on("connection", (socket) => {
  const user = socket.user;

  // 🧑‍🏫 Join course room
  socket.on("join_room", async (courseId) => {
    const isTutor = user.role === "tutor";
    const isEnrolled = await Enrollment.findOne({ course: courseId, student: user._id });

    if (isTutor || isEnrolled) {
      socket.join(courseId);
    } else {
      socket.emit("error", "Not enrolled in course");
    }
  });

  // 🗨️ New chat message
  socket.on("new_message", async ({ courseId, message }) => {
    const msg = await ChatMessage.create({
      course: courseId,
      sender: user._id,
      message,
      type: "message",
    });

    io.to(courseId).emit("new_message", {
      _id: msg._id,
      message: msg.message,
      sender: { _id: user._id, name: user.name, role: user.role },
      createdAt: msg.createdAt,
    });
  });

  // 📣 Tutor announcement
  socket.on("announce", async ({ courseId, message }) => {
    if (user.role !== "tutor") return;

    const msg = await ChatMessage.create({
      course: courseId,
      sender: user._id,
      message,
      type: "announcement",
    });
    const enrollments = await Enrollment.find({ course: courseId });

  for (const enrollment of enrollments) {
    await Notification.create({
      course: courseId,
      recipient: enrollment.student,
      message,
    });
  }

    io.to(courseId).emit("announce", {
      _id: msg._id,
      message: msg.message,
      sender: { _id: user._id, name: user.name },
      createdAt: msg.createdAt,
    });
  });

  // ❌ Delete message (tutor only)
  socket.on("delete_message", async (msgId) => {
    if (user.role !== "tutor") return;

    await ChatMessage.findByIdAndDelete(msgId);
    io.emit("delete_message", msgId);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
