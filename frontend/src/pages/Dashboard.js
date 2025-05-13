import React, { useState, useEffect } from 'react';
import { Search, Home, Package, TrendingUp, Shield, Bell, Settings, ChevronRight, Calendar, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import for navigation

// Animated Background Component with enhanced particles
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-float"
          style={{
            width: `${Math.random() * 200 + 50}px`,
            height: `${Math.random() * 200 + 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 20 + 15}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.4
          }}
        />
      ))}
      
      {/* Glowing orbs */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div 
          key={`orb-${i}`}
          className="absolute rounded-full bg-gradient-to-r from-cyan-500/30 to-blue-500/20 blur-2xl animate-pulse"
          style={{
            width: `${Math.random() * 300 + 100}px`,
            height: `${Math.random() * 300 + 100}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 8 + 4}s`,
            opacity: 0.3
          }}
        />
      ))}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, trend, color }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:bg-white/15">
      <div className="flex justify-between">
        <div>
          <p className="text-gray-300 mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <span className={trend > 0 ? "text-green-400" : "text-red-400"}>
          {trend > 0 ? "+" : ""}{trend}% 
        </span>
        <span className="text-gray-400 text-sm ml-1">since last month</span>
      </div>
    </div>
  );
};

// Quick Action Button Component with navigation functionality
const ActionButton = ({ icon, title, description, path, navigate }) => {
  return (
    <div 
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
      onClick={() => navigate(path)}
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="p-3 rounded-full bg-gradient-to-br from-indigo-600/50 to-purple-600/50 backdrop-blur-lg">
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-gray-300 mb-3">{description}</p>
      <div className="flex items-center text-indigo-400 font-medium group-hover:text-indigo-300">
        <span>Get started</span>
        <ChevronRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all duration-300" />
      </div>
    </div>
  );
};

// Recent Activity Item Component
const ActivityItem = ({ icon, title, time, category, status }) => {
  return (
    <div className="flex items-center p-3 hover:bg-white/5 rounded-lg transition-all duration-200">
      <div className="p-2 rounded-full bg-indigo-900/40 mr-4">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-gray-400 text-sm">{time}</p>
      </div>
      <div className="flex items-center">
        <span className="px-3 py-1 text-xs rounded-full bg-white/10">{category}</span>
        {status === 'completed' && <CheckCircle className="w-4 h-4 text-green-400 ml-2" />}
      </div>
    </div>
  );
};

// Main Home Stock System Homepage
export default function HomeStockHomepage() {
  const navigate = useNavigate(); // Initialize router navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userData, setUserData] = useState({ name: 'User' });
  const [loading, setLoading] = useState(true);
  const [monthlySpending, setMonthlySpending] = useState({
    amount: 0,
    trend: 0
  });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get auth token from local storage or cookies
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No authentication token found');
          setLoading(false);
          return;
        }
        
        // Fetch user data using the auth/me endpoint
        const response = await axios.get('http://localhost:8070/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.data) {
          setUserData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  // Fetch current month spending data
  useEffect(() => {
    const fetchMonthlySpending = async () => {
      try {
        // Get current month's start and end dates
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        // Format dates for API
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        
        // Fetch spending for current month
        const currentMonthResponse = await axios.get(
          `http://localhost:8070/budget/stats/daterange?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
        );
        
        // Fetch spending for previous month for trend calculation
        const prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
        const formattedPrevStartDate = prevStartDate.toISOString().split('T')[0];
        const formattedPrevEndDate = prevEndDate.toISOString().split('T')[0];
        
        const prevMonthResponse = await axios.get(
          `http://localhost:8070/budget/stats/daterange?startDate=${formattedPrevStartDate}&endDate=${formattedPrevEndDate}`
        );
        
        const currentSpending = currentMonthResponse.data.totalSpent || 0;
        const prevSpending = prevMonthResponse.data.totalSpent || 1; // Avoid division by zero
        
        // Calculate trend percentage
        const trendPercent = prevSpending > 0 
          ? parseFloat(((currentSpending - prevSpending) / prevSpending * 100).toFixed(1))
          : 0;
          
        setMonthlySpending({
          amount: currentSpending.toFixed(2),
          trend: trendPercent
        });
        
      } catch (error) {
        console.error('Error fetching monthly spending:', error);
        // Set default values if fetch fails
        setMonthlySpending({
          amount: '0.00',
          trend: 0
        });
      }
    };
    
    fetchMonthlySpending();
  }, []);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Updated quick actions with navigation paths
  const quickActions = [
    { 
      icon: <Package className="w-6 h-6 text-indigo-100" />, 
      title: "Inventory", 
      description: "Manage stock levels and track item locations",
      path: "/inventory"
    },
    { 
      icon: <TrendingUp className="w-6 h-6 text-indigo-100" />, 
      title: "Analytics", 
      description: "View consumption trends and usage patterns",
      path: "/report"
    },
    { 
      icon: <Calendar className="w-6 h-6 text-indigo-100" />, 
      title: "Planning", 
      description: "Schedule shopping and track expiration dates",
      path: "/planing" // Keep the original spelling as requested
    }
  ];
  
  const recentActivities = [
    {
      icon: <Package className="w-4 h-4 text-indigo-300" />,
      title: "Added 5 new grocery items",
      time: "10 minutes ago",
      category: "Inventory",
      status: "completed"
    },
    {
      icon: <TrendingUp className="w-4 h-4 text-cyan-300" />,
      title: "Monthly consumption report",
      time: "2 hours ago",
      category: "Analytics",
      status: "completed"
    },
    {
      icon: <Bell className="w-4 h-4 text-amber-300" />,
      title: "Low stock alert: Dish soap",
      time: "Yesterday",
      category: "Notification",
      status: "pending"
    }
  ];

  // Get the user's first name or full name
  const getUserDisplayName = () => {
    if (loading) return '...';
    
    // If name exists in user data, use it
    if (userData.name) return userData.name;
    
    // Otherwise check for first name or username
    if (userData.firstName) return userData.firstName;
    if (userData.username) return userData.username;
    
    // Default fallback
    return 'User';
  };

  // Get current month name for display
  const getCurrentMonthName = () => {
    return new Date().toLocaleString('default', { month: 'long' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white relative overflow-hidden">
      {/* Animated background */}
      <AnimatedBackground />
      

      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-1">Welcome back, {getUserDisplayName()}</h2>
            <div className="flex items-center text-gray-300">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(currentTime)}</span>
              <span className="mx-2">•</span>
              <span>{formatTime(currentTime)}</span>
            </div>
          </div>
        </div>
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={<Package className="w-6 h-6 text-white" />} 
            title="Total Items" 
            value="247" 
            trend={5.2}
            color="bg-gradient-to-br from-indigo-600/80 to-blue-600/80" 
          />
          <StatCard 
            icon={<CheckCircle className="w-6 h-6 text-white" />} 
            title="In Stock" 
            value="186" 
            trend={8.1}
            color="bg-gradient-to-br from-green-600/80 to-emerald-600/80" 
          />
          <StatCard 
            icon={<Bell className="w-6 h-6 text-white" />} 
            title="Low Stock Items" 
            value="12" 
            trend={-3.4}
            color="bg-gradient-to-br from-amber-600/80 to-orange-600/80" 
          />
          <StatCard 
            icon={<TrendingUp className="w-6 h-6 text-white" />} 
            title={`${getCurrentMonthName()} Spending`} 
            value={`LKR.${monthlySpending.amount}`} 
            trend={monthlySpending.trend}
            color="bg-gradient-to-br from-purple-600/80 to-pink-600/80" 
          />
        </div>
        
        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Quick Actions */}
          <div className="lg:w-2/3">
            <h3 className="text-xl font-semibold mb-5">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {quickActions.map((action, index) => (
                <ActionButton 
                  key={index} 
                  {...action} 
                  navigate={navigate} 
                />
              ))}
            </div>
            
            {/* Featured Section */}
            <div className="mt-8 p-8 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 backdrop-blur-lg rounded-2xl border border-indigo-500/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h3 className="text-2xl font-bold mb-4">Optimize your inventory with AI</h3>
                  <p className="text-gray-300 mb-6 max-w-md">
                    Our smart system analyzes your consumption patterns to predict 
                    when you'll need to restock and suggests optimal quantities.
                  </p>
                  <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-medium hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-indigo-900/50">
                    Enable Smart Predictions
                  </button>
                </div>
                <div className="flex-shrink-0 w-full md:w-64 h-48 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-md border border-white/10 flex items-center justify-center">
                  <TrendingUp className="w-16 h-16 text-indigo-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Recent Activity */}
          <div className="lg:w-1/3">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden h-full">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-semibold">Recent Activity</h3>
              </div>
              <div className="p-4">
                {recentActivities.map((activity, index) => (
                  <ActivityItem key={index} {...activity} />
                ))}
                <div className="mt-4 text-center">
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center justify-center mx-auto">
                    View all activity
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}