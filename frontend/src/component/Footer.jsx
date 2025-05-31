// src/components/Footer.jsx
import React from "react";
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaGithub,
} from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-600 to-red-500 text-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {/* About */}
        <div>
          <h4 className="text-xl font-bold mb-4">About Memorizer</h4>
          <p className="text-sm leading-relaxed">
            A one-stop spot to save birthdays & anniversaries—and send
            personalized WhatsApp wishes automatically on the day.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: "Home", to: "/" },
              { label: "Search", to: "/search" },
              { label: "Profile", to: "/my-profile" },
              { label: "Add Memory", to: "/add" },
            ].map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xl font-bold mb-4">Contact Us</h4>
          <p className="flex items-center gap-2 text-sm mb-2">
            <MdOutlineMail size={20} /> luckyshairwal@gmail.com
          </p>
          <p className="flex items-center gap-2 text-sm mb-4">
            <IoCall size={20} /> +91 8278648632
          </p>
          <div className="flex space-x-2">
            {[
              { Icon: FaWhatsapp, href: "https://wa.me/+918278648632" },
              { Icon: FaFacebook, href: "https://facebook.com/profile.php?id=100088888142992" },
              { Icon: FaInstagram, href: "https://instagram.com/lucky.shairwal" },
              { Icon: FaLinkedin, href: "https://linkedin.com/in/lucky-bairwa" },
              { Icon: FaTwitter, href: "https://twitter.com/Lucky_Bairwa_20" },
              { Icon: FaGithub, href: "https://github.com/LuckyBairwa" },
            ].map(({ Icon, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-opacity-20 rounded-full hover:scale-150 transition-all duration-500 outline-none"
              >
                <Icon size={22} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white border-opacity-30 mt-4 py-4 text-center text-sm">
        © {new Date().getFullYear()} Memorizer — All rights reserved by Lucky
        Bairwa.
      </div>
    </footer>
  );
}
