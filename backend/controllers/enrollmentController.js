const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Video = require("../models/Video");

// 🔹 Enroll student
const enrollInCourse = async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user._id;

  const existing = await Enrollment.findOne({ student: studentId, course: courseId });
  if (existing) return res.status(400).json({ message: "Already enrolled" });

  const enrollment = await Enrollment.create({
    student: studentId,
    course: courseId,
    progress: { completedVideos: [] },
  });

  res.status(201).json(enrollment);
};

// 🔹 Get enrolled courses
const getMyEnrollments = async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate("course")
    .populate("progress.completedVideos");
  res.json(enrollments);
};

// 🔹 Mark video as watched
const markVideoWatched = async (req, res) => {
  const { courseId, videoId } = req.params;
  const studentId = req.user._id;

  const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
  if (!enrollment) return res.status(404).json({ message: "Not enrolled in course" });

  const alreadyWatched = enrollment.progress.completedVideos.includes(videoId);
  if (!alreadyWatched) {
    enrollment.progress.completedVideos.push(videoId);
    await enrollment.save();
  }

  res.json({ message: "Video marked as watched", progress: enrollment.progress });
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  markVideoWatched,
};
