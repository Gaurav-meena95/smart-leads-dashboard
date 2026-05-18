import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const url = (process.env.MONGO_URI || process.env.MONGODB_URI) as string;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  
  if (!url) {
    console.log("MONGO_URI or MONGODB_URI is undefined.");
    return;
  }

  try {
    await mongoose.connect(url, { dbName: "SmartLeads" });
    console.log("MongoDB connected successfully");
  } catch (error: any) {
    console.log("MongoDB connection failed:", error.message);
  }
};

export default connectDB;
