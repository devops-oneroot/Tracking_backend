// import { Router } from "express";
// import {
//   createUser,
//   loginUser,
//   verifyUser,
//   getUserById,
// } from "../controllers/user.controller.js";

// const router = Router();
// router.post("/", createUser);
// router.post("/login", loginUser);
// router.get("/verify/:id", verifyUser);
// router.get("/:id", getUserById);

// export default router;

import { Router } from "express";
import {
  createUser,
  getProfile,
  getUserById,
  getAllUsers,
} from "../controllers/user.controller.js";

import { requireAuth } from "../middlewares/auth.js";

const router = Router();

// ✅ REGISTER
router.post("/", createUser);

// ✅ PROFILE (JWT)
router.get("/me", requireAuth, getProfile);

// ✅ GET USER BY ID
router.get("/:id", requireAuth, getUserById);

router.get("/", getAllUsers);

export default router;
