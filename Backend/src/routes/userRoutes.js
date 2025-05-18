// src/routes/userRoutes.js
import express from "express";
import { requireAuth } from "../middlewares/auth.js";
import { getProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.use(requireAuth);
router.get("/", getProfile);
router.put("/", updateProfile);

export default router;
