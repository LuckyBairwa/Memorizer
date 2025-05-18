// Hero.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Sparkles, CalendarHeart, Gift, UserPlus, LogIn  } from 'lucide-react';
import { assets } from '../assets/assets';

export default function HeroSection() {
  return (
    <section className="py-6 bg-gradient-to-br from-pink-300 to-red-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Carousel */}
        <div className="w-full overflow-hidden rounded-3xl">
          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            showIndicators={true}
            showArrows={false}
            useKeyboardArrows={true}
            emulateTouch
            interval={3000}
            transitionTime={800} 
            className="h-64 sm:h-80 md:h-96 lg:h-[500px] bg-white"
          >
            {[
              { title: 'Remember Birthdays', desc: 'Never miss a chance to wish your loved ones a happy birthday.', img: assets.HappyBirthday },
              { title: 'Wish Anniversaries', desc: 'Make a smile on your loved ones face on their special day.', img: assets.ValentinesDay },
              { title: 'Add Custom Events', desc: 'Add your own events with timely reminders.', img: assets.Custom },
            ].map((slide, idx) => (
              <div key={idx} className="flex flex-col lg:flex-row h-full overflow-hidden">
                <div className="w-full lg:w-1/2 p-6 flex flex-col justify-center">
                  <h2 className="text-3xl sm:text-5xl font-bold text-red-500 mb-2 underline">{slide.title}</h2>
                  <p className="text-blue-700 text-base font-semibold mt-5 sm:text-lg">{slide.desc}</p>
                </div>
                <div className="w-full lg:w-1/2 h-48 lg:h-full">
                  <img
                    src={slide.img}
                    alt={slide.title}
                    className="object-contain w-f h-[400px] my-10 mx-5"
                  />
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
        >
          <ServiceCard
            Icon={CalendarHeart}
            title="Birthday Reminders"
            desc="Never forget your loved ones' special day again. We'll notify you in advance!"
          />
          <ServiceCard
            Icon={Gift}
            title="Anniversary Alerts"
            desc="Track wedding anniversaries and other milestones automatically."
          />
          <ServiceCard
            Icon={Sparkles}
            title="Custom Events"
            desc="Set reminders for anything—from job interviews to gym goals."
          />
        </motion.div>

        {/* CTA */}
        <div className="text-center mt-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-700 mb-4">
            Ready to Memorize Moments?
          </h2>
          <p className="text-gray-600 mb-6 text-base sm:text-lg">
            Create your free account and never miss an important date again.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-lg transition-transform hover:scale-105 outline-none"
            >
              <UserPlus className="mr-2" /> Create Account
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-5 py-3 bg-white border-2 border-red-600 text-red-600 font-semibold rounded-full shadow-lg hover:bg-red-50 transition-transform hover:scale-105 outline-none"
            >
              <LogIn className="mr-2" /> Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ Icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center border border-gray-200 hover:shadow-2xl transition duration-300"
    >
      <Icon className="w-10 h-10 text-red-600 mb-3" />
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm sm:text-base">{desc}</p>
    </motion.div>
  );
}
