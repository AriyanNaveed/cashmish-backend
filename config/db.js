import mongoose from "mongoose";
import keys from "./keys.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(keys.mongoUri, {
            maxPoolSize: 50, // Optimize database connection handling
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
}