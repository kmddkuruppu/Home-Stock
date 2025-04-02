import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { 
  FiCheckCircle, 
  FiTrendingUp, 
  FiPieChart, 
  FiCloud, 
  FiArrowRight,
  FiBarChart2,
  FiShoppingCart,
  FiUsers
} from "react-icons/fi";
import heroImage from "../logo.png";
import dashboardPreview from "../lightlogo.png"; // Add this image

const FeatureCard = ({ icon, title, description, delay }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
      transition={{ duration: 0.6, delay }}
      className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
    >
      <div className="text-blue-500 mb-4 text-3xl">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
};

const Home = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-white min-h-screen overflow-hidden">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="md:w-1/2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 font-medium mb-4"
          >
            Inventory Management Reimagined
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
              Smarter Stock
            </span>{" "}
            Control for Your Business
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-lg"
          >
            Home Stock Pro delivers powerful inventory management with beautiful analytics and real-time tracking to optimize your operations.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              Get Started <FiArrowRight />
            </Link>
            <Link
              to="/features"
              className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 50, rotateY: 10 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 relative"
        >
          <img
            src={heroImage}
            alt="Inventory Management"
            className="w-full max-w-xl rounded-2xl shadow-2xl border-8 border-white dark:border-gray-800"
          />
          <motion.div
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium">Real-time Sync</span>
            </div>
          </motion.div>
          <motion.div
            animate={{
              y: [0, 15, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-2">
              <FiTrendingUp className="text-blue-500" />
              <span className="font-medium">+45% Efficiency</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Logo Cloud Section */}
      <motion.div 
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 }
        }}
        transition={{ duration: 0.6 }}
        className="py-12 bg-white dark:bg-gray-800/50 shadow-sm"
      >
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8 text-lg">
            Trusted by businesses worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-70">
            {["Company A", "Company B", "Company C", "Company D"].map((company, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="text-2xl font-bold text-gray-700 dark:text-gray-300"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Powerful Features for <span className="text-blue-500">Your Business</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Everything you need to manage inventory efficiently and make data-driven decisions.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FiTrendingUp />}
            title="Real-time Analytics"
            description="Get instant insights into your stock levels, sales trends, and inventory health."
            delay={0.1}
          />
          <FeatureCard
            icon={<FiPieChart />}
            title="Detailed Reports"
            description="Generate comprehensive reports to understand your business performance."
            delay={0.2}
          />
          <FeatureCard
            icon={<FiCloud />}
            title="Cloud Sync"
            description="Access your inventory data from anywhere, anytime, on any device."
            delay={0.3}
          />
          <FeatureCard
            icon={<FiBarChart2 />}
            title="Demand Forecasting"
            description="Predict future demand and optimize your inventory levels."
            delay={0.4}
          />
          <FeatureCard
            icon={<FiShoppingCart />}
            title="Purchase Management"
            description="Streamline your purchasing process with automated workflows."
            delay={0.5}
          />
          <FeatureCard
            icon={<FiUsers />}
            title="Multi-user Access"
            description="Collaborate with your team with role-based access control."
            delay={0.6}
          />
        </div>
      </div>

      {/* Dashboard Preview Section */}
      <div className="bg-gray-50 dark:bg-gray-800/50 py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <motion.h2
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-6"
              >
                <span className="text-blue-500">Beautiful</span> Dashboard
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-xl text-gray-600 dark:text-gray-300 mb-8"
              >
                Our intuitive dashboard gives you a complete overview of your inventory at a glance, with customizable widgets and real-time data.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                {[
                  "Interactive charts and graphs",
                  "Customizable dashboard layout",
                  "Quick action shortcuts",
                  "Real-time notifications"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <FiCheckCircle className="text-blue-500 text-xl" />
                    <span className="text-lg">{item}</span>
                  </div>
                ))}
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <img
                src={dashboardPreview}
                alt="Dashboard Preview"
                className="rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700"
              />
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="text-sm font-medium">Low stock alert</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          >
            Ready to Transform Your Inventory Management?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-blue-100 max-w-3xl mx-auto mb-10"
          >
            Join thousands of businesses that trust Home Stock Pro to streamline their operations.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/signup"
              className="px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Free Trial
            </Link>
            <Link
              to="/demo"
              className="px-8 py-4 bg-transparent hover:bg-blue-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white"
            >
              Request Demo
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;