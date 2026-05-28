import express from "express";
import {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// CREATE
router.post("/", createNotification);

// GET USER NOTIFICATIONS
router.get("/:userId", getNotifications);

// MARK AS READ
router.put("/read/:id", markAsRead);

// DELETE
router.delete("/:id", deleteNotification);

export default router;