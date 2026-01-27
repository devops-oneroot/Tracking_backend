import express from "express";
import { testPush } from "../controllers/test.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/push", requireAuth, testPush);

export default router;
