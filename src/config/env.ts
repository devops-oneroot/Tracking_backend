// import dotenv from "dotenv";
// dotenv.config();

// export const ENV = {
//   PORT: process.env.PORT || 5000,
//   MONGO_URI: process.env.MONGO_URI!,
// };
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env file");
  process.exit(1);
}

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
};
