import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    userId: String,
    username: String,
    userAvatar: String,

    items: [
      {
        type: {
          type: String,
          enum: ["image", "video"],
        },
        url: String,
        caption: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    reactions: [
      {
        userId: String,
        emoji: String,
        storyId: String, // optional (important if multiple items)
      },
    ],

    replies: [
      {
        userId: String,
        text: String,
        createdAt: Date,
      },
    ],

    viewers: [String],

    expiresAt: {
      type: Date,
      default: () =>
        new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

export default mongoose.model("Story", storySchema);