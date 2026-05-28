import User from "../models/User.js";
import { getAuth } from "@clerk/express";

export const register = async (req, res) => {
  res.status(200).json({
    message:
      "Authentication handled by Clerk",
  });
};

export const login = async (req, res) => {
  res.status(200).json({
    message:
      "Authentication handled by Clerk",
  });
};

export const syncUser = async (req, res) => {
  try {

    // GET USER FROM CLERK TOKEN
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    console.log(
      "SYNC USER:",
      userId
    );

    // FIND EXISTING USER
    let user = await User.findOne({
      clerkId: userId,
    });

    // CREATE NEW USER
    if (!user) {

      user = await User.create({

        clerkId: userId,

        name:
          req.body.name || "User",

        username:
          req.body.username ||
          `user_${Date.now()}`,

        email:
          req.body.email || "",

        image:
          req.body.image || "",

        bio:
          req.body.bio || "",

        website:
          req.body.website || "",

        authType:
          req.body.authType || "clerk",

        following: [],
      });

      console.log(
        "NEW USER CREATED:",
        user
      );
    }

    // RETURN USER
    res.status(200).json(user);

  } catch (err) {

    console.log(
      "SYNC USER ERROR:",
      err
    );

    res.status(500).json({
      message: err.message,
    });
  }
};