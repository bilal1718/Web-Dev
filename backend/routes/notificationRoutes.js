// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { getMyNotifications, sendAnnouncement } = require("../controllers/notificationController");

// 🧑‍🎓 Student: get my notifications
router.get("/my", protect, getMyNotifications);

// 🧑‍🏫 Tutor: send announcement
router.post("/:courseId", protect, sendAnnouncement);

module.exports = router;
