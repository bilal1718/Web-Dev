const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const protectTutor = (req, res, next) => {
  if (req.user && req.user.role === "tutor") {
    next();
  } else {
    return res.status(403).json({ message: "Only tutors allowed" });
  }
};

// ✅ Export both
module.exports = {
  protect,
  protectTutor,
};
