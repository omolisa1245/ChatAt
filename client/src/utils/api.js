import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

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