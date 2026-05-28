import API from "../api/client";

export const getStreamToken = async (userId) => {
  try {
    const res = await API.post("/stream/token", {
      userId,
    });

    return res.data.token;

  } catch (err) {

    console.log(
      "Token error:",
      err.response?.data || err.message
    );

    return null;
  }
};