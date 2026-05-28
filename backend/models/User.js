import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ================= CLERK =================
    clerkId: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },

    // ================= LOCAL AUTH =================
    password: {
      type: String,
      default: "",
    },

    authType: {
      type: String,
      enum: [
        "clerk",
        "local",
        "oauth",
      ],
      default: "local",
    },

    // ================= PROFILE =================
    name: {
      type: String,
      default: "",
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    image: {
      type: String,
      default: "https://i.pravatar.cc/300",
    },

    bio: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    // ================= SOCIAL =================
    followers: [
      {
        type: String,
      },
    ],

    following: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "User",
  userSchema
);