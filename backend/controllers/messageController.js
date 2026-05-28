import Message from "../models/Message.js";

// SEND MESSAGE
export const sendMessage = async (req, res) => {
  try {
    const {
      sender,
      senderName,
      senderImage,
      receiver,
      text,
      attachments,
      messageType,
      sharedPost,
    } = req.body;

    console.log("Incoming message:", req.body);
    const message = await Message.create({
      sender,
      senderName,
      senderImage,
      receiver,

      text: text || "",

      attachments: attachments || [],

      messageType: messageType || "text",

      sharedPost: sharedPost || null,
    });
    
    console.log("SENDER:", sender);
    console.log("RECEIVER:", receiver);
    res.status(200).json(message);

  } catch (error) {
    console.log("SEND MESSAGE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET ALL USER CHATS (IMPORTANT)
export const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId },
      ],
    }).sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json(err.message);
  }
};


// GET CHAT MESSAGES
export const getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// TOGGLE STAR
export const toggleStar = async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);

    msg.starred = !msg.starred;
    await msg.save();

    res.json(msg);
  } catch (err) {
    res.status(500).json(err.message);
  }
};



export const markRead = async (req, res) => {
  try {

    const {
      senderId,
      receiverId,
    } = req.body;

    await Message.updateMany(
      {
        sender: senderId,
        receiver: receiverId,
        read: false,
      },
      {
        read: true,
      }
    );

    res.json({
      success: true,
    });

  } catch (err) {

    console.log("MARK READ ERROR:", err);

    res.status(500).json(err.message);
  }
};