const express = require("express");
const router = express.Router();
const {
  getMyCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById
} = require("../controllers/courseController");
const { protect, protectTutor } = require("../middlewares/authMiddleware");

router.get("/my", protect, protectTutor, getMyCourses);
router.post("/", protect, protectTutor, createCourse);
router.patch("/:id", protect, protectTutor, updateCourse);
router.delete("/:id", protect, protectTutor, deleteCourse);

router.get("/", getAllCourses);
router.get("/:id", getCourseById);

module.exports = router;
