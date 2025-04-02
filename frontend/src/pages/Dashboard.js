import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiPackage, FiAlertCircle, FiChevronRight, FiPlus, 
  FiTrendingUp, FiShoppingCart,
  FiClock, FiCalendar, FiSettings, FiBell, FiSearch
} from "react-icons/fi";
import { 
  MdOutlineInventory2, MdOutlineCategory, MdOutlineAnalytics,
  MdOutlineReceipt, MdOutlineShoppingBag, MdOutlineDashboard
} from "react-icons/md";
import { BsLightningCharge, BsGraphUp } from "react-icons/bs";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  
  // Sample data
  const stats = [
    { title: "Total Items", value: "1,247", icon: FiPackage, color: "from-blue-500 to-blue-600", trend: "+5.2%" },
    { title: "Categories", value: "24", icon: MdOutlineCategory, color: "from-purple-500 to-purple-600", trend: "+2" },
    { title: "Low Stock", value: "12", icon: FiAlertCircle, color: "from-red-500 to-red-600", trend: "↓3" },
    { title: "Monthly Spend", value: "$487", icon: MdOutlineReceipt, color: "from-green-500 to-green-600", trend: "↓12%" },
  ];

  const recentItems = [
    { id: 1, name: "LED Light Bulbs", category: "Lighting", quantity: 15, lastUpdated: "2h ago", status: "added" },
    { id: 2, name: "Organic Eggs", category: "Groceries", quantity: 12, lastUpdated: "5h ago", status: "used" },
    { id: 3, name: "Paper Towels", category: "Cleaning", quantity: 3, lastUpdated: "1d ago", status: "low" },
    { id: 4, name: "Coffee Filters", category: "Kitchen", quantity: 30, lastUpdated: "2d ago", status: "added" },
  ];

  const categories = [
    { name: "Kitchen", items: 182, color: "bg-blue-500" },
    { name: "Bathroom", items: 97, color: "bg-purple-500" },
    { name: "Garage", items: 143, color: "bg-green-500" },
    { name: "Living Room", items: 68, color: "bg-yellow-500" },
    { name: "Bedroom", items: 42, color: "bg-pink-500" },
  ];

  const upcomingTasks = [
    { id: 1, task: "Restock toilet paper", due: "Tomorrow", priority: "high" },
    { id: 2, task: "Check expiration dates", due: "In 3 days", priority: "medium" },
    { id: 3, task: "Organize pantry", due: "Next week", priority: "low" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-hidden">
      {/* Sidebar */}
      <motion.div 
        initial={{ width: sidebarOpen ? 280 : 80 }}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className={`h-full bg-white dark:bg-gray-800 shadow-lg z-20 flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'px-4' : 'px-2'}`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between py-6 border-b border-gray-200 dark:border-gray-700">
            {sidebarOpen ? (
              <motion.div 
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-2">
                  H
                </div>
                <span className="text-xl font-bold">HomeStock</span>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mx-auto"
              >
                H
              </motion.div>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiChevronRight className={`transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center w-full p-3 rounded-lg transition-all ${activeTab === "dashboard" ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <MdOutlineDashboard className="text-xl" />
                {sidebarOpen && <span className="ml-3">Dashboard</span>}
              </button>
              <button
                onClick={() => setActiveTab("inventory")}
                className={`flex items-center w-full p-3 rounded-lg transition-all ${activeTab === "inventory" ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <MdOutlineInventory2 className="text-xl" />
                {sidebarOpen && <span className="ml-3">Inventory</span>}
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex items-center w-full p-3 rounded-lg transition-all ${activeTab === "analytics" ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <MdOutlineAnalytics className="text-xl" />
                {sidebarOpen && <span className="ml-3">Analytics</span>}
              </button>
              <button
                onClick={() => setActiveTab("shopping")}
                className={`flex items-center w-full p-3 rounded-lg transition-all ${activeTab === "shopping" ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <MdOutlineShoppingBag className="text-xl" />
                {sidebarOpen && <span className="ml-3">Shopping List</span>}
              </button>
            </div>
            
            {sidebarOpen && (
              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Quick Actions
                </h3>
                <div className="space-y-1">
                  <button className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                    <FiPlus className="text-xl" />
                    <span className="ml-3">Add Item</span>
                  </button>
                  <button className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                    <FiShoppingCart className="text-xl" />
                    <span className="ml-3">Quick Shop</span>
                  </button>
                  <button className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                    <FiCalendar className="text-xl" />
                    <span className="ml-3">Schedule</span>
                  </button>
                </div>
              </div>
            )}
          </nav>
          
          {/* User Profile */}
          <div className="py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                U
              </div>
              {sidebarOpen && (
                <div className="ml-3">
                  <p className="text-sm font-medium">User Name</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Free Plan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "inventory" && "Inventory Management"}
                {activeTab === "analytics" && "Analytics"}
                {activeTab === "shopping" && "Shopping List"}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button 
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative"
              >
                <FiBell />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiSettings />
              </button>
            </div>
          </div>
        </header>
        
        {/* Notification Panel */}
        <AnimatePresence>
          {notificationOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute right-6 top-16 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-30 border border-gray-200 dark:border-gray-700"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
                <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-start">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 mr-3">
                      <FiPackage />
                    </div>
                    <div>
                      <p className="font-medium">Low stock alert</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Paper towels are running low (3 left)</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-start">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400 mr-3">
                      <FiShoppingCart />
                    </div>
                    <div>
                      <p className="font-medium">Shopping reminder</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Your weekly shopping is due tomorrow</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Yesterday</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View all notifications
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900/50">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`bg-gradient-to-r ${stat.color} rounded-xl shadow-lg p-6 text-white`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium opacity-80">{stat.title}</p>
                          <p className="text-2xl font-bold mt-1">{stat.value}</p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                          <stat.icon size={20} />
                        </div>
                      </div>
                      <p className="text-sm mt-3 opacity-90 flex items-center">
                        <span className="inline-flex items-center">
                          {stat.trend.startsWith('↑') ? (
                            <FiTrendingUp className="mr-1" />
                          ) : stat.trend.startsWith('↓') ? (
                            <FiTrendingUp className="mr-1 transform rotate-180" />
                          ) : null}
                          {stat.trend}
                        </span>
                        <span className="mx-2">•</span>
                        <span>vs last month</span>
                      </p>
                    </motion.div>
                  ))}
                </div>
                
                {/* Main Dashboard Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Inventory Overview */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Inventory Overview</h2>
                      <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                        View all <FiChevronRight className="ml-1" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {recentItems.map((item) => (
                        <div key={item.id} className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                          <div className={`p-3 rounded-lg mr-4 ${
                            item.status === 'added' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                            item.status === 'used' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                            'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          }`}>
                            <FiPackage />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{item.quantity} pcs</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.lastUpdated}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Categories Distribution */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
                  >
                    <h2 className="text-xl font-semibold mb-6">Categories</h2>
                    
                    <div className="space-y-4">
                      {categories.map((category, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{category.name}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{category.items} items</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`${category.color} h-2 rounded-full`} 
                              style={{ width: `${Math.min(100, (category.items / 200) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 mr-3">
                          <BsLightningCharge />
                        </div>
                        <div>
                          <p className="font-medium">Quick Tip</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Your kitchen items make up 36% of total inventory
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Upcoming Tasks */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Upcoming Tasks</h2>
                      <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                        View all <FiChevronRight className="ml-1" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {upcomingTasks.map((task) => (
                        <div key={task.id} className="flex items-start p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                          <div className={`mt-1 w-3 h-3 rounded-full mr-3 ${
                            task.priority === 'high' ? 'bg-red-500' :
                            task.priority === 'medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}></div>
                          <div className="flex-1">
                            <h3 className="font-medium">{task.task}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Due {task.due}</p>
                          </div>
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                            <FiClock />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Recent Activity */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 lg:col-span-2"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Recent Activity</h2>
                      <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                        View all <FiChevronRight className="ml-1" />
                      </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">LED Light Bulbs</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">Added</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">+15</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">2 hours ago</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">Organic Eggs</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">Used</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">-2</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">5 hours ago</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">Paper Towels</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">Low Stock</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">3 left</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">1 day ago</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
            
            {activeTab === "inventory" && (
              <motion.div
                key="inventory"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-6">Inventory Management</h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <p>Inventory content goes here</p>
                </div>
              </motion.div>
            )}
            
            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <div className="h-96 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div className="text-center">
                      <BsGraphUp size={60} className="text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">Analytics charts and visualizations</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === "shopping" && (
              <motion.div
                key="shopping"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-6">Shopping List</h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <p>Shopping list content goes here</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default HomePage;