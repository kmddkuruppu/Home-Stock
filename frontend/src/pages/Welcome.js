import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HomeStockWelcome = () => {
  const [loaded, setLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    
    // Auto-rotate features only when not hovering
    const interval = setInterval(() => {
      if (!isHovering) {
        setActiveFeature(prev => (prev + 1) % features.length);
      }
    }, 5000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isHovering]);

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: 'Smart Tracking',
      description: 'Automatically track expiration dates and consumption patterns with AI-powered scanning and predictive analytics.',
      color: 'from-indigo-500 to-blue-500',
      bgImage: 'bg-[url("https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")]'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: 'Real-time Analytics',
      description: 'Get actionable insights into your consumption patterns and spending habits with beautiful, interactive dashboards.',
      color: 'from-purple-500 to-pink-500',
      bgImage: 'bg-[url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")]'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Cost Optimization',
      description: 'Reduce waste and save money with personalized shopping suggestions and optimal purchase timing alerts.',
      color: 'from-teal-500 to-emerald-500',
      bgImage: 'bg-[url("https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")]'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Mobile Ready',
      description: 'Access your inventory anywhere with our fully responsive web app and native mobile applications.',
      color: 'from-amber-500 to-orange-500',
      bgImage: 'bg-[url("https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")]'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col overflow-hidden relative">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 overflow-hidden opacity-80">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-gray-900"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear'
          }}
        />
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              width: Math.random() * 15 + 5,
              height: Math.random() * 15 + 5,
              opacity: Math.random() * 0.4 + 0.1
            }}
            animate={{
              x: [null, Math.random() * window.innerWidth],
              y: [null, Math.random() * window.innerHeight],
              transition: {
                duration: Math.random() * 20 + 15,
                repeat: Infinity,
                repeatType: 'reverse'
              }
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          className="text-center mb-8 sm:mb-12 w-full"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={loaded ? { scale: 1, rotate: 0 } : {}}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <svg
                className="w-12 h-12 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="ml-3 text-4xl font-extrabold tracking-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400">
                Home<span className="text-indigo-400">Stock</span>
              </span>
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300 font-medium"
          >
            Intelligent inventory management for modern households
          </motion.p>
        </motion.header>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={loaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.6, -0.05, 0.01, 0.99] }}
          className="text-center mb-12 sm:mb-16 w-full"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 leading-tight"
          >
            Transform Your <br className="hidden sm:block" />Home Inventory
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 mb-10 font-medium"
          >
            HomeStock combines powerful tracking with intelligent analytics to help you manage your household inventory effortlessly.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.button
              onClick={handleGetStarted}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)'
              }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center">
                Get Started
                <svg
                  className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </motion.button>
            
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 10px 25px -5px rgba(255, 255, 255, 0.1)'
              }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gray-800/50 border border-gray-700 rounded-xl font-semibold text-lg shadow-lg hover:shadow-white/10 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center">
                Learn More
                <svg
                  className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </span>
              <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Featured Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-6xl"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className={`absolute inset-0 ${features[activeFeature].bgImage} bg-cover bg-center`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-gray-900/30" />
                <div className={`absolute inset-0 bg-gradient-to-br ${features[activeFeature].color}/30`} />
                
                <div className="relative h-full p-8 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <motion.div 
                        className="p-3 rounded-xl bg-white/10 backdrop-blur-sm inline-flex mb-4"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {features[activeFeature].icon}
                      </motion.div>
                      <motion.h3 
                        className="text-2xl sm:text-3xl font-bold text-white mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {features[activeFeature].title}
                      </motion.h3>
                      <motion.p 
                        className="text-white/90 max-w-md"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        {features[activeFeature].description}
                      </motion.p>
                    </div>
                    <motion.div 
                      className="text-6xl sm:text-7xl font-bold opacity-10"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 0.1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      0{activeFeature + 1}
                    </motion.div>
                  </div>
                  
                  <div className="flex justify-center space-x-2">
                    {features.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveFeature(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === activeFeature ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/50'}`}
                        aria-label={`Go to feature ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl"
        >
          {[
            { value: '85%', label: 'Reduction in waste' },
            { value: '$200+', label: 'Monthly savings' },
            { value: '4.9★', label: 'User rating' },
            { value: '10K+', label: 'Happy users' }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 text-center"
            >
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400">
                {stat.value}
              </div>
              <div className="text-gray-400 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
          className="mt-16 max-w-3xl text-center"
        >
          <div className="relative">
            <svg 
              className="w-10 h-10 text-indigo-400/30 absolute -top-8 -left-8"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <div className="text-gray-300 italic text-lg md:text-xl mb-4 px-8">
              "HomeStock saved us over $200/month by reducing food waste and optimizing our shopping habits. It's like having a personal home economist!"
            </div>
            <div className="text-gray-300 font-medium flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-indigo-500 mr-3 overflow-hidden">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="Sarah K." 
                  className="w-full h-full object-cover"
                />
              </div>
              Sarah K., HomeStock Pro User
            </div>
            <svg 
              className="w-10 h-10 text-indigo-400/30 absolute -bottom-8 -right-8 transform rotate-180"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ delay: 1 }}
        className="relative z-10 py-8 text-center"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
            <div className="flex items-center mb-4 md:mb-0">
              <svg
                className="w-6 h-6 text-indigo-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span className="text-lg font-semibold">Home<span className="text-indigo-400">Stock</span></span>
            </div>
            
            <div className="flex space-x-6 mb-4 md:mb-0">
              {['Features', 'Pricing', 'About', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
            
            <div className="flex space-x-4">
              {[
                'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
                'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
                'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
              ].map((path, i) => (
                <a 
                  key={i}
                  href="#"
                  className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-6 pt-6 text-sm text-gray-500">
            © {new Date().getFullYear()} HomeStock. All rights reserved.
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default HomeStockWelcome;