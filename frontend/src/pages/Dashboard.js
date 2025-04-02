import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiBarChart2, FiCheckCircle, FiClock, FiDollarSign, FiPieChart, FiTrendingUp } from "react-icons/fi";

const Home = () => {
  const [activeTab, setActiveTab] = useState("features");
  const [email, setEmail] = useState("");

  const features = [
    {
      icon: <FiPieChart className="w-8 h-8" />,
      title: "Real-time Analytics",
      description: "Track your inventory with live updates and comprehensive dashboards."
    },
    {
      icon: <FiBarChart2 className="w-8 h-8" />,
      title: "Smart Reporting",
      description: "Generate detailed reports to understand your stock movements."
    },
    {
      icon: <FiCheckCircle className="w-8 h-8" />,
      title: "Automated Alerts",
      description: "Get notified when stock levels are low or items are expiring soon."
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: "Trend Analysis",
      description: "Identify usage patterns and optimize your inventory accordingly."
    }
  ];

  const testimonials = [
    {
      quote: "Home Stock Pro revolutionized how we manage our household inventory. No more guessing what we have!",
      author: "Sarah Johnson",
      role: "Home Manager"
    },
    {
      quote: "The automated alerts save us so much time and money. Never run out of essentials again.",
      author: "Michael Chen",
      role: "Busy Parent"
    },
    {
      quote: "Finally, an inventory system that's actually easy to use and looks great too.",
      author: "Emily Rodriguez",
      role: "Organization Enthusiast"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Take Control
            </span>{" "}
            of Your Home Inventory
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-10">
            Home Stock Pro helps you manage, track, and optimize everything in your home with ease.
            Never run out of essentials or overbuy again.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              Get Started - It's Free
            </Link>
            <button className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 text-gray-800 dark:text-white font-medium rounded-lg transition-all">
              Watch Demo
            </button>
          </div>
        </div>
        
        {/* Hero Image/Illustration */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="relative rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="Organized pantry" 
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <h3 className="text-xl font-bold">Your Entire Home. One Dashboard.</h3>
              <p className="text-gray-300">Track everything from food to cleaning supplies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Everything you need to keep your home stocked and organized
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-8 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 hover:-translate-y-2 shadow-sm"
              >
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Simple steps to get your home organized
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute -left-4 top-0 h-full w-0.5 bg-gray-300 dark:bg-gray-600 md:h-0.5 md:w-full md:-top-4 md:left-0"></div>
              <div className="relative z-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold mr-4">
                    1
                  </div>
                  <h3 className="text-lg font-semibold">Add Your Items</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Quickly add items by scanning barcodes or manually entering details. Categorize them for easy organization.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-4 top-0 h-full w-0.5 bg-gray-300 dark:bg-gray-600 md:h-0.5 md:w-full md:-top-4 md:left-0"></div>
              <div className="relative z-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold mr-4">
                    2
                  </div>
                  <h3 className="text-lg font-semibold">Track Usage</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Record when you use items. The system learns your consumption patterns over time.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-4 top-0 h-full w-0.5 bg-gray-300 dark:bg-gray-600 md:h-0.5 md:w-full md:-top-4 md:left-0"></div>
              <div className="relative z-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold mr-4">
                    3
                  </div>
                  <h3 className="text-lg font-semibold">Get Smart Insights</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Receive alerts when stock is low and get recommendations for optimal shopping.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Happy Homes</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Reduced Waste</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2">30%</div>
              <div className="text-blue-100">Savings on Shopping</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What People Are Saying</h2>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Don't just take our word for it
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="p-8 rounded-xl bg-gray-50 dark:bg-gray-700 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 mr-4"></div>
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.quote}"</p>
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Home Management?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of happy users who have taken control of their home inventory.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-all">
              Get Started
            </button>
          </div>
          <p className="mt-4 text-sm text-blue-200">
            Free 14-day trial. No credit card required.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/darklogo.png" alt="Logo" className="h-8 w-8 mr-2" />
              <span className="text-white font-bold">HOME STOCK PRO</span>
            </div>
            <div className="text-sm">
              &copy; {new Date().getFullYear()} Home Stock Pro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;