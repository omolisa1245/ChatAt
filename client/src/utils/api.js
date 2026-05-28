import axios from "axios";

const BASE_URL = "https://chat-at-gold.vercel.app/api";

export const syncUserWithBackend = async (token, userData = {}) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/auth/sync`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("SYNC USER:", res.data);
    return res.data;

  } catch (err) {
    console.log(
      "SYNC ERROR:",
      err.response?.data || err.message
    );
  }
};