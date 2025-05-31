import React from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Typewriter from "typewriter-effect";
import { Link } from "react-router-dom";
import { CalendarHeart, Gift, Sparkles } from "lucide-react";
import { assets } from "../assets/assets";
import '../index.css';

const features = [
  {
    key: "birthday",
    title: "Add Birthday",
    desc: "Never forget your loved one's special day. 🎂",
    img: assets.HappyBirthday,
    icon: CalendarHeart,
    link: "/add",
  },
  {
    key: "anniversary",
    title: "Add Anniversary",
    desc: "Celebrate love with timely reminders. 💍",
    img: assets.ValentinesDay,
    icon: Gift,
    link: "/add",
  },
  {
    key: "custom",
    title: "Add Custom Events",
    desc: "Add your own events with timely reminders. 🎉",
    img: assets.Custom,
    icon: Sparkles,
    link: "/add",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-bl from-red-100 to-pink-200 py-16 px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="text-center mb-10"
      >
        <h1 className="text-5xl sm:text-6xl font-bold text-red-700">
          Welcome to Memorizer
        </h1>
        <div className="mt-4 text-xl sm:text-2xl text-gray-700">
          <Typewriter
            options={{
              strings: ["Your Personalized Reminder App"],
              autoStart: true,
              loop: true,
              delay: 75,
            }}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {features.map(({ key, title, desc, img, icon: Icon, link }) => (
          <Tilt
            key={key}
            glareEnable={true}
            glareMaxOpacity={0.3}
            scale={1.05}
            transitionSpeed={1000}
            tiltMaxAngleX={15}
            tiltMaxAngleY={15}
            className="rounded-2xl"
          >
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-white shadow-xl rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col"
            >
              <div className="h-48 bg-pink-100 flex items-center justify-center">
                <img src={img} alt={title} className="h-40 object-contain" />
              </div>
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center text-red-600 mb-2">
                    <Icon className="w-6 h-6 mr-2" />
                    <h3 className="text-xl font-semibold">{title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{desc}</p>
                </div>
                <div className="mt-6 flex gap-4">
                  <Link
                    to={link}
                    className="flex-1 px-4 py-2 bg-red-600 text-white text-md rounded-lg hover:bg-red-700 transition text-center font-medium outline-none"
                  >
                    Add
                  </Link>
                  <Link
                    to="/search"
                    className="flex-1 px-4 py-2 bg-gray-200 text-red-700 text-md rounded-lg hover:bg-gray-300 transition text-center font-medium outline-none"
                  >
                    View
                  </Link>
                </div>
              </div>
            </motion.div>
          </Tilt>
        ))}
      </div>
    </div>
  );
}
