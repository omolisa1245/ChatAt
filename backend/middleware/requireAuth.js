import { getAuth }
from "@clerk/express";

export const requireAuth =
  (req, res, next) => {

    try {

      console.log(
        "AUTH HEADERS:",
        req.headers.authorization
      );

      const auth =
        getAuth(req);

      console.log(
        "AUTH DATA:",
        auth
      );

      const { userId } =
        auth;

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      req.userId =
        userId;

      next();

    } catch (err) {

      console.log(
        "AUTH ERROR:",
        err
      );

      return res.status(401).json({
        message: "Invalid token",
      });
    }
};