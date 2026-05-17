import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import mongoose from 'mongoose';

const url = process.env.MONGO_URI as string;
if (!url) {
  throw new Error("MONGO_URI is undefined. Check your .env file location.");
}

const connectDB = async () => {
  try {
    await mongoose.connect(url, { dbName: "SmartLeads" });
    console.log("MongoDB connected successfully");
  } catch (error: any) {
    console.log("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
