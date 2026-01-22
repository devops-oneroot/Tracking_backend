// import { Router } from "express";
// import { createLoad, completeLoad } from "../controllers/load.controller.js";
// import { upload } from "../middlewares/upload.middleware.js";

// const router = Router();

// router.post("/", createLoad);
// router.patch("/:id/complete", upload.single("image"), completeLoad);

// export default router;

import express from "express";
import {
  createLoad,
  completeLoad,
  getPendingLoadsByUser,
  getLoadStats,
  getCompletedLoads,
  filterLoads,
} from "../controllers/load.controller.js";

const router = express.Router();

router.post("/", createLoad);

// ✅ pending by user
router.get("/pending/:userId", getPendingLoadsByUser);

// ✅ complete load
router.post("/:id/complete", completeLoad);

// ✅ DASHBOARD
router.get("/stats", getLoadStats);
router.get("/completed", getCompletedLoads);
router.get("/", filterLoads); // supports query filters

export default router;
