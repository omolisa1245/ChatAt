import mongoose from "mongoose";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const connectDB = async () => {
  try {

    mongoose.set("strictQuery", true);

    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
    });

    console.log("MongoDB connected");

  } catch (error) {

    console.log("MongoDB Error:", error.message);

    process.exit(1);
  }
};

export default connectDB;