const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "edtech-videos",
    resource_type: "video",
    format: async () => "mp4",
    public_id: (req, file) => `video-${Date.now()}`,
  },
});

const upload = multer({ storage });

module.exports = upload;
