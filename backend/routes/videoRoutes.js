const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const {
  uploadVideo,
  reorderVideos,
  updateVideo,
  generateTranscript,
} = require("../controllers/videoController");
const { protect, protectTutor } = require("../middlewares/authMiddleware");

// POST /api/videos/upload/:courseId
router.post("/upload/:courseId", protect, protectTutor, upload.single("video"), uploadVideo);

// POST /api/videos/transcribe/:videoId
router.post("/transcribe/:videoId", protect, protectTutor, generateTranscript);

// PATCH /api/videos/reorder/:courseId
router.patch("/reorder/:courseId", protect, protectTutor, reorderVideos);

// PATCH /api/videos/:id
router.patch("/:id", protect, protectTutor, upload.single("video"), updateVideo);

module.exports = router;
