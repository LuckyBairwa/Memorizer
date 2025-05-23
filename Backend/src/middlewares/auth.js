// src/middlewares/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) throw new Error("Missing auth token");
    const token = header.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.sub).select("-password");
    if (!req.user) throw new Error("User not found");
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
