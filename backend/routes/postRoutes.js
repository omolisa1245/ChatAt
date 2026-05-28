import express from "express";
import { addComment, addView, bookmarkPost, createPost, deletePost, getLikedUsers, getPosts, likePost, replyToComment, reportPost, repostPost, sharePost, updatePost } from "../controllers/postController.js";
import { requireAuth } from "../middleware/requireAuth.js";



const router = express.Router();

// POSTS
router.post("/", requireAuth, createPost);
router.get("/", getPosts);
router.put("/like/:id", requireAuth, likePost);
router.put("/share/:id", requireAuth, sharePost);
router.put("/bookmark/:id", requireAuth, bookmarkPost);
router.put("/repost/:id", requireAuth, repostPost);
router.put("/view/:id", addView);
router.post("/comment/:id", requireAuth, addComment);
router.delete("/:id",requireAuth, deletePost);
router.post(
  "/report/:id",
  requireAuth,
  reportPost
);

router.put("/update/:id", requireAuth, updatePost);

router.post(
  "/reply/:postId/:commentId",
  requireAuth,
  replyToComment
);



export default router;