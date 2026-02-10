import express from "express";
import {
  createFarmer,
  getFarmers,
  updateFarmer,
  getFarmersOnboardedByUser,
} from "../controllers/farmer.controller.js";

const router = express.Router();

router.post("/onboard", createFarmer); // onboard
router.get("/", getFarmers); // dashboard
router.patch("/:id", updateFarmer); // edit

router.get("/onboarded/:userId", getFarmersOnboardedByUser);

export default router;
