const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  videoUrl: { type: String, required: true },
  order: { type: Number, default: 0 },
  transcript: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Video", videoSchema);
