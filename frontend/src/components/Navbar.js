import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiUser, FiLogOut, FiUserCheck } from "react-icons/fi";
import { MdDashboard, MdInventory, MdAttachMoney, MdShoppingCart } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import darkLogo from "../lightlogo.png";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const navItems = [
    { name: "Dashboard", icon: MdDashboard, path: "/dashboard" },
    { name: "Inventory", icon: MdInventory, path: "/inventory" },
    { name: "Shopping List", icon: MdShoppingCart, path: "/shoppinglist" },
    { name: "Budget Tracker", icon: MdAttachMoney, path: "/expense" },
  ];

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    // Clear auth data
    localStorage.clear(); // Clear all localStorage items
    sessionStorage.clear(); // Clear all sessionStorage items
    
    // Reset any auth state in your app
    // If you're using a state management library like Redux, you'd dispatch a logout action here
    
    // Navigate to login page
    navigate("/login", { replace: true });
    setIsProfileOpen(false);
  };

  return (
    <nav className="p-4 shadow-lg transition-all duration-300 bg-gradient-to-r from-gray-900 to-gray-800 text-white sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavigation("/")}>
          <img src={darkLogo} alt="Logo" className="h-10 w-10" />
          <span className="text-2xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">HOME STOCK PRO</span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 text-lg font-medium">
          {navItems.map((item, index) => (
            <motion.div 
              key={index} 
              onClick={() => handleNavigation(item.path)}
              className="flex items-center space-x-2 hover:text-blue-400 transition-all duration-200 cursor-pointer px-3 py-1 rounded-full"
              whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <item.icon size={22} /> <span>{item.name}</span>
            </motion.div>
          ))}
        </div>
        
        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <motion.button 
              className="flex items-center space-x-1 hover:text-blue-400 bg-gray-800 bg-opacity-50 p-2 rounded-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <FiUser size={22} />
            </motion.button>
            
            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden border border-gray-700"
                >
                  <div className="py-1">
                    <motion.div 
                      className="flex items-center px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
                      whileHover={{ x: 5 }}
                      onClick={() => handleNavigation("/profile")}
                    >
                      <FiUserCheck className="mr-2" /> View Profile
                    </motion.div>
                    <motion.div 
                      className="flex items-center px-4 py-2 text-white hover:bg-gray-700 cursor-pointer text-red-400 hover:text-red-300"
                      whileHover={{ x: 5 }}
                      onClick={handleLogout}
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Mobile Menu Button */}
          <motion.button 
            className="md:hidden bg-gray-800 bg-opacity-50 p-2 rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FiMenu size={24} />
          </motion.button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }} 
            className="md:hidden mt-4 rounded-lg shadow-md bg-gray-800 text-white overflow-hidden border border-gray-700"
          >
            {navItems.map((item, index) => (
              <motion.div
                key={index}
                onClick={() => handleNavigation(item.path)}
                className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-700 transition-all duration-200 cursor-pointer border-b border-gray-700 last:border-b-0"
                whileHover={{ x: 5, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
              >
                <item.icon size={20} /> <span>{item.name}</span>
              </motion.div>
            ))}
            <motion.div
              onClick={() => handleNavigation("/profile")}
              className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-700 transition-all duration-200 cursor-pointer border-b border-gray-700"
              whileHover={{ x: 5, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
            >
              <FiUserCheck size={20} /> <span>Profile</span>
            </motion.div>
            <motion.div
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-700 transition-all duration-200 cursor-pointer text-red-400"
              whileHover={{ x: 5, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
            >
              <FiLogOut size={20} /> <span>Logout</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;