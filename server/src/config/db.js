import dns from "dns";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    dns.setServers(["8.8.8.8"]);

    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;