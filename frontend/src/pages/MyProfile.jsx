// MyProfile.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit2, Save, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { profile_img } from "../assets/assets.js";
import '../index.css';

export default function MyProfile() {
  const { user: ctx, updateProfile, fetchProfile } = useAuth();
  const [form, setForm] = useState(null);
  const [isEditing, setEditing] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // Load user data
  useEffect(() => {
    const load = async () => {
      await fetchProfile();
    };
    load();
  }, []);

  // Sync context user into local state
  useEffect(() => {
    if (ctx) setForm(ctx);
  }, [ctx]);

  if (!form) return null; // or loader

  const calculateAge = (dob) => {
    const birth = new Date(dob);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return { years, months, days };
  };
  const age = calculateAge(form.dob);

  // Choose avatar based on gender
  const avatar =
    form.gender === "female" ? profile_img.femaleUser : profile_img.maleUser;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        contactNumber: form.contactNumber,
        gender: form.gender,
        dob: form.dob,
      });
      setMsg({ type: "success", text: "Profile updated successfully!" });
      setEditing(false);
      // clear the message after 3s
      setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Update failed" });
    }
  };
  const cancel = () => {
    setForm(ctx);
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-red-100 to-pink-200 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        <div className="relative bg-red-600 h-32">
          <img
            src={avatar}
            className="w-32 h-32 rounded-full border-4 border-white absolute left-1/2 transform -translate-x-1/2 -bottom-16"
          />
        </div>

        
        <div className="p-6 pt-20 space-y-4">
        {msg.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mx-6 -mt-4 mb-4 text-center px-4 py-2 rounded-lg ${
              msg.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {msg.text}
          </motion.div>
        )}
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Contact", name: "contactNumber", type: "tel" },
            {
              label: "Gender",
              name: "gender",
              type: "select",
              options: ["Male", "Female", "Other"],
            },
            { label: "DOB", name: "dob", type: "date" },
          ].map(({ label, name, type, options }) => (
            <div key={name}>
              <label className="block text-sm text-red-500 mb-1">{label}</label>
              {isEditing ? (
                type === "select" ? (
                  <select
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    {options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                )
              ) : (
                <p className="text-gray-800">
                  {type === "date"
                    ? new Date(form[name]).toLocaleDateString("en-GB")
                    : form[name]}
                </p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm text-red-500 mb-1">
              Current Age
            </label>
            <p className="text-gray-800">
              {age.years} yrs, {age.months} mths, {age.days} days
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={save}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer"
                >
                  <Save className="inline mr-2" />
                  Save
                </button>
                <button
                  onClick={cancel}
                  className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer"
                >
                  <X className="inline mr-2" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer"
              >
                <Edit2 className="inline mr-2" /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
