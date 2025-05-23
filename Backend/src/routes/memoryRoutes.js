import express from "express";
import { requireAuth } from "../middlewares/auth.js";
import {
  createMemory,
  listMemories,
  updateMemory,
  deleteMemory,
  getMemory,
  scheduleMemory,
  cancelSchedule,
} from "../controllers/memoryController.js";
const router = express.Router();

router.use(requireAuth);
router.post("/", createMemory);
router.get("/", listMemories);
router.put("/:id", updateMemory);
router.delete("/:id", deleteMemory);
router.get("/:id", getMemory);
router.post("/:id/schedule", scheduleMemory);
router.delete("/:id/schedule", cancelSchedule);

export default router;
