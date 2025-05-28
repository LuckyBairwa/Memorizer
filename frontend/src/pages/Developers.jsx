// src/pages/Developers.jsx
import React from "react";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { TbCalendarPlus, TbSearch } from "react-icons/tb";
import { FiPhoneCall } from "react-icons/fi";

const stats = [
  { label: "Add Memory Page", value: "1+" },
  { label: "Search & Edit Page", value: "1+" },
  { label: "GitHub Stars", value: "1+" },
];

const skills = [
  "Node.js / Express",
  "MongoDB & Mongoose",
  "React / Tailwind CSS",
  "Framer Motion",
  "WhatsApp Integration",
];

export default function Developers() {
  return (
    <div className="bg-gradient-to-br from-pink-300 to-red-200 text-gray-900 min-h-screen py-16 px-4">
      {/* Hero / Intro */}
      <section className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-red-700">
          Hey, I'm Lucky{" "}
        </h1>
        <p className="text-md text-black">
          Lead developer of <b>Memorizer</b> a simple, elegant app to store
          birthdays & anniversaries, then automatically wish friends & family
          via WhatsApp when their special day arrives.
        </p>
      </section>

      {/* Social & Contact */}
      <section className="flex justify-center gap-6 mb-16">
        <a
          href="https://github.com/LuckyBairwa/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl text-black hover:scale-150 transition-all duration-500"
        >
          <FaGithub size={25} />
        </a>
        <a
          href="https://www.linkedin.com/in/lucky-bairwa/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl text-blue-500 hover:scale-150 transition-all duration-500"
        >
          <FaLinkedin size={25} />
        </a>
        <a
          href="https://wa.me/+918278648632"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl text-green-500 hover:scale-150 transition-all duration-500"
        >
          <FaWhatsapp size={25} />
        </a>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl p-6 text-center shadow-2xl"
          >
            <p className="text-3xl font-bold text-red-600 mb-1">{s.value}</p>
            <p className="text-gray-700">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Tech Stack & Skills */}
      <section className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-semibold mb-4 text-red-700">
          Tech Stack & Skills
        </h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Featured Pages */}
      <section className="max-w-5xl mx-auto mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-red-700">
          Key User Flows
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow shadow-2xl">
            <h3 className="text-xl font-bold mb-2 flex items-center space-x-2 text-red-700">
              <TbCalendarPlus size={24} />
              <span>Add Memory</span>
            </h3>
            <p className="text-gray-600">
              Enter a name, date, and WhatsApp number to save a new birthday or
              anniversary.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow shadow-2xl">
            <h3 className="text-xl font-bold mb-2 flex items-center space-x-2 text-red-700">
              <TbSearch size={24} />
              <span>Search & Edit</span>
            </h3>
            <p className="text-gray-600">
              Search, filter, update or delete existing memories—all with a
              smooth animated UI.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center flex justify-center">
        
        <button
          onClick={() => {
            window.open("https://wa.me/+918278648632", "_blank");
          }}
          className="flex px-8 py-4 gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition cursor-pointer"
        >
          <FiPhoneCall size={20} />
          Contact me
        </button>
      </section>
    </div>
  );
}
