import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";

import userRoutes from "./routes/user.routes.js";
import visitRoutes from "./routes/visit.routes.js";
import loadRoutes from "./routes/load.routes.js";
import aggregatorRoutes from "./routes/aggregator.routes.js";
import authRoutes from "./routes/auth.routes.js";
import trackingRoutes from "./routes/tracking.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/loads", loadRoutes);
app.use("/api/aggregators", aggregatorRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(ENV.PORT, () => {
  console.log(`🚀 Server running on port ${ENV.PORT}`);
});
