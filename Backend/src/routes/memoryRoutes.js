import express from "express";
import { requireAuth } from "../middlewares/auth.js";
import {
  createMemory,
  listMemories,
  updateMemory,
  deleteMemory,
  getMemory,
} from "../controllers/memoryController.js";
const router = express.Router();

router.use(requireAuth);
router.post("/", createMemory);
router.get("/", listMemories);
router.put("/:id", updateMemory);
router.delete("/:id", deleteMemory);
router.get("/:id", getMemory);

export default router;
