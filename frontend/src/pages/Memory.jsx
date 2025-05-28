// src/pages/Memory.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import {
  X as IconX,
  Send as IconSend,
  Clock as IconClock,
  Undo2 as IconBack,
} from "lucide-react";
import { BsCake } from "react-icons/bs";
import { FaRegCalendarAlt, FaWhatsapp } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000";

export default function Memory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: "", text: "" });
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [scheduled, setScheduled] = useState(false);
  const [confetti, setConfetti] = useState(false);

  // Helper to call protected endpoints
  const authFetch = (url, opts = {}) =>
    fetch(url, {
      ...opts,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(opts.body ? { "Content-Type": "application/json" } : {}),
      },
    });

  // Show a toast
  const doToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast({ type: "", text: "" }), 4000);
  };

  // Compute the next occurrence of the date (this year or next)
  const nextOccurrence = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const thisYear = new Date(now.getFullYear(), d.getMonth(), d.getDate());
    if (thisYear >= now.setHours(0, 0, 0, 0)) return thisYear;
    // already passed → next year
    return new Date(now.getFullYear() + 1, d.getMonth(), d.getDate());
  };

  // Friendly formatting
  const formatLong = (dt) =>
    dt.toLocaleDateString("en-GB", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

  // Load memory once
  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${API}/api/memories/${id}`);
        if (!res.ok) throw new Error("Memory not found");
        const data = await res.json();
        setMemory(data);
        setScheduled(data.scheduled.enabled);

        // if scheduled AND today is the special date → fire immediately then unschedule
        const occ = nextOccurrence(data.date);
        const today = new Date();
        if (
          data.scheduled.enabled &&
          occ.getDate() === today.getDate() &&
          occ.getMonth() === today.getMonth()
        ) {
          // hit backend to send now
          await authFetch(`${API}/api/memories/${id}/schedule`, {
            method: "POST",
            body: JSON.stringify({ message: data.scheduled.message }),
          });
          // then cancel
          await authFetch(`${API}/api/memories/${id}/schedule`, {
            method: "DELETE",
          });
          doToast("success", "Wish sent and unscheduled automatically! 🎉");
          setScheduled(false);
          setMemory((m) => ({
            ...m,
            scheduled: { ...m.scheduled, enabled: false },
          }));
        }
      } catch (err) {
        doToast("error", err.message);
      } finally {
        setLoading(false);
      }
    })();
    
  }, [id, token]);

  // Schedule for next occurrence
  const handleSend = async () => {
    if (!message.trim()) return doToast("error", "Enter a message.");
    try {
      const res = await authFetch(`${API}/api/memories/${id}/schedule`, {
        method: "POST",
        body: JSON.stringify({ message }),
      });
      if (!res.ok) {
        const { message: err } = await res.json().catch(() => ({}));
        throw new Error(err || "Schedule failed");
      }
      doToast("success", "Wish scheduled! 🎉");
      setScheduled(true);
      setMemory((m) => ({
        ...m,
        scheduled: { ...m.scheduled, enabled: true, message },
      }));
      setOpen(false);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000);
    } catch (err) {
      doToast("error", err.message);
    }
  };

  // Cancel existing schedule
  const handleRemove = async () => {
    try {
      const res = await authFetch(`${API}/api/memories/${id}/schedule`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Cancel failed");
      doToast("success", "Schedule removed.");
      setScheduled(false);
      setMemory((m) => ({
        ...m,
        scheduled: { ...m.scheduled, enabled: false },
      }));
    } catch (err) {
      doToast("error", err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-red-100">
        <motion.div className="text-red-500 text-2xl">Loading…</motion.div>
      </div>
    );
  }

  if (!memory) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-red-100 p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="text-red-500 mb-4"
        >
          <BsCake size={64} />
        </motion.div>
        <p className="text-red-500 text-xl mb-4 text-center">
          Memory not found.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  const emoji = memory.type === "birthday" ? "🎂" : "💖";
  const nextWish = nextOccurrence(memory.date);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-pink-300 to-red-200 relative overflow-hidden">
      {confetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={300}
        />
      )}

      <AnimatePresence>
        {toast.text && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 ${
              toast.type === "error"
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-green-100 text-green-700 border border-green-200"
            }`}
          >
            {toast.type === "error" ? (
              <IconX className="text-red-600" size={16} />
            ) : (
              <IconSend className="text-green-600" size={16} />
            )}
            <span>{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-1 text-red-600 hover:text-red-800"
          >
            <IconBack size={20} /> <span>Back</span>
          </button>
          <div className="text-4xl">{emoji}</div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div
            className={`p-6 text-center ${
              memory.type === "birthday"
                ? "bg-gradient-to-r from-yellow-100 to-orange-100"
                : "bg-gradient-to-r from-red-100 to-pink-100"
            }`}
          >
            <h1 className="text-3xl font-bold flex justify-center space-x-2">
              <span>{emoji}</span>
              <span>{memory.title}</span>
              <span>{emoji}</span>
            </h1>
            <div className="flex justify-center items-center mt-2 space-x-1 text-gray-600">
              <FaRegCalendarAlt className="text-red-400" />
              <span>Next: {formatLong(nextWish)}</span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Contact */}
            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl">
              <div className="bg-green-100 p-2 rounded-full">
                <FaWhatsapp className="text-green-600" size={20} />
              </div>
              <a
                href={`https://wa.me/${memory.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="text-green-600 hover:underline font-medium"
              >
                +91{memory.whatsapp}
              </a>
            </div>

            {/* Schedule Section */}
            {scheduled ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <IconClock className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800">
                      Wish Scheduled!
                    </h4>
                    <p className="text-sm text-gray-600">
                      Goes out on {formatLong(nextWish)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemove}
                  className="w-full py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                >
                  Remove Schedule
                </button>
              </div>
            ) : (
              <>
                {!open && (
                  <button
                    onClick={() => setOpen(true)}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg flex items-center justify-center space-x-2 hover:from-pink-600 hover:to-red-600"
                  >
                    <BsCake size={18} />
                    <span>Schedule Wish</span>
                  </button>
                )}
                <AnimatePresence>
                  {open && (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-4"
                    >
                      <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Your Message
                        </label>
                        <textarea
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Write a heartfelt note…"
                          className="w-full p-3 border border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                        />
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setOpen(false)}
                            className="flex-1 py-3 border-2 border-red-500 text-red-600 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"
                          >
                            <IconX size={18} />
                            <span>Cancel</span>
                          </button>
                          <button
                            onClick={handleSend}
                            className="flex-1 py-3 bg-red-500 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-red-600 cursor-pointer"
                          >
                            <IconSend size={18} />
                            <span>Send</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
