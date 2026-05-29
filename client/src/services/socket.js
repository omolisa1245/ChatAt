import { io } from "socket.io-client";

export const socket = io(
  "https://chat-at-gold.vercel.app",
  {
    transports: ["websocket"], // IMPORTANT
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
  }
);

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("SOCKET ERROR:", err.message);
});