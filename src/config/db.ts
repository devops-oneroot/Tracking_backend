// import mongoose from "mongoose";
// import { ENV } from "./env.js";

// export const connectDB = async () => {
//   await mongoose.connect(ENV.MONGO_URI);
//   console.log("✅ MongoDB Connected");
// };
import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1);
  }
};
