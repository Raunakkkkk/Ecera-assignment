import mongoose from "mongoose";

const interestSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    message: {
      type: String,
      trim: true,
      maxlength: [200, "Message cannot exceed 200 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique combination of fromUser and toUser
interestSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

const Interest = mongoose.model("Interest", interestSchema);

export default Interest;
