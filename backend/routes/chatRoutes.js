const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/:courseId", protect, chatController.getChatMessages);
router.post("/:courseId", protect, chatController.postMessage);
router.delete("/:msgId", protect, chatController.deleteMessage);

module.exports = router;
