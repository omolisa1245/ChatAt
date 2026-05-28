import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";
import http from "http";

import { clerkMiddleware } from "@clerk/express";

import connectDB from "./config/db.js";

import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import streamRoutes from "./routes/streamRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import { Server } from "socket.io";

dotenv.config();

dns.setDefaultResultOrder("ipv4first");

connectDB();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors({
    origin: [
        "http://localhost:8081",
        "http://localhost:19006",
        "https://chat-at-gold.vercel.app",
        "https://chat-at-ten.vercel.app",
    ],
    credentials: true,
}));

app.use(express.json({
  limit: "100mb"
}));


app.use(express.urlencoded({
  extended: true,
  limit: "100mb",
}));



// ================= STATIC =================
app.use(
  "/uploads",
  express.static("uploads")
);

// ================= CLERK =================
app.use(clerkMiddleware());

// ================= ROUTES =================
app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/posts", postRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/stream", streamRoutes);

app.use("/api/stories", storyRoutes);

app.use(
  "/api/notifications",
  notificationRoutes
);

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("API running...");
});

// ================= SOCKET =================
const server =
  http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

io.on("connection", (socket) => {

  console.log(
    "USER CONNECTED:",
    socket.id
  );

  socket.on("join", (userId) => {

    socket.join(userId);

    console.log(
      "JOINED:",
      userId
    );
  });

  socket.on(
    "disconnect",
    () => {

      console.log(
        "USER DISCONNECTED:",
        socket.id
      );
    }
  );
});

// ================= SERVER =================
const PORT =
  process.env.PORT || 5000;

server.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      `Server running on ${PORT}`
    );
  }
);