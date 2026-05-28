
import { getAuth } from "@clerk/express";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Message from "../models/Message.js";
import jwt from "jsonwebtoken";

// ================= GET CURRENT USER =================

const getCurrentUser = async (req) => {

  try {

    const auth = getAuth(req);

    if (auth?.userId) {

      const clerkUser =
        await User.findOne({
          clerkId: auth.userId,
        });

      if (clerkUser) {

        return {
          authType: "clerk",
          user: clerkUser,
          userId: clerkUser.clerkId,
        };
      }
    }

    return null;

  } catch (err) {

    console.log(err);

    return null;
  }
};





// ================= GET MY PROFILE =================
export const getUserProfile = async (req, res) => {
  try {

    const current =
      await getCurrentUser(req);

    if (!current) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = current.user;

    const posts = await Post.find({
      userId:
        current.authType === "clerk"
          ? user.clerkId
          : user._id.toString(),
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user,
      posts,
      stats: {
        posts: posts.length,
        followers:
          user.followers?.length || 0,
        following:
          user.following?.length || 0,
      },
    });

  } catch (err) {

    console.log(
      "PROFILE ERROR:",
      err
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= UPDATE PROFILE =================
export const updateUserProfile = async (req, res) => {
  try {

    const current =
      await getCurrentUser(req);

    if (!current) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = current.user;

    const {
      name,
      username,
      bio,
      image,
      website,
      email,
    } = req.body;

    // ================= UPDATE USER =================
    user.name =
      name || user.name;

    user.username =
      username || user.username;

    user.bio =
      bio || user.bio;

    user.image =
      image || user.image;

    user.website =
      website || user.website;

    user.email =
      email || user.email;

    await user.save();

    // ================= USER ID =================
    const currentUserId =
      current.authType === "clerk"
        ? user.clerkId
        : user._id.toString();

    // ================= UPDATE POSTS =================
    await Post.updateMany(
      {
        userId: currentUserId,
      },
      {
        $set: {
          username:
            user.username,

          userAvatar:
            user.image,
        },
      }
    );

    // ================= UPDATE MESSAGES =================
    await Message.updateMany(
      {
        sender: currentUserId,
      },
      {
        $set: {
          senderName:
            user.name,

          senderImage:
            user.image,
        },
      }
    );

    res.status(200).json({
      success: true,
      user,
    });

  } catch (err) {

    console.log(
      "UPDATE PROFILE ERROR:",
      err
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= GET ALL USERS =================
export const getUsers = async (req, res) => {
  try {

    const users =
      await User.find();

    res.json(users);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
};

// ================= GET PROFILE BY ID =================
export const getProfileById = async (req, res) => {
  try {

    const { id } = req.params;

    let user = null;

    // ================= CLERK USER =================
    if (id.startsWith("user_")) {

      user =
        await User.findOne({
          clerkId: id,
        });

    } else {

      user =
        await User.findById(id) ||
        await User.findOne({
          username: id,
        });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const posts = await Post.find({
      userId:
        user.clerkId ||
        user._id.toString(),
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user,
      posts,
      stats: {
        posts: posts.length,
        followers:
          user.followers?.length || 0,
        following:
          user.following?.length || 0,
      },
    });

  } catch (err) {

    console.log(
      "GET PROFILE ERROR:",
      err
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= FOLLOW USER =================
export const followUser = async (req, res) => {
  try {

    const current =
      await getCurrentUser(req);

    if (!current) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const currentUser =
      current.user;

    const targetUserId =
      req.params.id;

    let targetUser = null;

    if (
      targetUserId.startsWith(
        "user_"
      )
    ) {

      targetUser =
        await User.findOne({
          clerkId:
            targetUserId,
        });

    } else {

      targetUser =
        await User.findById(
          targetUserId
        );
    }

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const currentId =
      current.authType === "clerk"
        ? currentUser.clerkId
        : currentUser._id.toString();

    const targetId =
      targetUser.clerkId ||
      targetUser._id.toString();

    if (currentId === targetId) {
      return res.status(400).json({
        message:
          "You cannot follow yourself",
      });
    }

    const isFollowing =
      targetUser.followers.includes(
        currentId
      );

    // ================= UNFOLLOW =================
    if (isFollowing) {

      targetUser.followers =
        targetUser.followers.filter(
          (id) =>
            id !== currentId
        );

      currentUser.following =
        currentUser.following.filter(
          (id) =>
            id !== targetId
        );

    } else {

      targetUser.followers.push(
        currentId
      );

      currentUser.following.push(
        targetId
      );
    }

    await targetUser.save();
    await currentUser.save();

    res.json({
      following: !isFollowing,
      followers:
        targetUser.followers,
    });

  } catch (err) {

    console.log(
      "FOLLOW ERROR:",
      err
    );

    res.status(500).json({
      message: err.message,
    });
  }
};

// ================= GET FOLLOWING USERS =================
export const getFollowingUsers = async (
  req,
  res
) => {
  try {

    const current =
      await getCurrentUser(req);

    if (!current) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const currentUser =
      current.user;

    const followingUsers =
      await User.find({
        $or: [
          {
            clerkId: {
              $in:
                currentUser.following,
            },
          },
          {
            _id: {
              $in:
                currentUser.following,
            },
          },
        ],
      });

    res.json(
      followingUsers
    );

  } catch (err) {

    console.log(
      "FOLLOWING USERS ERROR:",
      err
    );

    res.status(500).json({
      message: err.message,
    });
  }
};