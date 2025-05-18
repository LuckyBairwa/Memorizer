// src/models/Memory.model.js
import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ["birthday", "anniversary"],
    default: "birthday",
  },
  date: { type: Date, required: true },
  whatsapp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  // createdBy: { type: String, default: "admin" },
});
export default mongoose.model("Memory", memorySchema);
