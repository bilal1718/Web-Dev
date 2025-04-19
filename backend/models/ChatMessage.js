const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['message', 'announcement'],
    default: 'message',
  }
}, { timestamps: true });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
