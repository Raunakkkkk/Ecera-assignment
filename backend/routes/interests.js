import express from "express";
import { body, validationResult } from "express-validator";
import Interest from "../models/Interest.js";
import User from "../models/User.js";

const router = express.Router();

// Send interest to a user
router.post(
  "/send",
  [
    body("toUserId").isMongoId().withMessage("Invalid user ID"),
    body("message")
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Message cannot exceed 200 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { toUserId, message } = req.body;
      const fromUserId = req.user._id;

      // Check if user is trying to send interest to themselves
      if (fromUserId.toString() === toUserId) {
        return res
          .status(400)
          .json({ message: "Cannot send interest to yourself" });
      }

      // Check if interest already exists
      const existingInterest = await Interest.findOne({
        fromUser: fromUserId,
        toUser: toUserId,
      });

      if (existingInterest) {
        return res.status(400).json({ message: "Interest already sent" });
      }

      // Create new interest
      const interest = new Interest({
        fromUser: fromUserId,
        toUser: toUserId,
        message,
      });

      await interest.save();

      res.status(201).json({ message: "Interest sent successfully", interest });
    } catch (error) {
      console.error("Send interest error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get interests received by current user (only pending ones)
router.get("/received", async (req, res) => {
  try {
    const interests = await Interest.find({
      toUser: req.user._id,
      status: "pending",
    })
      .populate(
        "fromUser",
        "name email phone age gender location occupation profilePhoto about"
      )
      .sort({ createdAt: -1 });

    res.json(interests);
  } catch (error) {
    console.error("Get received interests error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get interests sent by current user
router.get("/sent", async (req, res) => {
  try {
    const interests = await Interest.find({ fromUser: req.user._id })
      .populate(
        "toUser",
        "name email phone age gender location occupation profilePhoto about"
      )
      .sort({ createdAt: -1 });

    res.json(interests);
  } catch (error) {
    console.error("Get sent interests error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Accept or reject interest
router.put(
  "/:interestId/respond",
  [
    body("status")
      .isIn(["accepted", "rejected"])
      .withMessage("Status must be either 'accepted' or 'rejected'"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { status } = req.body;
      const interestId = req.params.interestId;

      const interest = await Interest.findById(interestId);

      if (!interest) {
        return res.status(404).json({ message: "Interest not found" });
      }

      // Check if the current user is the recipient
      if (interest.toUser.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to respond to this interest" });
      }

      interest.status = status;
      await interest.save();

      res.json({ message: `Interest ${status}`, interest });
    } catch (error) {
      console.error("Respond to interest error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Cancel interest (only by sender)
router.delete("/:interestId/cancel", async (req, res) => {
  try {
    const interestId = req.params.interestId;

    const interest = await Interest.findById(interestId);

    if (!interest) {
      return res.status(404).json({ message: "Interest not found" });
    }

    // Check if the current user is the sender
    if (interest.fromUser.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this interest" });
    }

    // Only allow cancellation if status is pending
    if (interest.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Cannot cancel interest that has been responded to" });
    }

    await Interest.findByIdAndDelete(interestId);

    res.json({ message: "Interest cancelled successfully" });
  } catch (error) {
    console.error("Cancel interest error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get mutual matches (where either user sent interest and it was accepted)
router.get("/matches", async (req, res) => {
  try {
    const userId = req.user._id;

    // Find interests where current user sent and got accepted
    const sentAccepted = await Interest.find({
      fromUser: userId,
      status: "accepted",
    }).populate(
      "toUser",
      "name email phone age gender location occupation profilePhoto about"
    );

    // Find interests where current user received and accepted
    const receivedAccepted = await Interest.find({
      toUser: userId,
      status: "accepted",
    }).populate(
      "fromUser",
      "name email phone age gender location occupation profilePhoto about"
    );

    // Combine all matches - both sent and received accepted interests
    const matches = [];

    // Add matches where I sent interest and they accepted
    sentAccepted.forEach((interest) => {
      matches.push({
        user: interest.toUser,
        matchedAt: interest.updatedAt,
      });
    });

    // Add matches where they sent interest and I accepted
    receivedAccepted.forEach((interest) => {
      matches.push({
        user: interest.fromUser,
        matchedAt: interest.updatedAt,
      });
    });

    // Remove duplicates (in case both users sent interests to each other)
    const uniqueMatches = matches.reduce((acc, current) => {
      const existing = acc.find(
        (match) => match.user._id.toString() === current.user._id.toString()
      );
      if (!existing) {
        acc.push(current);
      } else {
        // Keep the earlier match date
        if (new Date(current.matchedAt) < new Date(existing.matchedAt)) {
          existing.matchedAt = current.matchedAt;
        }
      }
      return acc;
    }, []);

    res.json(uniqueMatches);
  } catch (error) {
    console.error("Get matches error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
