import { motion, AnimatePresence } from "framer-motion";

export default function SuccessAlert({ 
  showSuccess, 
  successAction, 
  successCourseName, 
  onHide 
}) {
  const particleColors = [
    "from-blue-400 to-blue-600",
    "from-green-400 to-green-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
    "from-yellow-400 to-yellow-600",
    "from-cyan-400 to-cyan-600"
  ];

  // Success confetti animation components
  const SuccessConfetti = () => (
    <>
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-md bg-gradient-to-r ${
            particleColors[Math.floor(Math.random() * particleColors.length)]
          }`}
          initial={{
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            width: Math.random() * 10 + 5,
            height: Math.random() * 10 + 5,
            opacity: 0,
            scale: 0
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0, 1, 0.8, 0],
            scale: [0, 1, 0.8]
          }}
          transition={{
            duration: Math.random() * 3 + 1.5,
            delay: Math.random() * 0.5,
            ease: "easeOut"
          }}
        />
      ))}
    </>
  );

  return (
    <AnimatePresence>
      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="relative z-10 w-full max-w-md px-6 py-10 flex flex-col items-center bg-gray-900/90 shadow-xl rounded-xl"
          >
            <SuccessConfetti />
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-5 mb-8 shadow-xl shadow-emerald-600/30"
            >
              <svg 
                className="w-14 h-14 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </svg>
            </motion.div>
            
            <motion.h2 
              className="text-3xl font-bold mb-2 text-center text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Success!
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <p className="text-gray-300/90 text-lg mb-6">
                Course <span className="text-green-400 font-semibold">"{successCourseName}"</span> has been {successAction} successfully!
              </p>
              <p className="text-indigo-300/90">
                Updating learning plan...
              </p>
            </motion.div>
            
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.8, duration: 2.5 }}
              className="w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-green-500 rounded-full mt-8"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}