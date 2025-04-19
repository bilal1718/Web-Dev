const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  enrollInCourse,
  getMyEnrollments,
  markVideoWatched,
} = require("../controllers/enrollmentController");

// 📌 Enroll in a course
router.post("/:courseId", protect, enrollInCourse);

// 📌 Get all my enrolled courses
router.get("/my", protect, getMyEnrollments);

// 📌 Mark video as watched
router.patch("/progress/:courseId/:videoId", protect, markVideoWatched);

module.exports = router;
