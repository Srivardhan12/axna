import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async () => {
    if (!MONGO_URI) {
        throw new Error("MONGO_URI environment variable is not defined");
    }
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Database is connected sucessfully")
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}