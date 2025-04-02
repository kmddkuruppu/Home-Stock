import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiSearch, FiSun, FiMoon, FiUser } from "react-icons/fi";
import { MdDashboard, MdInventory, MdAssessment, MdSettings } from "react-icons/md";
import { motion } from "framer-motion";
import lightLogo from "../lightlogo.png";
import darkLogo from "../logo.png";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: MdDashboard, path: "/dashboard" },
    { name: "Inventory", icon: MdInventory, path: "/inventory" },
    { name: "Reports", icon: MdAssessment, path: "/reports" },
    { name: "Settings", icon: MdSettings, path: "/settings" },
  ];

  return (
    <nav className={`p-4 shadow-lg transition-all duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <img src={isDarkMode ? lightLogo : darkLogo} alt="Logo" className="h-10 w-10" />
          <span className="text-2xl font-extrabold tracking-wide">HOME STOCK PRO</span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 text-lg font-medium">
          {navItems.map((item, index) => (
            <Link key={index} to={item.path} className="flex items-center space-x-1 hover:text-blue-500 transition-all duration-200">
              <item.icon size={22} /> <span>{item.name}</span>
            </Link>
          ))}
        </div>
        
        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <input type="text" placeholder="Search..." className="p-2 pl-8 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all" />
            <FiSearch className="absolute left-2 top-2 text-gray-500" size={18} />
          </div>

          {/* Theme Toggle */}
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-all">
            {isDarkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
          </motion.button>

          {/* Profile Dropdown */}
          <div className="relative group">
            <FiUser size={24} className="cursor-pointer" />
            <div className={`absolute right-0 mt-2 w-48 rounded-lg p-2 shadow-md ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} hidden group-hover:block transition-all`}>
              <Link to="/profile" className="block px-4 py-2 rounded-md hover:bg-gray-700 hover:text-white transition-all">Profile</Link>
              <Link to="/logout" className="block px-4 py-2 rounded-md hover:bg-gray-700 hover:text-white transition-all">Logout</Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FiMenu size={24} />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }} className={`md:hidden mt-4 space-y-2 p-4 rounded-md shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
          {navItems.map((item, index) => (
            <Link key={index} to={item.path} className="block py-2 px-4 hover:text-blue-500 transition-all duration-200">
              {item.name}
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
