import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in environment variables.");
    }
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully!");
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred during MongoDB connection.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("❌ MongoDB connection failed:", errorMessage);
    process.exit(1);
  }
};

export default connectDB;
