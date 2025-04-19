// controllers/notificationController.js
const Notification = require("../models/Notification");
const Enrollment = require("../models/Enrollment");

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

exports.sendAnnouncement = async (req, res) => {
  const { courseId } = req.params;
  const { message } = req.body;

  try {
    if (req.user.role !== "tutor") return res.status(403).json({ message: "Only tutors can send announcements" });

    const enrollments = await Enrollment.find({ course: courseId });

    for (const enrollment of enrollments) {
      await Notification.create({
        course: courseId,
        recipient: enrollment.student,
        message,
      });
    }

    res.json({ message: "Announcement sent to students" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send announcement" });
  }
};
