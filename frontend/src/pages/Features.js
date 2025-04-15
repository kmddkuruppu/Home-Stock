import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { 
  ClipboardList, 
  Bell,
  Tag, 
  MapPin, 
  Search, 
  Barcode,
  TrendingUp,
  Recycle,
  DollarSign,
  ShoppingCart,
  Home,
  ChevronDown,
  BarChart
} from "lucide-react";

const InventoryFeatures = () => {
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
  
  // Features array with all the inventory management features
  const features = [
    {
      title: "Item Tracking",
      desc: "Monitor your inventory with precise counts and details",
      icon: <ClipboardList size={36} className="text-blue-400" />,
      bgColor: "from-blue-500/20 to-blue-600/10"
    },
    {
      title: "Stock Alerts",
      desc: "Get notified when items are running low or expiring",
      icon: <Bell size={36} className="text-red-400" />,
      bgColor: "from-red-500/20 to-red-600/10"
    },
    {
      title: "Categories & Tags",
      desc: "Organize items with custom categories and tags",
      icon: <Tag size={36} className="text-green-400" />,
      bgColor: "from-green-500/20 to-green-600/10"
    },
    {
      title: "Location Tracking",
      desc: "Know exactly where every item is stored",
      icon: <MapPin size={36} className="text-purple-400" />,
      bgColor: "from-purple-500/20 to-purple-600/10"
    },
    {
      title: "Search & Filters",
      desc: "Find any item instantly with powerful search options",
      icon: <Search size={36} className="text-amber-400" />,
      bgColor: "from-amber-500/20 to-amber-600/10"
    },
    {
      title: "Barcode/QR Scanning",
      desc: "Add items with a quick scan from your phone",
      icon: <Barcode size={36} className="text-indigo-400" />,
      bgColor: "from-indigo-500/20 to-indigo-600/10"
    },
    {
      title: "Consumption Trends",
      desc: "View usage patterns and optimize purchasing",
      icon: <TrendingUp size={36} className="text-cyan-400" />,
      bgColor: "from-cyan-500/20 to-cyan-600/10"
    },
    {
      title: "Waste Reduction Reports",
      desc: "Track and minimize waste with detailed analytics",
      icon: <Recycle size={36} className="text-emerald-400" />,
      bgColor: "from-emerald-500/20 to-emerald-600/10"
    },
    {
      title: "Budget Tracking",
      desc: "Monitor spending and save money on home inventory",
      icon: <DollarSign size={36} className="text-yellow-400" />,
      bgColor: "from-yellow-500/20 to-yellow-600/10"
    },
    {
      title: "Shopping Lists",
      desc: "Auto-generate shopping lists based on inventory levels",
      icon: <ShoppingCart size={36} className="text-pink-400" />,
      bgColor: "from-pink-500/20 to-pink-600/10"
    },

    {
      title: "Waste Analytics",
      desc: "Detailed insights into waste patterns and reduction opportunities",
      icon: <BarChart size={36} className="text-teal-400" />,
      bgColor: "from-teal-500/20 to-teal-600/10"
    },

    {
      title: "Smart Home Devices",
      desc: "Connect with your smart home ecosystem",
      icon: <Home size={36} className="text-orange-400" />,
      bgColor: "from-orange-500/20 to-orange-600/10"
    }
  ];
  
  // State for which category is currently expanded for mobile view
  const [expandedFeature, setExpandedFeature] = useState(null);
  
  const toggleFeature = (index) => {
    if (expandedFeature === index) {
      setExpandedFeature(null);
    } else {
      setExpandedFeature(index);
    }
  };

  const navigate = useNavigate();
  
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
            FEATURES
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-sm font-medium text-blue-400 mb-2 tracking-widest text-center"
          >
            HOME STOCK PRO
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          >
            Advanced Inventory Management
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
            Take control of your home inventory with our powerful set of features designed to save you time, reduce waste, and optimize your household management.
          </motion.p>
        </div>
      </div>
      
      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
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
              Powerful Features
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
      
      {/* Feature Showcase - Responsive Accordion for Mobile */}
      <div className="lg:hidden max-w-6xl mx-auto px-6 py-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-center mb-8"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Explore Our Features
          </span>
        </motion.h2>
        
        <div className="space-y-4">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className={`border border-gray-800 rounded-xl overflow-hidden`}
            >
              <div 
                className={`flex items-center justify-between p-4 cursor-pointer ${expandedFeature === idx ? 'bg-gray-800' : 'bg-gray-900'}`}
                onClick={() => toggleFeature(idx)}
              >
                <div className="flex items-center gap-3">
                  <div className={`bg-gradient-to-br ${feature.bgColor} p-2 rounded-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-medium">{feature.title}</h3>
                </div>
                <ChevronDown 
                  size={20} 
                  className={`transition-transform ${expandedFeature === idx ? 'rotate-180' : ''}`} 
                />
              </div>
              
              {expandedFeature === idx && (
                <div className="p-4 bg-gray-800/50">
                  <p className="text-gray-300">{feature.desc}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl p-12 text-center border border-gray-800 shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Ready to Optimize Your Home Inventory?
          </h2>
          <p className="text-lg text-gray-300 max-w-xl mx-auto mb-8">
            Take control of your home inventory management with our powerful features. Start saving time and reducing waste today.
          </p>
          <motion.button       
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium shadow-lg shadow-blue-500/30"
           onClick={() => navigate('/login')}
>
           Get Started for Free
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default InventoryFeatures;