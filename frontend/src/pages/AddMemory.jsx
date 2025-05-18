// src/pages/AddMemory.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import { useAuth } from "../context/AuthContext";
import { Calendar, Tag, Phone, Smile, User2 } from "lucide-react";
import { useMemory } from "../context/MemoryContext";

export default function AddMemory() {
  const { token } = useAuth();
  const { addMemory } = useMemory();
  const [form, setForm] = useState({
    title: "",
    type: "birthday",
    date: "",
    whatsapp: "",
  });
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!/^\d{8}$/.test(form.date))
      return setMsg({ type: "error", text: "Date must be DDMMYYYY" });

    try {
      await addMemory(form); // ← centralized
      setMsg({ type: "success", text: "Memory saved! 🎉" });
      setForm({ title: "", type: "birthday", date: "", whatsapp: "" });
      setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 to-red-200 p-6">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <Smile className="mx-auto text-red-600" size={48} />
          <h2 className="mt-2 text-3xl font-extrabold text-gray-800">
            Add a Memory
          </h2>
          <div className="mt-2 text-gray-500">
            <Typewriter
              options={{
                strings: ["Birthdays, anniversaries & more…"],
                autoStart: true,
                loop: true,
                delay: 75,
              }}
            />
          </div>
        </div>

        {/* Toast */}
        {msg.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm text-center px-4 py-2 rounded-lg ${
              msg.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {msg.text}
          </motion.div>
        )}

        {/* Title */}
        <motion.div whileFocus={{ scale: 1.02 }} className="relative">
          <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600" />
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Name or Title"
            required
            className="w-full pl-10 pr-4 py-2 border border-red-600 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
          />
        </motion.div>

        {/* Date */}
        <motion.div whileFocus={{ scale: 1.02 }} className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600" />
          <input
            name="date"
            value={form.date}
            onChange={handleChange}
            placeholder="DDMMYYYY"
            maxLength={8}
            required
            className="w-full pl-10 pr-4 py-2 border border-red-600 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
          />
        </motion.div>

        {/* WhatsApp */}
        <motion.div whileFocus={{ scale: 1.02 }} className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600" />
          <input
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="WhatsApp Number"
            pattern="\d{10,15}"
            required
            className="w-full pl-10 pr-4 py-2 border border-red-600 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
          />
        </motion.div>

        {/* Type */}
        <motion.div whileHover={{ scale: 1.02 }}>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-red-600 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
            style={{
              "-webkit-appearance": "none",
              "-moz-appearance": "none",
              appearance: "none",
              "-webkit-tap-highlight-color": "transparent",
            }}
          >
            <option value="birthday">🎂 Birthday</option>
            <option value="anniversary">💍 Anniversary</option>
          </select>
        </motion.div>

        {/* Submit */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          className="w-full py-3 bg-red-600 outline-none text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
        >
          Save Memory
        </motion.button>
      </motion.form>
    </div>
  );
}
