// Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidAlarmAdd } from "react-icons/bi";
import { FaHome, FaSearch, FaUser, FaSignOutAlt, FaPlus } from "react-icons/fa";
import { TbListSearch } from "react-icons/tb";
import { useAuth } from "../context/AuthContext";
import { assets, profile_img } from "../assets/assets";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
    <nav className="w-full bg-gray-800 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center my-3.5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 outline-none">
            <img
              src={assets.Logo}
              alt="Logo"
              className="w-12 h-12 rounded-full hover:scale-110 transition-all duration-700"
            />
            <span className="text-2xl font-bold text-red-500">Memorizer</span>
          </Link>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {!user ? (
              // Logged out
              <>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-700 transition outline-none"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 border border-red-500 text-red-500 rounded-lg font-semibold outline-none"
                >
                  Login
                </Link>
              </>
            ) : (
              // Logged in
              <>
                <Link
                  to="/"
                  className="text-white hover:text-red-500 transition-all duration-500 outline-none"
                >
                  <FaHome size={24} />
                </Link>
                <Link
                  to="/search"
                  className="text-white hover:text-red-500 transition-all duration-500 outline-none"
                >
                  <TbListSearch size={24} />
                </Link>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="relative focus:outline-none"
                >
                  <img
                    src={avatarSrc}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border-2 hover:border-red-600 object-cover cursor-pointer border-white transition-all duration-500"
                  />
                </button>
                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-22 top-22 bg-red-200 rounded-lg shadow-lg w-48 overflow-hidden transition-all duration-500">
                    <Link
                      to="/my-profile"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-300 text-center gap-4 transition-all duration-500 outline-none"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaUser className="text-red-600" size={15} />
                      Profile
                    </Link>
                    <Link
                      to="/add"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-300 text-center gap-4 transition-all duration-500 outline-none"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaPlus className="text-red-600" size={15} />
                      Add Memory
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-300 text-center gap-4 cursor-pointer outline-none"
                    >
                      <FaSignOutAlt className="text-red-600" size={15} />
                      Logout
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
