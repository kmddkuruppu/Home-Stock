// AboutUs.jsx
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-blue-400"
        >
          About Home Stock System
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg text-gray-300 text-center max-w-3xl mx-auto mb-12"
        >
          Home Stock System is your smart and efficient inventory companion. Designed to streamline your stock management for households and small businesses, we make it simple to track, manage, and optimize everything you own—all from a sleek, user-friendly interface.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-10 text-center">
          {[
            {
              title: "Real-Time Tracking",
              desc: "Always know what you have and what you need with our intuitive tracking system.",
              icon: "📦",
            },
            {
              title: "Smart Notifications",
              desc: "Receive timely alerts for low stock, expiry dates, and restock suggestions.",
              icon: "🔔",
            },
            {
              title: "User Friendly",
              desc: "Designed with simplicity and speed in mind, anyone can use it with ease.",
              icon: "⚡",
            },
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.6 + idx * 0.2, duration: 0.6 }}
              className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:scale-105 transition-all"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-blue-300 mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-20 text-center"
        >
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Our Vision</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We believe in simplifying the way people manage their stock—making homes and businesses more efficient, sustainable, and stress-free. Our mission is to put control back in your hands with technology that adapts to your needs.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
