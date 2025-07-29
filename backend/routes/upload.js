import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Upload profile photo
router.post(
  "/profile-photo",
  upload.single("profilePhoto"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Please upload an image file" });
      }

      const photoUrl = `/uploads/${req.file.filename}`;

      // Update user's profile photo
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { profilePhoto: photoUrl },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "Profile photo uploaded successfully",
        profilePhoto: photoUrl,
        user,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
