import { Router } from "express";
import {
  getUserDayTracking,
  getLatestLocation,
} from "../controllers/admin.controller.js";

import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.get("/day", requireAuth, getUserDayTracking);
router.get("/latest", requireAuth, getLatestLocation);

export default router;
