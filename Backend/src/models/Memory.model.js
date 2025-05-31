// src/models/Memory.model.js
import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ["Birthday", "Anniversary"],
    default: "Birthday",
  },
  date: { type: Date, required: true },
  whatsapp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.model("Memory", memorySchema);
