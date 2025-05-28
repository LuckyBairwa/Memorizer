// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaPlus,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { MdOutlineFeedback, MdEngineering } from "react-icons/md";
import { TbListSearch } from "react-icons/tb";
import { useAuth } from "../context/AuthContext";
import { assets, profile_img } from "../assets/assets";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const avatarSrc = user
    ? user.gender === "female"
      ? profile_img.femaleUser
      : profile_img.maleUser
    : null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="w-full bg-gradient-to-br from-pink-500 to-red-600 shadow-md py-1 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={assets.Logo}
              alt="Logo"
              className="w-10 h-10 rounded-full transform hover:scale-105 transition"
            />
            <span className="text-2xl font-bold text-white">Memorizer</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  to="/signup"
                  className="px-3 py-1 bg-white text-pink-600 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="px-3 py-1 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-pink-600 transition"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-white hover:text-gray-200 transition"
                >
                  <FaHome size={20} />
                </Link>
                <Link
                  to="/search"
                  className="text-white hover:text-gray-200 transition"
                >
                  <TbListSearch size={20} />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen((o) => !o)}
                    className="focus:outline-none"
                  >
                    <img
                      src={avatarSrc}
                      alt="avatar"
                      className="w-9 h-9 rounded-full border-2 border-white hover:border-gray-200 transition"
                    />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        // animate the dropdown with enter and exit animations
                        key="profile-dropdown" 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }} 
                        transition={{ duration: 0.3 }}
                        className="absolute right-0 mt-2 w-40 md:w-48 bg-white rounded-lg shadow-lg overflow-hidden"
                      >
                        <Link
                          to="/my-profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          <FaUser className="mr-2 text-pink-600" /> Profile
                        </Link>
                        <Link
                          to="/add"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          <FaPlus className="mr-2 text-pink-600" /> Add Memory
                        </Link>
                        <Link
                          to="/feedback"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          <MdOutlineFeedback className="mr-2 text-pink-600" />{" "}
                          Feedback
                        </Link>
                        <Link
                          to="/developers"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          <MdEngineering className="mr-2 text-pink-600" />{" "}
                          Developers
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          <FaSignOutAlt className="mr-2 text-pink-600" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="text-white focus:outline-none"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-pink-100 text-pink-800">
          <div className="px-4 py-2 space-y-1">
            {!user ? (
              <>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-pink-200"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-pink-200"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-pink-200"
                >
                  <FaHome className="mr-2" /> Home
                </Link>
                <Link
                  to="/search"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-pink-200"
                >
                  <TbListSearch className="mr-2" /> Search
                </Link>
                <Link
                  to="/my-profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-pink-200"
                >
                  <FaUser className="mr-2" /> Profile
                </Link>
                <Link
                  to="/add"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-pink-200"
                >
                  <FaPlus className="mr-2" /> Add Memory
                </Link>
                <Link
                  to="/feedback"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-pink-200"
                >
                  <MdOutlineFeedback className="mr-2" /> Feedback
                </Link>
                <Link
                  to="/developers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-pink-200"
                >
                  <MdEngineering className="mr-2" /> Developers
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-pink-200"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
