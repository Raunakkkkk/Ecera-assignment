import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import Interest from "../models/Interest.js";

const router = express.Router();

// Get current user profile
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put(
  "/profile",
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("age")
      .optional()
      .isInt({ min: 18, max: 100 })
      .withMessage("Age must be between 18 and 100"),
    body("location")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Location cannot be empty"),
    body("occupation")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Occupation cannot be empty"),
    body("interestedIn")
      .optional()
      .isIn(["male", "female", "both"])
      .withMessage("Interested in must be male, female, or both"),
    body("about")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("About section cannot exceed 500 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const updates = req.body;
      const allowedUpdates = [
        "name",
        "age",
        "location",
        "occupation",
        "interestedIn",
        "about",
      ];
      const filteredUpdates = {};

      allowedUpdates.forEach((field) => {
        if (updates[field] !== undefined) {
          filteredUpdates[field] = updates[field];
        }
      });

      const user = await User.findByIdAndUpdate(req.user._id, filteredUpdates, {
        new: true,
        runValidators: true,
      }).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Search users
router.get("/search", async (req, res) => {
  try {
    const {
      minAge = 18,
      maxAge = 100,
      gender,
      location,
      page = 1,
      limit = 10,
    } = req.query;

    // Get current user to check their preferences
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get users to whom current user has already sent interest
    const sentInterests = await Interest.find({
      fromUser: req.user._id,
    }).select("toUser");

    const excludedUserIds = sentInterests.map((interest) => interest.toUser);

    const query = {
      _id: {
        $ne: req.user._id, // Exclude current user
        $nin: excludedUserIds, // Exclude users to whom interest has been sent
      },
      age: { $gte: parseInt(minAge), $lte: parseInt(maxAge) },
    };

    // Filter by gender based on current user's interestedIn preference
    if (currentUser.interestedIn === "male") {
      query.gender = "male";
    } else if (currentUser.interestedIn === "female") {
      query.gender = "female";
    } else if (currentUser.interestedIn === "both") {
      // Show both genders
    }

    // Also filter users who are interested in current user's gender
    const interestedInQuery = {};
    if (currentUser.gender === "male") {
      interestedInQuery.$or = [
        { interestedIn: "male" },
        { interestedIn: "both" },
      ];
    } else if (currentUser.gender === "female") {
      interestedInQuery.$or = [
        { interestedIn: "female" },
        { interestedIn: "both" },
      ];
    } else {
      // For "other" gender, show users interested in "both"
      interestedInQuery.interestedIn = "both";
    }

    // Combine the queries
    Object.assign(query, interestedInQuery);

    // Add additional filters from request
    if (gender) {
      query.gender = gender;
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalUsers: total,
        hasNext: skip + users.length < total,
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user by ID (for viewing other profiles)
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
