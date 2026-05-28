import Notification from "../models/Notification.js";

export const createNotification = async ({
  io,
  toUserId,
  fromUser,
  type,
  message,
  postImage = null,
}) => {
  try {
    // prevent self-notifications (optional but recommended)
    if (toUserId === fromUser.id) return;

    const notification = await Notification.create({
      toUserId,
      fromUser,
      type,
      message,
      postImage,
    });

    // realtime emit
    io.to(toUserId).emit("new_notification", notification);

    return notification;
  } catch (err) {
    console.log("Notification Error:", err.message);
  }
};

// GET USER NOTIFICATIONS
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({
      toUserId: userId,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// MARK AS READ
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndUpdate(id, {
      read: true,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE NOTIFICATION (optional)
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndDelete(id);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};