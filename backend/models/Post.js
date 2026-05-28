import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
    type: String,
    uri: String,
});

/* ================= REPLY ================= */

const ReplySchema = new mongoose.Schema(
    {
        userId: String,

        username: String,

        userAvatar: String,

        text: {
            type: String,
            default: "",
        },

        attachments: [attachmentSchema],

        likes: {
            type: [String],
            default: [],
        },

        replies: [],
    },
    {
        timestamps: true,
    }
);

/* RECURSIVE REPLIES */
ReplySchema.add({
    replies: [ReplySchema],
});

/* ================= COMMENT ================= */

const CommentSchema = new mongoose.Schema(
    {
        userId: String,

        username: String,

        userAvatar: String,

        text: {
            type: String,
            default: "",
        },

        attachments: [attachmentSchema],

        likes: {
            type: [String],
            default: [],
        },

        replies: [ReplySchema],
    },
    {
        timestamps: true,
    }
);

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    username: {
      type: String,
      default: "User",
    },

    userAvatar: {
      type: String,
      default: "",
    },

    content: {
      type: String,
      default: "",
    },

    media: [
      {
        type: {
          type: String,
          enum: ["image", "video"],
          required: true,
        },

        url: {
          type: String,
          required: true,
        },
      },
    ],

    filter: {
      type: String,
      default: "Normal",
    },

    likes: {
      type: [String],
      default: [],
    },

    bookmarks: {
      type: [String],
      default: [],
    },

    reposts: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },

    shares: {
      type: Number,
      default: 0,
    },

    viewers: {
      type: [String],
      default: [],
    },

    //  COMMENTS
    comments: [CommentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);