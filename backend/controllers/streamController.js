import { StreamChat } from "stream-chat";

// ❗ Hardcoded credentials (TEST ONLY)
const API_KEY = "t4vw62d672vu";
const API_SECRET =
  "3kae7mamft377cm8km94zt6x4nsnfvzyndpdyqfcv49pwf3zkym9paf2jbbpdwkk";

const serverClient = StreamChat.getInstance(API_KEY, API_SECRET);

export const generateToken = (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const token = serverClient.createToken(userId);

    res.json({ token });
  } catch (error) {
    console.log("STREAM ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};