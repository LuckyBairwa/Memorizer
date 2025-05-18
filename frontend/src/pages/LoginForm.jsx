


// LoginForm.jsx
import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Mail, Lock, LogIn } from "lucide-react";
import { speak } from "../utils/speech";

const formVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60 } },
};

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      
      await login(form);
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
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6"
      >
        <div className="text-center">
          <LogIn className="mx-auto text-red-600" size={48} />
          <h2 className="text-3xl font-extrabold text-gray-800 mt-2">Welcome Back</h2>
          <p className="text-gray-500">Log in to access your Memorizer account</p>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border border-red-600 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border border-red-600 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.03 }}
          className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition cursor-pointer"
        >
          {loading ? "Logging in..." : "Log In"}
        </motion.button>

        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-red-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.form>
    </div>
  );
}