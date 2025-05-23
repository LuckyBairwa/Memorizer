// // src/controllers/memoryController.js
// import Memory from "../models/Memory.model.js";
// import 'dotenv/config'
// import cron from "node-cron";
// import Twilio from "twilio";

// const twilioClient = Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
// const jobs = new Map();

// console.log(twilioClient, jobs)

// export const createMemory = async (req, res, next) => {
//   try {
//     // convert DDMMYYYY to ISO date
//     const { title, type, date, whatsapp } = req.body;
//     const isoDate = new Date(
//       `${date.slice(4)}-${date.slice(2, 4)}-${date.slice(0, 2)}`
//     );
//     const mem = await Memory.create({
//       user: req.user._id,
//       title,
//       type,
//       date: isoDate,
//       whatsapp,
//     });
//     res.status(201).json(mem);
//   } catch (err) {
//     next(err);
//   }
// };

// export const listMemories = async (req, res, next) => {
//   try {
//     const list = await Memory.find({ user: req.user._id }).sort("-date");
//     res.json(list);
//   } catch (err) {
//     next(err);
//   }
// };

// export const getMemory = async (req, res, next) => {
//   try {
//     const mem = await Memory.findOne({
//       _id: req.params.id,
//       user: req.user._id,
//     });
//     if (!mem) return res.status(404).json({ message: "Memory not found" });
//     res.json(mem);
//   } catch (err) {
//     next(err);
//   }
// };

// // Update:
// export const updateMemory = async (req, res, next) => {
//   try {
//     const updated = await Memory.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updated) return res.status(404).json({ message: "Not found" });
//     res.json(updated);
//   } catch (err) {
//     next(err);
//   }
// };

// // Delete:
// export const deleteMemory = async (req, res, next) => {
//   try {
//     const deleted = await Memory.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: "Not found" });
//     // if there was a scheduled job, cancel it
//     const job = jobs.get(req.params.id);
//     if (job) {
//       job.stop();
//       jobs.delete(req.params.id);
//     }
//     res.status(204).end();
//   } catch (err) {
//     next(err);
//   }
// };

// export const scheduleMemory = async (req, res, next) => {
//   try {
//     const mem = await Memory.findById(req.params.id);
//     if (!mem) return res.status(404).json({ message: "Not found" });
//     const { message } = req.body;
//     if (!message?.trim())
//       return res.status(400).json({ message: "Message required" });

//     const today = new Date();
//     const orig = new Date(mem.date);
//     // Build date for this year
//     let nextRun = new Date(
//       today.getFullYear(),
//       orig.getMonth(),
//       orig.getDate()
//     );

//     // If it's today, send immediately and clear schedule
//     if (nextRun.toDateString() === today.toDateString()) {
//       await twilioClient.messages.create({
//         from: `whatsapp:${req.user.whatsapp}`,
//         to: `whatsapp:${mem.whatsapp}`,
//         body: message,
//       });
//       mem.scheduled = { enabled: false, message: "", jobId: null };
//       await mem.save();
//       return res.json({ message: "Sent immediately" });
//     }

//     // If that day has already passed, bump to next year
//     if (nextRun < today) {
//       nextRun.setFullYear(nextRun.getFullYear() + 1);
//     }

//     // Cancel any existing job
//     const existing = jobs.get(mem._id.toString());
//     if (existing) {
//       existing.stop();
//       job.delete(mem._id.toString());
//     }

//     // Schedule a cron job at 00:00 on the birthday/anniversary each year
//     const day = orig.getDate();
//     const month = orig.getMonth() + 1;
//     const expr = `0 0 ${day} ${month} *`;
//     const task = cron.schedule(expr, async () => {
//       try {
//         await twilioClient.messages.create({
//           from: `whatsapp:${req.user.whatsapp}`,
//           to: `whatsapp:${mem.whatsapp}`,
//           body: message,
//         });
//       } catch (err) {
//         console.error("Twilio send failed:", err);
//       }
//       // After first run, stop and clean up
//       task.stop();
//       job.delete(mem._id.toString());
//       await Memory.findByIdAndUpdate(mem._id, {
//         "scheduled.enabled": false,
//         "scheduled.message": "",
//         "scheduled.jobId": null,
//       });
//     });
//     job.set(mem._id.toString(), task);

