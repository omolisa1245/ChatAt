import express from "express";

import {
  followUser,
  getFollowingUsers,
  getProfileById,
  getUserProfile,
  getUsers,
  updateUserProfile,
} from "../controllers/userController.js";

import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// ================= CURRENT USER =================
router.get(
  "/profile",
  requireAuth,
  getUserProfile
);

router.put(
  "/profile",
  requireAuth,
  updateUserProfile
);

// ================= USERS =================
router.get("/", getUsers);

router.get(
  "/profile/:id",
  getProfileById
);

// ================= FOLLOW =================
router.put(
  "/follow/:id",
  requireAuth,
  followUser
);

// ================= FOLLOWING USERS =================
router.get(
  "/following-users",
  requireAuth,
  getFollowingUsers
);

export default router;