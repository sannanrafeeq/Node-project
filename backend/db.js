
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    // Without a db name in the URI mongoose falls back to "test"
    const dbName = process.env.MONGODB_DB || "ecommerce";

    await mongoose.connect(MONGODB_URI, { dbName });
    console.log(`MongoDB connected successfully! (db: ${dbName})`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    if (!process.env.VERCEL) process.exit(1);
  }
};

module.exports = connectDB;
