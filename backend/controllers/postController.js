import Post from "../models/Post.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { getAuth } from "@clerk/express";
import { createNotification } from "../utils/createNotification.js";




export const createPost = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    let {
      content,
      media,
      filter,
      username,
      userAvatar,
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!media || media.length === 0) {
      return res.status(400).json({
        message: "Media is required",
      });
    }

    // FIX MEDIA TYPES
    media = media.map((item) => ({
      ...item,
      type: item.type?.includes("image")
        ? "image"
        : item.type?.includes("video")
          ? "video"
          : "image",
    }));

    const post = await Post.create({
      content,
      media,
      filter,
      username,
      userAvatar,
      userId,
    });

    res.status(201).json(post);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};


// GET POSTS
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({
      createdAt: -1,
    });

    const updatedPosts = await Promise.all(
      posts.map(async (post) => {
        const user = await User.findOne({
          clerkId: post.userId,
        });

        return {
          ...post._doc,

          username:
            user?.username || post.username,

          userAvatar:
            user?.image || post.userAvatar,
        };
      })
    );

    res.status(200).json(updatedPosts);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};



export const likePost = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Not found" });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id !== userId);
    } else {
      post.likes.push(userId);

      const io = req.app.get("io");

      const user = await User.findOne({ clerkId: userId });
      await createNotification({
        io,
        toUserId: post.userId,
        fromUser: {
          id: userId,
          username: user?.username,
          image: user?.image,
        },
        type: "like",
        message: "liked your post",
        postImage: post.media?.[0]?.url || null,
      });
    }

    await post.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};



export const repostPost = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // increase repost count
    post.reposts = (post.reposts || 0) + 1;

    await post.save();

    // prevent self-notification
    if (post.userId !== userId) {
      const io = req.app.get("io");

      const user = await User.findOne({ clerkId: userId });

      const notification = await Notification.create({
        toUserId: post.userId,
        fromUser: {
          id: userId,
          username: user?.username,
          image: user?.image,
        },
        type: "share", // or "repost" if you add it
        message: "reposted your post",
        postImage: post.media?.[0]?.url || null,
      });

      io.to(post.userId).emit("new_notification", notification);
    }

    res.json(post);
  } catch (error) {
    console.log("REPOST ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addView = async (req, res) => {
  const { userId } = getAuth(req);

  const post = await Post.findById(req.params.id);

  if (!post.viewers) post.viewers = [];

  // only count unique views
  if (!post.viewers.includes(userId)) {
    post.views += 1;
    post.viewers.push(userId);
  }

  await post.save();

  res.json(post);
};



export const bookmarkPost = async (req, res) => {
  const { userId } = getAuth(req);

  const post = await Post.findById(req.params.id);

  const exists = post.bookmarks.includes(userId);

  if (exists) {
    post.bookmarks = post.bookmarks.filter(id => id !== userId);
  } else {
    post.bookmarks.push(userId);
  }

  await post.save();
  res.json(post);
};




export const addComment = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

   const newComment = {
    userId,
    username: req.body.username,
    userAvatar: req.body.userAvatar,
    text: req.body.text || "",
    attachments: req.body.attachments || [],
};

    post.comments.push(newComment);

    await post.save();

    const io = req.app.get("io");

    const user = await User.findOne({ clerkId: userId });

    await createNotification({
      io,
      toUserId: post.userId,
      fromUser: {
        id: userId,
        username: user?.username,
        image: user?.image,
      },
      type: "comment",
      message: "commented on your post",
      postImage: post.media?.[0]?.url || null,
    });

    res.json({ comments: post.comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const sharePost = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // increase share count
    post.shares = (post.shares || 0) + 1;
    await post.save();

    // get socket
    const io = req.app.get("io");

    // get user info (DON'T trust frontend)
    const user = await User.findOne({ clerkId: userId });

    // create notification
    await createNotification({
      io,
      toUserId: post.userId,
      fromUser: {
        id: userId,
        username: user?.username,
        image: user?.image,
      },
      type: "share",
      message: "shared your post",
      postImage: post.media?.[0]?.url || null,
    });



    res.json(post);
  } catch (err) {
    console.log("SHARE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};





export const getLikedUsers = async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const users = await User.find({
      clerkId: { $in: post.likes },
    });

    res.json(users);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};



export const deletePost = async (req, res) => {

  console.log("DELETE ROUTE HIT");
  try {
    const { userId } = getAuth(req);

    console.log("AUTH USER:", userId);

    const post = await Post.findById(req.params.id);

    console.log("POST USER:", post?.userId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.userId !== userId) {
      console.log("NOT ALLOWED");

      return res.status(403).json({
        message: "Not allowed",
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    console.log("POST DELETED");

    res.json({
      message: "Post deleted",
    });

  } catch (err) {
    console.log("DELETE ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};



export const reportPost = async (req, res) => {
  try {

    const { userId } = getAuth(req);

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    console.log("POST REPORTED BY:", userId);

    res.json({
      message: "Post reported successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};


export const updatePost = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (String(post.userId) !== String(userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    post.content = req.body.content || post.content;

    await post.save();

    res.json(post);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const replyToComment = async (req, res) => {
  try {

    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // RECURSIVE FIND FUNCTION
    const findComment = (comments, id) => {

      for (const comment of comments) {

        // SAFETY CHECK
        if (comment?._id?.toString() === id) {
          return comment;
        }

        if (comment.replies?.length > 0) {

          const found = findComment(
            comment.replies,
            id
          );

          if (found) return found;
        }
      }

      return null;
    };

    // FIND COMMENT OR REPLY
    const targetComment = findComment(
      post.comments,
      commentId
    );

    if (!targetComment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // PUSH REPLY
   targetComment.replies.push({
    text: req.body.text || "",
    username: req.body.username,
    userAvatar: req.body.userAvatar,
    attachments: req.body.attachments || [],
    createdAt: new Date(),
    replies: [],
    likes: [],
});

    await post.save();

    res.status(200).json({
      success: true,
      comments: post.comments,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};