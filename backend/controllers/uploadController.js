import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadMedia = async (req, res) => {
  try {

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        message: "File buffer missing - check multer config",
      });
    }

    const result = await new Promise((resolve, reject) => {

      const stream =
        cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "profiles",
          },

          (error, result) => {

            if (error) {

              console.log(
                "CLOUDINARY ERROR:",
                error
              );

              reject(error);

            } else {

              resolve(result);
            }
          }
        );

      streamifier
        .createReadStream(req.file.buffer)
        .pipe(stream);
    });

    return res.status(200).json({
      url: result.secure_url,
      type: result.resource_type,
    });

  } catch (err) {

    console.log(
      "UPLOAD ERROR:",
      err
    );

    res.status(500).json({
      message: err.message,
    });
  }
};