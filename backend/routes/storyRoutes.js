import express from "express";
import {
  createStory,
  getStories,
  getUserStories,
  markStorySeen,
  reactToStory,
  replyToStory,
} from "../controllers/storyController.js";
import { requireAuth } from "../middleware/requireAuth.js";

console.log(" STORY ROUTES LOADED");

const router = express.Router();

router.post("/", requireAuth, createStory);
router.get("/", getStories);
router.get("/user/:userId", getUserStories);
router.post("/seen", markStorySeen);
router.post("/:id/react", reactToStory);
router.post("/:id/reply", replyToStory);

export default router;