// SignupForm.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import '../index.css';
import {
  UserPlus,
  Mail,
  Lock,
  Phone,
  Calendar,
  User,
  PersonStanding,
  UserRoundPen,
} from "lucide-react";

const formVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60 } },
};

export default function SignupForm() {
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    gender: "",
    dob: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(form);
      navigate("/my-profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-red-300 p-4">
      <motion.form
        initial="hidden"
        animate="visible"
        variants={formVariants}
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 space-y-6"
      >
        <div className="text-center">
          <UserPlus className="mx-auto text-red-600" size={48} />
          <h2 className="text-3xl font-extrabold text-gray-800 mt-2">
            Create Account
          </h2>
          <p className="text-gray-500">
            Join Memorizer and never miss a moment!
          </p>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div whileFocus={{ scale: 1.02 }} className="relative">
            <User
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600"
            />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border border-red-600 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </motion.div>
          <motion.div whileFocus={{ scale: 1.02 }} className="relative">
            <Mail
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border border-red-600 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </motion.div>
          <motion.div whileFocus={{ scale: 1.02 }} className="relative">
            <Phone
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600"
            />
            <input
              type="tel"
              name="contactNumber"
              placeholder="Contact Number"
              value={form.contactNumber}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border border-red-600 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </motion.div>
          <motion.div whileFocus={{ scale: 1.02 }} className="relative">
            <Calendar
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600"
            />
            <input
              type="date"
              name="dob"
              placeholder="Date of Birth"
              value={form.dob}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border border-red-600 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none outline-none"
            />
          </motion.div>
          <motion.div whileFocus={{ scale: 1.02 }} className="relative">
            <PersonStanding
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600"
            />
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border border-red-600 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none outline-none"
            >
              <option className="" value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </motion.div>
          <motion.div whileFocus={{ scale: 1.02 }} className="relative">
            <UserRoundPen
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600"
            />

            <input
              type="text"
              name="role"
              placeholder="Job role"
              value={form.role}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border border-red-600 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none outline-none"
            />
          </motion.div>
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="relative md:col-span-2"
          >
            <Lock
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600"
            />
            <input
              type="password"
              name="password"
              placeholder="Create Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border border-red-600 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none outline-none"
            />
          </motion.div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.03 }}
          className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition cursor-pointer"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </motion.button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-red-600 hover:underline">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
