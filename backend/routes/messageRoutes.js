import express from "express";
import {
  sendMessage,
  getMessages,
  toggleStar,
  markRead,
  getUserChats,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/send", sendMessage);

// IMPORTANT:
router.get("/chats/:userId", getUserChats);

router.get("/:user1/:user2", getMessages);

router.put("/star/:id", toggleStar);

router.put("/read/:id", markRead);

export default router;