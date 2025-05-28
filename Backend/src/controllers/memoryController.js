// src/controllers/memoryController.js
import Memory from "../models/Memory.model.js";


export const createMemory = async (req, res, next) => {
  try {
    const { title, type, date, whatsapp } = req.body;
    // DDMMYYYY → ISO
    const iso = new Date(
      `${date.slice(4)}-${date.slice(2, 4)}-${date.slice(0, 2)}`
    );
    const mem = await Memory.create({
      user: req.user._id,
      title,
      type,
      date: iso,
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

export const getMemory = async (req, res, next) => {
  try {
    const mem = await Memory.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!mem) return res.status(404).json({ message: "Memory not found" });
    res.json(mem);
  } catch (err) {
    next(err);
  }
};

export const updateMemory = async (req, res, next) => {
  try {
    const updated = await Memory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteMemory = async (req, res, next) => {
  try {
    const deleted = await Memory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    // If there was a job, stop + remove it
    const task = jobs.get(req.params.id);
    if (task) {
      task.stop();
      jobs.delete(req.params.id);
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

