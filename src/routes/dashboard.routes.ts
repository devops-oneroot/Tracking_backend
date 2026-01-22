// import express from "express";
// import { getDashboardLoads } from "../controllers/dashboard.controller.js";

// const router = express.Router();

// router.get("/loads", getDashboardLoads);

// export default router;
import express from "express";
import {
  getDashboardLoads,
  getVisitDashboard,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/loads", getDashboardLoads);

router.get("/visit/:visitId", getVisitDashboard);

export default router;
