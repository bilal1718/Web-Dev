const ChatMessage = require("../models/ChatMessage");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// GET chat history
exports.getChatMessages = async (req, res) => {
  try {
    const { courseId } = req.params;

    const messages = await ChatMessage.find({ course: courseId })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to get messages", details: err.message });
  }
};

// POST a new message
exports.postMessage = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { message } = req.body;
    const userId = req.user._id; // assumes auth middleware adds req.user

    // Check enrollment or tutor
    const isTutor = req.user.role === "tutor";
    const isEnrolled = await Enrollment.findOne({ student: userId, course: courseId });

    if (!isTutor && !isEnrolled) {
      return res.status(403).json({ error: "Access denied" });
    }

    const newMsg = await ChatMessage.create({
      course: courseId,
      sender: userId,
      message,
      type: "message"
    });

    res.json(newMsg);
  } catch (err) {
    res.status(500).json({ error: "Failed to post message", details: err.message });
  }
};

// DELETE a message (tutor only)
exports.deleteMessage = async (req, res) => {
  try {
    if (req.user.role !== "tutor") {
      return res.status(403).json({ error: "Only tutors can delete messages" });
    }

    await ChatMessage.findByIdAndDelete(req.params.msgId);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
};
