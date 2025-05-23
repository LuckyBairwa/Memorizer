// Footer.jsx
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
    <footer className="w-full bg-gray-800 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h4 className="text-lg font-semibold mb-2 text-rose-500">About Memorizer</h4>
          <p className="text-sm">
            Memorizer helps you track birthdays, calculate ages, and send
            automated wishes via WhatsApp.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-2 text-red-500">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="/" className=" hover:text-red-300 transition-all duration-500 outline-none">
                Home
              </a>
            </li>
            <li>
              <a href="/search" className="hover:text-red-300 transition-all duration-500 outline-none">
                Search
              </a>
            </li>
            <li>
              <a href="/my-profile" className="hover:text-red-300 transition-all duration-500 outline-none">
                My Profile
              </a>
            </li>
            <li>
              <a href="/add" className="hover:text-red-300 transition-all duration-500 outline-none">
                Add More
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold mb-2 text-red-500">Contact Us</h4>
          <p className="text-md flex items-center"><MdOutlineMail className="text-red-500"/>: luckyshairwal@gmail.com</p>
          <p className="text-md flex items-center"><IoCall className="text-red-500"/>: +91 8278648632</p>
          <div className="flex space-x-4 mt-2">
            <Link to="https://wa.me/8278648632" target="_blank" className="outline-none">
              <FaWhatsapp size={24} className="text-green-500 cursor-pointer hover:scale-150 transition-all duration-500" />
            </Link>
            <Link to="https://www.facebook.com/profile.php?id=100088888142992" target="_blank" className="outline-none">
              <FaFacebook size={24} className="text-blue-500 cursor-pointer hover:scale-150 transition-all duration-500" />
            </Link>
            <Link to="https://www.instagram.com/luckyg_777" target="_blank" className="outline-none">
              <FaInstagram size={24} className="text-pink-500 cursor-pointer hover:scale-150 transition-all duration-500" />
            </Link>
            <Link to="https://www.linkedin.com/in/lucky-bairwa" target="_blank" className="outline-none">
              <FaLinkedin size={24} className="text-blue-500 cursor-pointer hover:scale-150 transition-all duration-500" />
            </Link>
            <Link to="https://x.com/Lucky_Bairwa_20" target="_blank" className="outline-none">
              <FaTwitter size={24} className="text-blue-500 cursor-pointer hover:scale-150 transition-all duration-500" />
            </Link>
            <Link to="https://github.com/LuckyBairwa" target="_blank" className="outline-none">
              <FaGithub size={24} className="text-black cursor-pointer hover:scale-150 transition-all duration-500" />
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-gray-700 text-center text-sm py-4 text-red-300">
        © {new Date().getFullYear()} Memorizer. All rights reserved.
      </div>
    </footer>
  );
}
