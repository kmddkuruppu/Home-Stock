import React from "react";
import Card from "../components/Card";
import { FiHome, FiPieChart, FiShoppingCart, FiBox, FiDollarSign, FiSettings, FiUser } from "react-icons/fi";

function App() {
  const cards = [
    { 
      name: "Dinupa", 
      title: "Special Feature", 
      icon: <FiUser className="text-purple-400 text-2xl" />,
      link: "/",
      bgColor: "bg-gradient-to-br from-gray-800 to-gray-900"
    },
    { 
      name: "Udesha", 
      title: "Shopping List", 
      icon: <FiShoppingCart className="text-blue-400 text-2xl" />,
      link: "/shopping",
      bgColor: "bg-gradient-to-br from-gray-800 to-blue-900/30"
    },
    { 
      name: "Chamodi", 
      title: "Inventory", 
      icon: <FiBox className="text-emerald-400 text-2xl" />,
      link: "/inventory",
      bgColor: "bg-gradient-to-br from-gray-800 to-emerald-900/30"
    },
    { 
      name: "Dasun", 
      title: "Budget", 
      icon: <FiDollarSign className="text-amber-400 text-2xl" />,
      link: "/budget",
      bgColor: "bg-gradient-to-br from-gray-800 to-amber-900/30"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Main Content - removed md:ml-64 since sidebar is gone */}
      <div>
        {/* Header */}
        <header className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </span>
              <input 
                type="text" 
                className="py-2 pl-10 pr-4 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                placeholder="Search..."
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
              <FiUser className="text-white" />
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome to HomeStock Admin Dashboard</h2>
            <p className="text-gray-400">Manage your household inventory, budget, and shopping lists</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => (
              <Card 
                key={index}
                name={card.name}
                title={card.title}
                icon={card.icon}
                link={card.link}
                bgColor={card.bgColor}
              />
            ))}
          </div>
          
          {/* Recent Activity Section */}
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Recent Activity</h3>
              <button className="text-purple-400 hover:text-purple-300">View All</button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start pb-4 border-b border-gray-700 last:border-0">
                  <div className="bg-gray-700 p-2 rounded-lg mr-4">
                    <FiShoppingCart className="text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">New shopping item added</h4>
                    <p className="text-sm text-gray-400">Milk, Eggs, Bread</p>
                  </div>
                  <span className="text-sm text-gray-400">2 hours ago</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Inventory Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Items</span>
                  <span className="font-medium">142</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Low Stock</span>
                  <span className="text-amber-400 font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Categories</span>
                  <span className="font-medium">12</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Budget Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Monthly Budget</span>
                  <span className="font-medium">$2,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Spent This Month</span>
                  <span className="text-emerald-400 font-medium">$1,850</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Remaining</span>
                  <span className="font-medium">$650</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Shopping List</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Pending Items</span>
                  <span className="font-medium">15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Completed Today</span>
                  <span className="text-purple-400 font-medium">7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Urgent Items</span>
                  <span className="text-red-400 font-medium">3</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;