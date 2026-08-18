import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URI
    );

    isConnected = connection.connection.readyState === 1;

    console.log("MongoDB connected successfully");
  } catch (error) {
    isConnected = false;

    console.error(
      "MongoDB connection error:",
      error.message
    );

    throw error;
  }
};

export default connectDB;
