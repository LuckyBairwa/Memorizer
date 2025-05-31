// src/pages/Search.jsx
import React, { useEffect, useState } from "react";
import { useMemory } from "../context/MemoryContext";
import { motion } from "framer-motion";
import { Calendar, User } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import { TbCalendarSmile } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import ContentLoader from "react-content-loader";
import '../index.css'

export default function Search() {
  const { memories, fetchMemories } = useMemory();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  // const [placeholderCount, setPlaceholderCount] = useState(9);

  useEffect(() => {
    fetchMemories()
      // .then((fetched) => {
      //   setPlaceholderCount(fetched.length);
      // })
      .finally(() => setLoading(false));
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

  const CardLoader = () => (
    <ContentLoader
      speed={2}
      width={300}
      height={180}
      viewBox="0 0 300 180"
      backgroundColor="#ff0000"
      foregroundColor="#ffffff"
    >
      {/* pink shapes */}
      <circle cx="30" cy="30" r="15" fill="#ffc0cb" />
      <rect
        x="60"
        y="18"
        rx="4"
        ry="4"
        width="150"
        height="12"
        fill="#ffc0cb"
      />
      <rect
        x="60"
        y="42"
        rx="4"
        ry="4"
        width="100"
        height="10"
        fill="#ffc0cb"
      />
      <rect
        x="16"
        y="100"
        rx="10"
        ry="10"
        width="100"
        height="20"
        fill="#ffc0cb"
      />
    </ContentLoader>
  );

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-pink-300 to-red-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {Array(9)
            .fill(0)
            .map((_, i) => (
              <CardLoader key={i} />
            ))}

          {/* {Array.from({ length: placeholderCount }).map((_, i) => (
            <CardLoader key={i} />
          ))} */}
        </div>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-pink-300 to-red-200">
      {/* Search & Filter */}
      <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name or date…"
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
          <option value="Birthday"> Birthday</option>
          <option value="Anniversary"> Anniversary</option>
        </select>

        <div
          onClick={() => {
            navigate("/add");
          }}
          className="flex items-center justify-center gap-2 bg-red-500 py-2 px-3 rounded-lg text-white cursor-pointer"
        >
          <FaPlus size={16} />
          <button className="cursor-pointer font-semibold">Add Memory</button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filtered.map((m) => {
          const dateStr = new Date(m.date).toLocaleDateString("en-GB");
          return (
            <motion.div
              key={m._id}
              onClick={() => navigate(`/memory/${m._id}`)}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="flex items-center mb-2">
                <User className="w-5 h-5 text-red-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">
                  {m.title}
                </h2>
              </div>
              <div className="flex items-center mb-2 text-gray-600">
                <Calendar className="w-5 h-5 text-red-600 mr-2" />
                <span>{dateStr}</span>
              </div>
              <span className="mt-auto inline-block px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-700">
                {m.type === "Birthday" ? "🎂 Birthday" : "💍 Anniversary"}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
