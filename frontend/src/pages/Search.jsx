// src/pages/Search.jsx
import React, { useEffect, useState } from "react";
import { useMemory } from "../context/MemoryContext";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Edit2, Trash2, User, Save, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { TbCalendarSmile } from "react-icons/tb";

export default function Search() {
  const { memories, fetchMemories, deleteMemory, updateMemory } = useMemory();

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [query, setQuery] = useState("");
  const [schedule, setSchedule] = useState({});
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

      // DDMMYYYY → ISO string at midnight
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
      </div>
    );
  }

  const handleSchedule = async (id) => {
    const { text } = schedule[id] || {};
    if (!text?.trim()) {
      alert("Please enter a message before scheduling.");
      return;
    }
    try {
      // Replace with your backend endpoint + body format
      await fetch(`${BACKEND_URL}/api/memories/${id}/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text }),
      });
      setMsg({ type: "success", text: "Message scheduled!" });
      // auto‐dismiss
      setTimeout(() => setMsg({ type: "", text: "" }), 4000);
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Schedule failed" });
    }
  };

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
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col"
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
                      maxLength={8}
                      className="border-b px-2 py-1"
                    />
                  ) : (
                    <span>{dateStr}</span>
                  )}
                </div>

                {/* WhatsApp */}
                <div className="flex items-center text-gray-600 mb-4">
                  <FaWhatsapp className="w-5 h-5 mr-2 text-red-600" />
                  {isEditing ? (
                    <input
                      value={editForm.whatsapp}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          whatsapp: e.target.value,
                        }))
                      }
                      className="border-b px-2 py-1"
                    />
                  ) : (
                    <span>{m.whatsapp}</span>
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
                        onClick={() => saveEdit(m._id)}
                        className="flex items-center text-green-600 cursor-pointer outline-none"
                      >
                        <Save className="mr-1" size={16} /> Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex items-center text-gray-600 cursor-pointer outline-none"
                      >
                        <X className="mr-1" size={16} /> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(m)}
                        className="flex items-center text-blue-600 cursor-pointer outline-none"
                      >
                        <Edit2 className="mr-1" size={16} /> Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(m._id)}
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

// // src/pages/Search.jsx
// import React, { useEffect, useState } from "react";
// import { useMemory } from "../context/MemoryContext";
// import { useAuth } from "../context/AuthContext";
// import { motion, AnimatePresence } from "framer-motion";
// import { Switch } from "@headlessui/react";
// import { Calendar, Edit2, Trash2, User, Save, X } from "lucide-react";
// import { FaWhatsapp } from "react-icons/fa";
// import { TbCalendarSmile } from "react-icons/tb";

// const BACKEND_URL = "http://localhost:5000";

// export default function Search() {
//   const { token } = useAuth();
//   const { memories, fetchMemories, deleteMemory, updateMemory } = useMemory();

//   const [loading, setLoading] = useState(true);
//   const [toast, setToast] = useState({ type: "", text: "" });
//   const [query, setQuery] = useState("");
//   const [typeFilter, setTypeFilter] = useState("all");
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({
//     title: "",
//     date: "",
//     whatsapp: "",
//   });
//   const [schedule, setSchedule] = useState({});

//   useEffect(() => {
//     fetchMemories().finally(() => setLoading(false));
//   }, [fetchMemories]);

//   // Filtered list
//   const filtered = (memories || []).filter((m) => {
//     const q = query.trim().toLowerCase();
//     const dateStr = new Date(m.date).toLocaleDateString("en-GB");
//     return (
//       (m.title.toLowerCase().includes(q) ||
//         dateStr.includes(q) ||
//         m.whatsapp.includes(q)) &&
//       (typeFilter === "all" || m.type === typeFilter)
//     );
//   });

//   // Inline edit handlers
//   const startEdit = (m) => {
//     setEditingId(m._id);
//     setEditForm({
//       title: m.title,
//       date: new Date(m.date).toLocaleDateString("en-GB").split("/").join(""),
//       whatsapp: m.whatsapp,
//     });
//   };

//   const saveEdit = async (id) => {
//     try {
//       const { title, date, whatsapp } = editForm;
//       if (!title.trim()) throw new Error("Title cannot be empty");
//       if (!/^\d{8}$/.test(date)) throw new Error("Date must be DDMMYYYY");
//       if (!/^\d{10,15}$/.test(whatsapp)) throw new Error("Invalid number");

//       const iso = new Date(
//         `${date.slice(4)}-${date.slice(2, 4)}-${date.slice(0, 2)}T00:00:00Z`
//       ).toISOString();

//       await updateMemory(id, { title, date: iso, whatsapp });
//       setToast({ type: "success", text: "Memory updated!" });
//       setEditingId(null);
//       setTimeout(() => setToast({ type: "", text: "" }), 3000);
//     } catch (err) {
//       setToast({ type: "error", text: err.message });
//     }
//   };

//   // Delete handler
//   const confirmDelete = async (id) => {
//     if (!window.confirm("Delete this memory?")) return;
//     try {
//       await deleteMemory(id);
//       setToast({ type: "success", text: "Memory deleted." });
//       setTimeout(() => setToast({ type: "", text: "" }), 3000);
//     } catch (err) {
//       setToast({ type: "error", text: err.message });
//     }
//   };

//   // Schedule WhatsApp
//   const handleSchedule = async (id) => {
//     const entry = schedule[id] || {};
//     if (!entry.text?.trim()) {
//       setToast({ type: "error", text: "Please enter a message." });
//       return;
//     }
//     try {
//       await fetch(`${BACKEND_URL}/api/memories/${id}/schedule`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ message: entry.text }),
//       });
//       setToast({ type: "success", text: "WhatsApp scheduled!" });
//       setTimeout(() => setToast({ type: "", text: "" }), 3000);
//     } catch (err) {
//       setToast({ type: "error", text: err.message });
//     }
//   };

//   // Loading / empty states
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 to-red-200">
//         <p className="text-red-500 text-xl">Loading your memories…</p>
//       </div>
//     );
//   }
//   if (!memories || memories.length === 0) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-300 to-red-200">
//         <TbCalendarSmile size={64} className="text-red-600 mb-4" />
//         <p className="text-red-600 text-2xl font-bold mb-2">No memories yet</p>
//         <p className="text-red-600">
//           Head over to “Add Memory” to get started.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-pink-300 to-red-200">
//       {/* Filters */}
//       <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row gap-4">
//         <input
//           type="text"
//           placeholder="Search by name, date or number…"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="flex-1 px-4 py-2 rounded-lg border bg-white border-red-600 focus:ring-2 focus:ring-red-400 outline-none"
//         />
//         <select
//           value={typeFilter}
//           onChange={(e) => setTypeFilter(e.target.value)}
//           className="px-4 py-2 rounded-lg border bg-white border-red-600 focus:ring-2 focus:ring-red-400 outline-none"
//         >
//           <option value="all">All Types</option>
//           <option value="birthday">🎂 Birthday</option>
//           <option value="anniversary">💍 Anniversary</option>
//         </select>
//       </div>

//       {/* Toast */}
//       <AnimatePresence>
//         {toast.text && (
//           <motion.div
//             key="toast"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.3 }}
//             className={`mx-auto mb-4 max-w-md text-center px-4 py-2 rounded-lg ${
//               toast.type === "error"
//                 ? "bg-red-100 text-red-700"
//                 : "bg-green-100 text-green-700"
//             }`}
//           >
//             {toast.text}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
//         {filtered.map((m) => {
//           const isEditing = editingId === m._id;
//           const sched = schedule[m._id] || { enabled: false, text: "" };
//           const dateStr = new Date(m.date).toLocaleDateString("en-GB");

//           return (
//             <motion.div
//               key={m._id}
//               className="bg-white rounded-2xl shadow-lg p-6 flex flex-col"
//               whileHover={{ scale: 1.03 }}
//             >
//               {/* Title */}
//               <div className="flex items-center mb-3">
//                 <User className="w-6 h-6 text-red-600 mr-2" />
//                 {isEditing ? (
//                   <input
//                     value={editForm.title}
//                     onChange={(e) =>
//                       setEditForm((f) => ({ ...f, title: e.target.value }))
//                     }
//                     className="flex-1 border-b px-2 py-1"
//                   />
//                 ) : (
//                   <h2 className="text-xl font-semibold text-gray-800">
//                     {m.title}
//                   </h2>
//                 )}
//               </div>

//               {/* Date */}
//               <div className="flex items-center text-gray-600 mb-2">
//                 <Calendar className="w-5 h-5 mr-2 text-red-600" />
//                 {isEditing ? (
//                   <input
//                     value={editForm.date}
//                     maxLength={8}
//                     onChange={(e) =>
//                       setEditForm((f) => ({ ...f, date: e.target.value }))
//                     }
//                     className="border-b px-2 py-1"
//                   />
//                 ) : (
//                   <span>{dateStr}</span>
//                 )}
//               </div>

//               {/* WhatsApp */}
//               <div className="flex items-center text-gray-600 mb-4">
//                 <FaWhatsapp className="w-5 h-5 mr-2 text-red-600" />
//                 {isEditing ? (
//                   <input
//                     value={editForm.whatsapp}
//                     onChange={(e) =>
//                       setEditForm((f) => ({ ...f, whatsapp: e.target.value }))
//                     }
//                     className="border-b px-2 py-1"
//                   />
//                 ) : (
//                   <span>{m.whatsapp}</span>
//                 )}
//               </div>

//               {/* Edit / Delete */}
//               <div className="flex justify-end space-x-4 mb-4">
//                 {isEditing ? (
//                   <>
//                     <button
//                       onClick={() => saveEdit(m._id)}
//                       className="flex items-center text-green-600"
//                     >
//                       <Save className="mr-1" size={16} /> Save
//                     </button>
//                     <button
//                       onClick={() => setEditingId(null)}
//                       className="flex items-center text-gray-600"
//                     >
//                       <X className="mr-1" size={16} /> Cancel
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <button
//                       onClick={() => startEdit(m)}
//                       className="flex items-center text-blue-600"
//                     >
//                       <Edit2 className="mr-1" size={16} /> Edit
//                     </button>
//                     <button
//                       onClick={() => confirmDelete(m._id)}
//                       className="flex items-center text-red-600"
//                     >
//                       <Trash2 className="mr-1" size={16} /> Delete
//                     </button>
//                   </>
//                 )}
//               </div>

//               <div className="mt-auto mb-4">
//                 <span className="mt-auto inline-block px-3 py-1 text-md font-medium rounded-full bg-red-100 text-red-700 mb-4">
//                   {m.type === "birthday" ? "🎂 Birthday" : "💍 Anniversary"}
//                 </span>
//               </div>

//               {/* Schedule Toggle */}
//               <div className="flex items-center mb-2">
//                 <Switch
//                   checked={sched.enabled}
//                   onChange={(enabled) =>
//                     setSchedule((s) => ({
//                       ...s,
//                       [m._id]: { enabled, text: s[m._id]?.text || "" },
//                     }))
//                   }
//                   className={`${
//                     sched.enabled ? "bg-green-500" : "bg-gray-300"
//                   } relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
//                 >
//                   <span className="sr-only">Schedule WhatsApp</span>
//                   <span
//                     className={`${
//                       sched.enabled ? "translate-x-6" : "translate-x-1"
//                     } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
//                   />
//                 </Switch>
//                 <span className="ml-3 text-sm font-medium">
//                   Schedule WhatsApp
//                 </span>
//               </div>

//               {/* Schedule Input + Button */}
//               <AnimatePresence>
//                 {sched.enabled && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: "auto" }}
//                     exit={{ opacity: 0, height: 0 }}
//                     transition={{ duration: 0.3 }}
//                     className="overflow-hidden"
//                   >
//                     <textarea
//                       rows={3}
//                       value={sched.text}
//                       onChange={(e) =>
//                         setSchedule((s) => ({
//                           ...s,
//                           [m._id]: { ...s[m._id], text: e.target.value },
//                         }))
//                       }
//                       placeholder="Your message…"
//                       className="w-full p-2 border border-red-600 rounded-lg outline-none mb-2"
//                     />
//                     <button
//                       onClick={() => handleSchedule(m._id)}
//                       className="w-full py-2 bg-gradient-to-br from-pink-400 to-red-300 text-white rounded-lg hover:bg-gradient-to-br hover:from-pink-300 hover:bg-red-200 transition cursor-pointer"
//                     >
//                       Schedule
//                     </button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
