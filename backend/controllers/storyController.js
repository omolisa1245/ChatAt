import Story from "../models/Story.js";
import User from "../models/User.js";
import { getAuth } from "@clerk/express";
import { createNotification } from "../utils/createNotification.js";


export const createStory = async (req, res) => {
  try {

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { username, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Story items required",
      });
    }

    // GET REAL USER FROM DATABASE
    const user = await User.findOne({
      clerkId: userId,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const formattedItems = items.map((item) => ({
      type: item.type,
      url: item.url,
      caption: item.caption || "",
      createdAt: new Date(),
    }));

    let story = await Story.findOne({
      userId,
    });

    if (story) {

      story.items.push(...formattedItems);

      story.username =
        user.username || username || "User";

      // ALWAYS USE DATABASE IMAGE
      story.userAvatar =
        user.image || "";

      await story.save();

      return res.status(200).json(story);
    }

    const newStory = await Story.create({
      userId,

      username:
        user.username || username || "User",

      // ALWAYS USE DATABASE IMAGE
      userAvatar:
        user.image || "",

      items: formattedItems,
    });

    return res.status(201).json(newStory);

  } catch (err) {

    console.log("CREATE STORY ERROR:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
};




export const getStories = async (req, res) => {
  try {

    const stories = await Story.find({
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    const storiesWithUsers = await Promise.all(

      stories.map(async (story) => {

        const user = await User.findOne({
          clerkId: story.userId,
        });

        return {
          ...story.toObject(),

          username:
            user?.username ||
            story.username,

          userAvatar:
            user?.image ||
            "https://i.pravatar.cc/150",
        };
      })
    );

    res.status(200).json(storiesWithUsers);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
};



export const getUserStories = async (req, res) => {
  try {

    const { userId } = req.params;

    const stories = await Story.findOne({
      userId,
      expiresAt: { $gt: new Date() },
    });

    if (!stories) {
      return res.json([]);
    }

    res.status(200).json(stories.items);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
};



// MARK AS SEEN
export const markStorySeen = async (req, res) => {
  try {
    const { storyId, userId } = req.body;

    const updated = await Story.findByIdAndUpdate(
      storyId,
      {
        $addToSet: { viewers: userId },
      },
      { returnDocument: "after" }
    );

    if (!updated) {
      return res.status(404).json({ message: "Story not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const reactToStory = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { emoji } = req.body;

    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // add reaction (you may need to add this field in schema)
    story.reactions = story.reactions || [];

    story.reactions.push({
      userId,
      emoji,
    });

    await story.save();

    const io = req.app.get("io");
    const user = await User.findOne({ clerkId: userId });

    await createNotification({
      io,
      toUserId: story.userId,
      fromUser: {
        id: userId,
        username: user?.username,
        image: user?.image,
      },
      type: "story",
      message: `reacted ${emoji} to your story`,
    });

    res.json({ success: true, story });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const replyToStory = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { text } = req.body;

    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    story.replies = story.replies || [];

    story.replies.push({
      userId,
      text,
      createdAt: new Date(),
    });

    await story.save();

    const io = req.app.get("io");
    const user = await User.findOne({ clerkId: userId });

    await createNotification({
      io,
      toUserId: story.userId,
      fromUser: {
        id: userId,
        username: user?.username,
        image: user?.image,
      },
      type: "story",
      message: "replied to your story",
    });

    res.json(story);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};