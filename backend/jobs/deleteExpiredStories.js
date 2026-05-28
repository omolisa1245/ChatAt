import cron from "node-cron";
import Story from "../models/Story.js";

const deleteExpiredStories = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const result = await Story.deleteMany({
        expiresAt: { $lt: new Date() },
      });

      console.log(
        `Deleted ${result.deletedCount} expired stories`
      );
    } catch (err) {
      console.log(err);
    }
  });
};

export default deleteExpiredStories;