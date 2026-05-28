import Notification from "../models/Notification.js";

export const createNotification = async ({
  io,
  toUserId,
  fromUser,
  type,
  message,
  postImage = null,
}) => {
  const notification = await Notification.create({
    toUserId,
    fromUser,
    type,
    message,
    postImage,
  });

  if (io) {
    io.to(toUserId).emit("new_notification", notification);
  }

  return notification;
};