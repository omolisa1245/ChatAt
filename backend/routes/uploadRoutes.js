import express from "express";
import multer from "multer";
import { uploadMedia } from "../controllers/uploadController.js";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

router.post(
  "/",
  upload.single("file"),
  uploadMedia
);

export default router;