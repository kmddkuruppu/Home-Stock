import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, ChevronDown } from "lucide-react";
import { useState } from "react";

const ContactUs = () => {
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

  const contactMethods = [
    {
      title: "Email Us",
      desc: "Get quick responses from our support team",
      icon: <Mail size={36} className="text-blue-400" />,
      value: "homestockpro@gmail.com",
      bgColor: "from-blue-500/20 to-blue-600/10"
    },
    {
      title: "Call Us",
      desc: "Available during business hours",
      icon: <Phone size={36} className="text-green-400" />,
      value: "+1 (555) 123-4567",
      bgColor: "from-green-500/20 to-green-600/10"
    },
    {
      title: "Visit Us",
      desc: "Our headquarters location",
      icon: <MapPin size={36} className="text-purple-400" />,
      value: "123 Stock Street, Tech Valley, CA 94016",
      bgColor: "from-purple-500/20 to-purple-600/10"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
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
            CONTACT
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-sm font-medium text-blue-400 mb-2 tracking-widest text-center"
          >
            GET IN TOUCH
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          >
            Let's Connect
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
            Have questions, suggestions, or need support? Our team is ready to help you with any inquiries about Home Stock Pro. Reach out through any channel below or send us a message directly.
          </motion.p>
        </div>
      </div>
      
      {/* Contact Methods Section */}
      <div className="max-w-6xl mx-auto px-6 py-24">
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
              Contact Options
            </span>
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, idx) => (
              <motion.div 
                key={idx}
                variants={fadeIn}
                custom={idx + 1}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className={`bg-gradient-to-br ${method.bgColor} backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-xl relative overflow-hidden group`}
              >
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/5 group-hover:scale-150 transition-all duration-500" />
                <div className="absolute w-full h-full top-0 left-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="bg-gray-900/50 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{method.title}</h3>
                  <p className="text-gray-300 mb-2">{method.desc}</p>
                  <p className="text-blue-400 font-medium">{method.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Contact Form Section */}
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
              Send Us a Message
            </span>
          </motion.h2>
          
          <motion.div
            variants={fadeIn}
            custom={1}
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-800 shadow-xl"
          >
            <form className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Message</label>
                <textarea 
                  rows="5"
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Office Hours */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl p-12 text-center border border-gray-800 shadow-xl"
        >
          <div className="flex justify-center mb-6">
            <Clock size={48} className="text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Office Hours
          </h2>
          <div className="text-lg text-gray-300 max-w-xl mx-auto space-y-2">
            <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
            <p>Saturday: 10:00 AM - 4:00 PM PST</p>
            <p>Sunday: Closed</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;