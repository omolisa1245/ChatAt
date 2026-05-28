import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    toUserId: { type: String, required: true },   // receiver
    fromUser: {
      id: String,
      username: String,
      name: String,
      image: String,
    },

    type: {
      type: String,
      enum: [
        "like",
        "comment",
        "follow",
        "mention",
        "story",
        "share",
        "repost",
      ],
      required: true,
    },
    message: { type: String, default: "" },

    postImage: { type: String, default: null },

    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);