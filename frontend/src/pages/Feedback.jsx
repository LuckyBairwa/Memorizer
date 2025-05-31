// src/pages/Feedback.jsx
import React from "react";
import { FaWhatsapp, FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import '../index.css'

export default function Feedback() {
  const quotes = [
    "“Feedback is the breakfast of champions.” — Ken Blanchard",
    "“We all need people who will give us feedback. That’s how we improve.” — Bill Gates",
    "“Criticism, like rain, should be gentle enough to nourish a man's growth without destroying his roots.” — Frank A. Clark",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 to-red-200 py-16 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
          We’d Love Your Feedback
        </h1>

        {/* Quotes */}
        <div className="space-y-4 mb-8">
          {quotes.map((q, i) => (
            <p key={i} className="italic text-black font-semibold text-center">
              {q}
            </p>
          ))}
        </div>

        {/* Contact Links */}
        <div className="text-center space-y-4">
          <p className="text-gray-800 font-medium">
            Reach out via:
          </p>

          <div className="flex justify-center space-x-6 text-2xl">
            {/* Email */}
            <a
              href="mailto:luckyshairwal@gmail.com"
              className="text-red-600 hover:text-red-800 transition"
              title="Email"
            >
              <MdOutlineMail />
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/+918278648632"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800 transition"
              title="WhatsApp"
            >
              <FaWhatsapp />
            </a>

            {/* Twitter DM */}
            <a
              href="https://twitter.com/Lucky_Bairwa_20"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 transition"
              title="Twitter DM"
            >
              <FaTwitter />
            </a>

            {/* Linkedin DM */}
            <a
              href="https://in.linkedin.com/in/lucky-bairwa/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 transition"
              title="Twitter DM"
            >
              <FaLinkedin />
            </a>

            {/* GitHub Issues */}
            <a
              href="https://github.com/LuckyBairwa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-gray-900 transition"
              title="Report on GitHub"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