//     // Persist schedule flags in the DB
//     mem.scheduled = { enabled: true, message, jobId: mem._id.toString() };
//     await mem.save();

//     res.json({ message: "Scheduled", nextRun });
//   } catch (err) {
//     next(err);
//   }
// };

// export const cancelSchedule = async (req, res, next) => {
//   try {
//     const mem = await Memory.findById(req.params.id);
//     if (!mem?.scheduled?.enabled) {
//       return res.status(404).json({ message: "No schedule to cancel" });
//     }

//     const task = jobs.get(mem._id.toString());
//     if (task) {
//       task.stop();
//       jobs.delete(mem._id.toString());
//     }

//     mem.scheduled = { enabled: false, message: "", jobId: null };
//     await mem.save();

//     res.json({ message: "Unscheduled" });
//   } catch (err) {
//     next(err);
//   }
// };

// src/controllers/memoryController.js
import Memory from "../models/Memory.model.js";
import cron from "node-cron";
import Twilio from "twilio";

const twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const jobs = new Map();

console.log(twilioClient)
console.log(jobs)

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

export const scheduleMemory = async (req, res, next) => {
  try {
    const mem = await Memory.findById(req.params.id);
    if (!mem) return res.status(404).json({ message: "Not found" });
    const { message } = req.body;
    if (!message?.trim())
      return res.status(400).json({ message: "Message required" });

    const fromNumber = req.user.contactNumber;
    if (!fromNumber)
      return res
        .status(400)
        .json({ message: "Your WhatsApp number is missing" });

    const today = new Date();
    const orig = new Date(mem.date);

    // Build a JS Date for this year's occurrence
    let nextRun = new Date(
      today.getFullYear(),
      orig.getMonth(),
      orig.getDate(),
      0,
      0,
      0
    );

    if (nextRun.toDateString() === today.toDateString()) {
      //   const fromNumber = req.user.contactNumber;
      //   console.log(fromNumber)
      await twilioClient.messages.create({
        from: `whatsapp:${req.user.contactNumber}`,
        to: `whatsapp:${mem.whatsapp}`,
        body: message,
      });
      mem.scheduled = { enabled: false, message: "", jobId: null };
      await mem.save();
      return res.json({ message: "Sent immediately" });
    }

    // If that date already passed, bump to next year
    if (nextRun < today) {
      nextRun.setFullYear(nextRun.getFullYear() + 1);
    }

    // Clear any old job
    const old = jobs.get(mem._id.toString());
    if (old) {
      old.stop();
      jobs.delete(mem._id.toString());
    }

    // Cron expr: at 00:00 on day/month every year
    const day = orig.getDate();
    const month = orig.getMonth() + 1;
    const expr = `0 0 ${day} ${month} *`;

    const task = cron.schedule(expr, async () => {
      try {
        await twilioClient.messages.create({
          from: `whatsapp:${fromNumber}`,
          to: `whatsapp:${mem.whatsapp}`,
          body: message,
        });
      } catch (err) {
        console.error("Twilio send failed:", err);
      }
      // Stop & clean up after first run
      task.stop();
      jobs.delete(mem._id.toString());
      await Memory.findByIdAndUpdate(mem._id, {
        "scheduled.enabled": false,
        "scheduled.message": "",
        "scheduled.jobId": null,
      });
    });

    jobs.set(mem._id.toString(), task);

    // Persist schedule in DB
    mem.scheduled = {
      enabled: true,
      message,
      jobId: mem._id.toString(),
    };
    await mem.save();

    res.json({ message: "Scheduled", nextRun });
  } catch (err) {
    next(err);
  }
};

export const cancelSchedule = async (req, res, next) => {
  try {
    const mem = await Memory.findById(req.params.id);
    if (!mem?.scheduled?.enabled) {
      return res.status(404).json({ message: "No schedule to cancel" });
    }
    const task = jobs.get(mem._id.toString());
    if (task) {
      task.stop();
      jobs.delete(mem._id.toString());
    }
    mem.scheduled = { enabled: false, message: "", jobId: null };
    await mem.save();
    res.json({ message: "Unscheduled" });
  } catch (err) {
    next(err);
  }
};
