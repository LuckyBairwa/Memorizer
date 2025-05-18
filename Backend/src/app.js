import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import memoryRoutes from "./routes/memoryRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user/me", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/memories", memoryRoutes);


export default app;
