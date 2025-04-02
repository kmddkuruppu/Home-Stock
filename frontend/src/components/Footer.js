import { motion } from "framer-motion";
import { 
  FiGithub, FiTwitter, FiLinkedin, FiMail, 
  FiHelpCircle, FiFileText, FiShield 
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="border-t border-gray-700 bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                H
              </div>
              <span className="text-xl font-extrabold tracking-wide">HOME STOCK PRO</span>
            </div>
            <p className="text-sm text-gray-400">
              Simplify your home inventory management with powerful tracking and analytics.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
                <FiGithub />
              </a>
              <a href="#" className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
                <FiTwitter />
              </a>
              <a href="#" className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
                <FiLinkedin />
              </a>
              <a href="#" className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
                <FiMail />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-lg text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors flex items-center text-gray-400">
                  <FiHelpCircle className="mr-2" /> Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors flex items-center text-gray-400">
                  <FiFileText className="mr-2" /> Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors flex items-center text-gray-400">
                  <FiShield className="mr-2" /> Privacy Policy
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Features */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-lg text-white">Features</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition-colors text-gray-400">Inventory Tracking</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors text-gray-400">Budget Management</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors text-gray-400">Smart Alerts</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors text-gray-400">Shopping Lists</a></li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-lg text-white">Stay Updated</h3>
            <p className="text-sm text-gray-400">Subscribe to our newsletter for the latest updates and features.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-l-lg border bg-gray-800 border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full text-white placeholder-gray-500"
              />
              <button className="px-4 py-2 rounded-r-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400"
        >
          <p>© {new Date().getFullYear()} HomeStock Pro. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;