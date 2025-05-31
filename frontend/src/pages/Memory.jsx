// src/pages/Memory.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { Edit2, Trash2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import ContentLoader from "react-content-loader";
import '../index.css';

export default function Memory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: "", text: "" });
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", whatsapp: "" });
  const [confetti, setConfetti] = useState(false);

  const API = "http://localhost:5000";

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast({ type: "", text: "" }), 3000);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/memories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Memory not found");
        const data = await res.json();
        setMemory(data);
        setForm({
          title: data.title,
          date: data.date.slice(0, 10),
          whatsapp: data.whatsapp,
        });
      } catch (e) {
        showToast("error", e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  

  
  const MemoryLoader = () => (
    <ContentLoader
      speed={2}
      width={600}            
      height={300}
      viewBox="0 0 600 300"
      backgroundColor="#ff0000" 
      foregroundColor="#f3f3f3" 
    >
      <rect x="24" y="24" rx="4" ry="4" width="260" height="28" />
      <circle cx="540" cy="38" r="10" />
      <circle cx="560" cy="38" r="10" />
  
      
      <rect x="24" y="80" rx="4" ry="4" width="100" height="16" />
      <rect x="24" y="104" rx="10" ry="10" width="100" height="28" />
      
      <rect x="308" y="80" rx="4" ry="4" width="100" height="16" />
      <rect x="308" y="104" rx="4" ry="4" width="140" height="24" />
      
      <rect x="24" y="160" rx="4" ry="4" width="100" height="16" />
      <rect x="24" y="184" rx="4" ry="4" width="80" height="24" />
      
      <rect x="308" y="160" rx="4" ry="4" width="100" height="16" />
      <rect x="308" y="184" rx="4" ry="4" width="100" height="24" />
      
      <rect x="24" y="240" rx="4" ry="4" width="140" height="16" />
      <circle cx="24" cy="278" r="12" />
      <rect x="48" y="266" rx="4" ry="4" width="140" height="24" />
    </ContentLoader>
  );

  if (loading)
    return (
      <div className="p-6 bg-gradient-to-br from-pink-300 to-red-200 min-h-screen">
        <MemoryLoader />
      </div>
    );
  if (!memory)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-pink-300 to-red-200">
        <span className="text-red-500 text-xl">Memory not found</span>
      </div>
    );

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  const calculateAge = (iso) => {
    const d = new Date(iso),
      now = new Date();
    let years = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) years--;
    return years;
  };
  const timeUntil = (iso) => {
    const d = new Date(iso),
      now = new Date(),
      next = new Date(now.getFullYear(), d.getMonth(), d.getDate());
    if (next < now) next.setFullYear(next.getFullYear() + 1);
    const days = Math.ceil((next - now) / (1000 * 60 * 60 * 24));
    return days <= 31
      ? `${days} day${days > 1 ? "s" : ""}`
      : `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""}`;
  };

  const save = async () => {
    if (!form.title || !form.date || !form.whatsapp) {
      return showToast("error", "All fields are required");
    }
    if (!/^\d{10}$/.test(form.whatsapp)) {
      return showToast("error", "Enter valid 10-digit WhatsApp number");
    }
    try {
      const res = await fetch(`${API}/api/memories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setMemory(updated);
      setEditMode(false);
      showToast("success", "Updated successfully");
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2000);
    } catch (e) {
      showToast("error", e.message);
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete this memory?")) return;
    const res = await fetch(`${API}/api/memories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return showToast("error", "Delete failed");
    navigate("/search");
  };

  return (
    <div className="p-4 bg-gradient-to-br from-pink-300 to-red-200 min-h-screen">
      {confetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          recycle={false}
        />
      )}
      <AnimatePresence>
        {toast.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 p-2 rounded text-center ${
              toast.type === "error"
                ? "bg-red-200 text-red-700"
                : "bg-red-100 text-red-900"
            }`}
          >
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white max-w-[600px] w-full shadow-2xl hover:shadow-lg transition-all duration-300 rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-red-600">{memory.title}</h2>
          <div className="flex space-x-3 text-red-500">
            <button
              className="cursor-pointer"
              onClick={() => setEditMode(true)}
            >
              <Edit2 size={20} />
            </button>
            <button className="cursor-pointer" onClick={remove}>
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm uppercase text-red-500 font-bold">Type</p>
            <span className="inline-block mt-1 px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-sm">
              {memory.type}
            </span>
          </div>
          <div>
            <p className="text-sm uppercase text-red-500 font-bold">Date</p>
            <p className="mt-1 font-medium text-red-600">
              {formatDate(memory.date)}
            </p>
          </div>
          <div>
            <p className="text-sm uppercase text-red-500 font-bold">Years</p>
            <p className="mt-1 font-medium text-red-600">
              {calculateAge(memory.date)}
            </p>
          </div>
          <div>
            <p className="text-sm uppercase text-red-500 font-bold">Until</p>
            <p className="mt-1 font-medium text-red-600">
              {timeUntil(memory.date)}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-red-500 font-bold">Open WhatsApp</p>
            <a
              href={`https://wa.me/+91${memory.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-1 gap-1.5 inline-flex items-center text-green-600"
            >
              <FaWhatsapp className="ml-2" />
              +91 {memory.whatsapp}
            </a>
          </div>
        </div>

        <AnimatePresence>
          {editMode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pt-4 border-t border-red-100 space-y-3"
            >
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Title"
                className="w-full p-2 border border-red-200 rounded"
              />
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                className="w-full p-2 border border-red-200 rounded"
              />
              <input
                type="tel"
                value={form.whatsapp}
                onChange={(e) =>
                  setForm((f) => ({ ...f, whatsapp: e.target.value }))
                }
                placeholder="WhatsApp number"
                className="w-full p-2 border border-red-200 rounded"
              />
              <div className="flex space-x-2">
                <button
                  onClick={save}
                  className="flex-1 py-2 bg-red-500 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 py-2 bg-pink-100 text-red-600 rounded"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
