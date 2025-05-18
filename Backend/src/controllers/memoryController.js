// src/controllers/memoryController.js
import Memory from "../models/Memory.model.js";

export const createMemory = async (req, res, next) => {
  try {
    // convert DDMMYYYY to ISO date
    const { title, type, date, whatsapp } = req.body;
    const isoDate = new Date(
      `${date.slice(4)}-${date.slice(2, 4)}-${date.slice(0, 2)}`
    );
    const mem = await Memory.create({
      user: req.user._id,
      title,
      type,
      date: isoDate,
      whatsapp,
    });
    res.status(201).json(mem);
  } catch (err) {
    next(err);
  }
};

export const listMemories = async (req, res, next) => {
  try {
    const list = await Memory.find({ user: req.user._id }).sort("-date");
    res.json(list);
  } catch (err) {
    next(err);
  }
};

// Update:
export const updateMemory = async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;
  const updated = await Memory.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json(updated);
};

// Delete:
export const deleteMemory = async (req, res, next) => {
  const { id } = req.params;
  const deleted = await Memory.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.status(204).end(); // no body
};
