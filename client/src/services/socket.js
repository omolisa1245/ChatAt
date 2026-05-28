import { io } from "socket.io-client";

export const socket = io("https://chat-at-gold.vercel.app");

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});