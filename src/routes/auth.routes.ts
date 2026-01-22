import { Router } from "express";
import { loginUser, refreshToken } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", loginUser);
router.post("/refresh", refreshToken);

export default router;
