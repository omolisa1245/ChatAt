import express from "express";

import {
  register,
  login,
  syncUser,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post(
  "/sync",
  requireAuth,
  syncUser
);

export default router;