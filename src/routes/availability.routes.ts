import { Router } from "express";
import { saveAvailabilityResponse } from "../controllers/availability.controller.js";

const router = Router();

router.post("/respond", saveAvailabilityResponse);

export default router;
