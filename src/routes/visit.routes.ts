// import { Router } from "express";
// import { createVisit } from "../controllers/visit.controller.js";

// const router = Router();
// router.post("/", createVisit);

// export default router;

import { Router } from "express";
import {
  createVisit,
  getAllVisits,
  getVisitsByUser,
} from "../controllers/visit.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/", requireAuth, createVisit);

// ✅ DASHBOARD
router.get("/", getAllVisits);
router.get("/user/:userId", getVisitsByUser);

export default router;
