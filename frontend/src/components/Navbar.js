import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiSun, FiMoon } from "react-icons/fi";
import { MdDashboard, MdInventory, MdAssessment, MdAttachMoney } from "react-icons/md";
import { motion } from "framer-motion";
import darkLogo from "../lightlogo.png";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", icon: MdDashboard, path: "/" },
    { name: "Inventory", icon: MdInventory, path: "/inventory" },
    { name: "Reports", icon: MdAssessment, path: "/reports" },
    { name: "Budget Tracker", icon: MdAttachMoney, path: "/budget" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="p-4 shadow-lg transition-all duration-300 bg-gray-900 text-white">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavigation("/")}>
          <img src={darkLogo} alt="Logo" className="h-10 w-10" />
          <span className="text-2xl font-extrabold tracking-wide">HOME STOCK PRO</span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 text-lg font-medium">
          {navItems.map((item, index) => (
            <div 
              key={index} 
              onClick={() => handleNavigation(item.path)}
              className="flex items-center space-x-1 hover:text-blue-500 transition-all duration-200 cursor-pointer"
            >
              <item.icon size={22} /> <span>{item.name}</span>
            </div>
          ))}
        </div>
        
        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle - Removed since we're only using dark mode */}
          
          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FiMenu size={24} />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: "auto" }} 
          transition={{ duration: 0.3 }} 
          className="md:hidden mt-4 space-y-2 p-4 rounded-md shadow-md bg-gray-800 text-white"
        >
          {navItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleNavigation(item.path)}
              className="block py-2 px-4 hover:text-blue-500 transition-all duration-200 cursor-pointer"
            >
              {item.name}
            </div>
          ))}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;