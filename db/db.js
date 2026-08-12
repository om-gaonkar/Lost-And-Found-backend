import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

const connectDB = async () => {
  console.log("connectDB() called");

  if (cached.conn) {
    console.log("♻️ Using cached MongoDB connection");
    return cached.conn;
  }

  console.log("🟡 Attempting MongoDB connection...");
  console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);

  try {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    cached.conn = await cached.promise;

    console.log("🟢 MongoDB connected successfully");

    return cached.conn;
  } catch (error) {
    cached.promise = null;

    console.error("🔴 MongoDB connection failed:");
    console.error(error);

    throw error;
  }
};

export default connectDB;
