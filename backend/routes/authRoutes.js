const express = require("express");
const router = express.Router();
const { register, login, getMe, getTutorProfile } = require("../controllers/authController");
const {protect} = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

router.get("/:id", getTutorProfile);


module.exports = router;
