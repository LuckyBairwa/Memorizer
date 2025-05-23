// src/pages/Search.jsx
import React, { useEffect, useState } from "react";
import { useMemory } from "../context/MemoryContext";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Edit2, Trash2, User, Save, X } from "lucide-react";
import { FaPlus, FaWhatsapp } from "react-icons/fa";
import { TbCalendarSmile } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const { memories, fetchMemories, deleteMemory, updateMemory } = useMemory();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    date: "",
    whatsapp: "",
  });

  useEffect(() => {
    fetchMemories().finally(() => setLoading(false));
  }, [fetchMemories]);

  const filtered = (memories || []).filter((m) => {
    const q = query.trim().toLowerCase();
    const dateStr = new Date(m.date).toLocaleDateString("en-GB");
    const matchesText =
      m.title.toLowerCase().includes(q) ||
      dateStr.includes(q) ||
      m.whatsapp.includes(q);
    const matchesType = typeFilter === "all" || m.type === typeFilter;
    return matchesText && matchesType;
  });

  const startEdit = (mem) => {
    setEditingId(mem._id);
    setEditForm({
      title: mem.title,
      date: new Date(mem.date).toLocaleDateString("en-GB").split("/").join(""),
      whatsapp: mem.whatsapp,
    });
  };

  // Save edited card
  const saveEdit = async (id) => {
    try {
      const { title, date, whatsapp } = editForm;
      if (!title.trim()) throw new Error("Title cannot be empty");
      if (!/^\d{8}$/.test(date)) throw new Error("Date must be DDMMYYYY");
      if (!/^\d{10,15}$/.test(whatsapp)) throw new Error("Invalid number");

      const iso = new Date(
        `${date.slice(4)}-${date.slice(2, 4)}-${date.slice(0, 2)}T00:00:00Z`
      ).toISOString();

      await updateMemory(id, { title, date: iso, whatsapp });
      setMsg({ type: "success", text: "Memory updated successfully!" });
      setEditingId(null);
      setTimeout(() => setMsg({ type: "", text: "" }), 5000);
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Update failed" });
    }
  };

  // Delete a memory
  const confirmDelete = async (id) => {
    if (!window.confirm("Delete this memory?")) return;
    try {
      await deleteMemory(id);
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 to-red-200">
        <p className="text-red-500 text-3xl">Loading your memories…</p>
      </div>
    );
  }

  if (!memories || memories.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-300 to-red-200">
        <TbCalendarSmile size={54} className="text-red-600" />
        <p className="text-red-600 text-3xl font-bold mb-2">No memories yet</p>
        <p className="text-red-600 text-xl">
          Head over to “Add Memory” to get started.
        </p>

        <button
          onClick={() => navigate("/add")}
          className="flex items-center mt-4 px-4 py-2 rounded-lg bg-red-600 text-white cursor-pointer font-bold gap-2"
        >
          <FaPlus className="text-white" size={15} /> Add Memory
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-pink-300 to-red-200">
      {/* Search & Filter */}
      <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name, date or number…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border bg-white border-red-600 focus:ring-2 focus:ring-red-400 outline-none"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border bg-white border-red-600 focus:ring-2 focus:ring-red-400 outline-none"
        >
          <option value="all">All Types</option>
          <option value="birthday">🎂 Birthday</option>
          <option value="anniversary">💍 Anniversary</option>
        </select>
      </div>

      <AnimatePresence>
        {msg.text && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`mx-6 mt-4 mb-4 text-center px-4 py-2 rounded-lg ${
              msg.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {msg.text}
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-600">
          No memories match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filtered.map((m) => {
            const dateStr = new Date(m.date).toLocaleDateString("en-GB");
            const isEditing = editingId === m._id;

            return (
              <motion.div
                key={m._id}
                onClick={() => navigate(`/search/${m._id}`)}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col cursor-pointer"
                whileHover={{ scale: 1.03 }}
              >
                {/* Title */}
                <div className="flex items-center mb-4">
                  <User className="w-6 h-6 text-red-600 mr-2" />
                  {isEditing ? (
                    <input
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, title: e.target.value }))
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 border-b px-2 py-1"
                    />
                  ) : (
                    <h2 className="text-xl font-semibold text-gray-800">
                      {m.title}
                    </h2>
                  )}
                </div>

                {/* Date */}
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="w-5 h-5 mr-2 text-red-600" />
                  {isEditing ? (
                    <input
                      value={editForm.date}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, date: e.target.value }))
                      }
                      onClick={(e) => e.stopPropagation()}
                      maxLength={8}
                      className="border-b px-2 py-1"
                    />
                  ) : (
                    <span>{dateStr}</span>
                  )}
                </div>

                {/* WhatsApp */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://wa.me/+91${m.whatsapp}`);
                  }}
                  className="flex items-center text-gray-600 mb-4 "
                >
                  <FaWhatsapp className="w-5 h-5 mr-2 text-red-600 cursor-pointer" />
                  {isEditing ? (
                    <input
                      value={editForm.whatsapp}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          whatsapp: e.target.value,
                        }))
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="border-b px-2 py-1"
                    />
                  ) : (
                    <span
                      className="cursor-pointer"
                    >
                      +91 {m.whatsapp}
                    </span>
                  )}
                </div>

                {/* Badge */}
                <span className="mt-auto inline-block px-3 py-1 text-md font-medium rounded-full bg-red-100 text-red-700 mb-4">
                  {m.type === "birthday" ? "🎂 Birthday" : "💍 Anniversary"}
                </span>

                {/* Actions */}
                <div className="flex justify-around text-sm">
                  {isEditing ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          saveEdit(m._id);
                        }}
                        className="flex items-center text-green-600 cursor-pointer outline-none"
                      >
                        <Save className="mr-1" size={16} /> Save
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(null);
                        }}
                        className="flex items-center text-gray-600 cursor-pointer outline-none"
                      >
                        <X className="mr-1" size={16} /> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(m);
                        }}
                        className="flex items-center text-blue-600 cursor-pointer outline-none"
                      >
                        <Edit2 className="mr-1" size={16} /> Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(m._id);
                        }}
                        className="flex items-center text-red-600 cursor-pointer outline-none"
                      >
                        <Trash2 className="mr-1" size={16} /> Delete
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
