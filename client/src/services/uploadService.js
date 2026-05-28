import axios from "axios";

export const uploadFile = async (file) => {

  try {

    console.log(
      "START UPLOAD:",
      file
    );

    const response =
      await fetch(file.uri);

    const blob =
      await response.blob();

    const formData =
      new FormData();

    formData.append(
      "file",
      blob,
      file.type === "video"
        ? "video.mp4"
        : "image.jpg"
    );

    const res = await axios.post(

      "https://chat-at-gold.vercel.app/api/upload",

      formData,

      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },

        timeout: 300000,
      }
    );

    console.log(
      "UPLOAD SUCCESS:",
      res.data
    );

    return res.data;

  } catch (err) {

    console.log(
      "UPLOAD ERROR FULL:",
      err.response?.data ||
      err.message ||
      err
    );

    throw err;
  }
};