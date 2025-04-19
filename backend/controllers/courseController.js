const asyncHandler = require("express-async-handler");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");


// POST /api/courses
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, thumbnail, price, isPremium } = req.body;
  const course = await Course.create({
    title,
    description,
    thumbnail,
    price,
    isPremium,
    tutor: req.user._id
  });
  res.status(201).json(course);
});

// GET /api/courses/my
const getMyCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ tutor: req.user._id });
  res.status(200).json(courses);
});

// PATCH /api/courses/:id
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }
  if (String(course.tutor) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Not authorized");
  }
  const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE /api/courses/:id
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }
  if (String(course.tutor) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Not authorized");
  }
  await course.deleteOne();
  res.json({ message: "Course deleted" });
});
const getAllCourses = asyncHandler ( async (req, res) => {
    try {
      const courses = await Course.find().populate("tutor", "name");
      res.json(courses);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });


  const getCourseById = asyncHandler (async (req, res) => {
    try {
      const course = await Course.findById(req.params.id).populate("tutor", "name");
      if (!course) return res.status(404).json({ message: "Course not found" });
  
      res.json(course);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

// GET /api/courses/:id
const getStudentsInCourse = asyncHandler(async (req, res) => {
  try {
    const courseId = req.params.id;

    const enrollments = await Enrollment.find({ course: courseId }).populate("student", "name email");

    const students = enrollments.map(enroll => enroll.student);

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error.message);
    res.status(500).json({ message: "Failed to fetch students" });
  }
});
module.exports = {
  getStudentsInCourse,
    getAllCourses,
    getCourseById,
  createCourse,
  getMyCourses,
  updateCourse,
  deleteCourse
};
