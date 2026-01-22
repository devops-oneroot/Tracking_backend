// import express from "express";
// import { onboardAggregator } from "../controllers/aggregator.controller.js";

// const router = express.Router();

// router.post("/onboard", onboardAggregator);

// export default router;

// import express from "express";
// import { onboardAggregator } from "../controllers/aggregator.controller.js";

// const router = express.Router();

// router.post("/onboard", onboardAggregator);

// export default router;

import express from "express";
import {
  onboardAggregator,
  findAggregatorByMobile,
  searchAggregators,
  getAllAggregators,
  getAggregatorById,
  updateAggregator,
} from "../controllers/aggregator.controller.js";

const router = express.Router();

router.post("/onboard", onboardAggregator);
router.get("/by-mobile/:mobile", findAggregatorByMobile);
// aggregator.routes.ts
router.get("/search", searchAggregators);

router.get("/", getAllAggregators);
router.get("/:id", getAggregatorById); // edit page load
router.put("/:id", updateAggregator); // save edit

export default router;
