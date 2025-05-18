// src/controllers/userController.js
import User from "../models/User.model.js";

// GET /api/user/me
export const getProfile = async (req, res, next) => {
  try {
    // requireAuth middleware has loaded req.user
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

// PUT /api/user/me
export const updateProfile = async (req, res, next) => {
  try {
    const updates = (({ name, contactNumber, gender, dob }) => 
      ({ name, contactNumber, gender, dob }))(req.body);

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
      context: "query",
    }).select("-password");

    res.json({ user });
  } catch (err) {
    next(err);
  }
};
