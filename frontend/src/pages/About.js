import { motion } from "framer-motion";
import { Users, Package, Bell, Zap, Target, ChevronDown } from "lucide-react";
import { useState } from "react";

const AboutUs = () => {
  const [activeSection, setActiveSection] = useState("vision");

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: i * 0.2,
        duration: 0.7,
        ease: "easeOut"
      }
    })
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  // Features data
  const features = [
    {
      title: "Real-Time Tracking",
      desc: "Always know what you have and what you need with our intuitive tracking system. Monitor product levels, usage patterns, and more.",
      icon: <Package size={36} className="text-blue-400" />,
      bgColor: "from-blue-500/20 to-blue-600/10"
    },
    {
      title: "Smart Notifications",
      desc: "Receive timely alerts for low stock, expiry dates, and restock suggestions based on your usage patterns.",
      icon: <Bell size={36} className="text-green-400" />,
      bgColor: "from-green-500/20 to-green-600/10"
    },
    {
      title: "User Friendly",
      desc: "Designed with simplicity and speed in mind, anyone can use it with ease. No technical expertise required.",
      icon: <Zap size={36} className="text-yellow-400" />,
      bgColor: "from-yellow-500/20 to-yellow-600/10"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-0 right-0 text-blue-500/10 text-9xl font-bold select-none z-0"
          >
            HSP
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-sm font-medium text-blue-400 mb-2 tracking-widest text-center"
          >
            WELCOME TO
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          >
            Home Stock Pro
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"
          />
          
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-300 text-center max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Your smart and efficient inventory companion. Designed to streamline your stock management for households and small businesses, we make it simple to track, manage, and optimize everything you own—all from a sleek, user-friendly interface.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex justify-center"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
              href="#features"
            >
              <span className="px-6 py-3 bg-blue-500 rounded-full text-white font-medium mr-4 shadow-lg shadow-blue-500/30">
                Discover Features
              </span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronDown size={24} className="text-blue-400" />
              </motion.div>
            </motion.a>
          </motion.div>
        </div>
      </div>
      
      {/* Features Section */}
      <div id="features" className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-20"
        >
          <motion.h2 
            variants={fadeIn}
            custom={0}
            className="text-3xl font-bold text-center mb-16"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Why Choose Home Stock System?
            </span>
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                variants={fadeIn}
                custom={idx + 1}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className={`bg-gradient-to-br ${feature.bgColor} backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-xl relative overflow-hidden group`}
              >
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/5 group-hover:scale-150 transition-all duration-500" />
                <div className="absolute w-full h-full top-0 left-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="bg-gray-900/50 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Vision & Mission Section */}
      <div className="max-w-6xl mx-auto px-6 py-24 relative">
        <div className="absolute top-40 right-0 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative z-10"
        >
          <motion.h2 
            variants={fadeIn}
            custom={0}
            className="text-3xl font-bold text-center mb-12"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Our Mission & Vision
            </span>
          </motion.h2>
          
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveSection("vision")}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeSection === "vision" 
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30" 
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Our Vision
              </button>
              <button 
                onClick={() => setActiveSection("mission")}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeSection === "mission" 
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30" 
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Our Mission
              </button>
            </div>
          </div>
          
          <motion.div
            variants={fadeIn}
            custom={1}
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-800 shadow-xl"
          >
            {activeSection === "vision" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                  <div className="w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                    <Target size={64} className="text-blue-400" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold text-blue-400 mb-4">Our Vision</h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    We believe in simplifying the way people manage their stock—making homes and businesses more efficient, sustainable, and stress-free. We envision a world where inventory management is no longer a chore but an effortless part of everyday life.
                  </p>
                  <p className="text-gray-400">
                    By 2030, we aim to help reduce household waste by 30% through smarter inventory tracking and management.
                  </p>
                </div>
              </motion.div>
            )}
            
            {activeSection === "mission" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                  <div className="w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                    <Users size={64} className="text-purple-400" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold text-purple-400 mb-4">Our Mission</h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Our mission is to put control back in your hands with technology that adapts to your needs. We're committed to developing intuitive tools that empower individuals and small businesses to make smarter decisions about their inventory.
                  </p>
                  <p className="text-gray-400">
                    Through continuous innovation and listening to our users, we strive to create the most user-friendly and effective stock management solution on the market.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Call to Action */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl p-12 text-center border border-gray-800 shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Ready to Transform Your Inventory Management?
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Join thousands of satisfied users who have simplified their lives with Home Stock System. Start your journey to a more organized future today.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-medium shadow-lg shadow-blue-500/30"
          >
            Get Started For Free
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;