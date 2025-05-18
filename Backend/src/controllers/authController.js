import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

// Local signup
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, contactNumber, gender, dob, role } =
      req.body;
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashed,
      contactNumber,
      gender,
      dob,
      role,
    });
    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        gender: user.gender,
        dob: user.dob,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: "Email already exists" });
    next(err);
  }
};

// Local login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        gender: user.gender,
        dob: user.dob,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};
