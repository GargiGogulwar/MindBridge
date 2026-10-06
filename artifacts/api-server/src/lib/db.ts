import mongoose from "mongoose";
import { logger } from "./logger";

mongoose.set("bufferCommands", false);

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;

  const uri = process.env["MONGODB_URI"];
  if (!uri) {
    logger.warn("MONGODB_URI not set — running without database");
    return;
  }

  try {
    await mongoose.connect(uri, {
      dbName: "mindbridge",
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
    });
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error({ err }, "MongoDB connection failed");
    throw err;
  }
}

export function isConnected() {
  return mongoose.connection.readyState === 1;
}
