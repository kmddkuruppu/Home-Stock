import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const EBookAccountUpdate = ({ 
  initialAccountHolderName = 'Home Stock', 
  initialAccountBalance = 0, 
  initialAccountType = 'Saving', 
  initialAccountNumber = '9143562',
  accountId = '67e6c37158784ed46b22d597' 
}) => {
  const [accountBalance, setAccountBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const particleColors = [
    'from-indigo-400 to-purple-400',
    'from-blue-400 to-cyan-400',
    'from-pink-400 to-rose-400'
  ];

  // Success confetti animation component
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrorMessage('');
    setShowSuccess(false);

    if (!accountId) {
      setErrorMessage('Error: Account ID is missing.');
      setLoading(false);
      return;
    }

    const balanceValue = parseFloat(accountBalance);
    if (isNaN(balanceValue) || balanceValue <= 0) {
      setErrorMessage('Account Balance must be a valid positive number.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8070/account/update/${accountId}`, {
        balance: balanceValue
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    
      setMessage(response.data.message);
      setAccountBalance('');
      
      // Show success message
      setShowSuccess(true);
      
      // Hide success message after delay
      setTimeout(() => {
        setShowSuccess(false);
      }, 3500);
      
    } catch (error) {
      console.error('Full error:', error);
      setErrorMessage(error.response?.data?.message || error.message || 'Error updating account');
    } finally {
      setLoading(false);
    }
  };

  const handleBalanceChange = (e) => {
    const value = e.target.value.replace(/^-/, '');
    setAccountBalance(value);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900/50 to-purple-900/50"
        animate={{
          background: [
            'linear-gradient(to bottom right, #111827, #1e1b4b/50, #4c1d95/50)',
            'linear-gradient(to bottom right, #111827, #312e81/50, #5b21b6/50)',
            'linear-gradient(to bottom right, #111827, #4338ca/50, #6d28d9/50)'
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
      />

      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(50)].map((_, i) => {
          const color = particleColors[Math.floor(Math.random() * particleColors.length)];
          return (
            <motion.div
              key={i}
              className={`absolute rounded-full bg-gradient-to-r ${color}`}
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                width: Math.random() * 15 + 5,
                height: Math.random() * 15 + 5,
                opacity: Math.random() * 0.4 + 0.1,
                scale: 0
              }}
              animate={{
                x: [null, Math.random() * window.innerWidth],
                y: [null, Math.random() * window.innerHeight],
                scale: 1,
                rotate: 360
              }}
              transition={{
                duration: Math.random() * 20 + 15,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'anticipate'
              }}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {showSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="relative z-10 w-full max-w-md px-6 py-10 flex flex-col items-center"
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
              className="text-3xl font-bold mb-2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Account Updated!
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <p className="text-gray-300/90 text-lg mb-6">
                Your <span className="text-green-400 font-semibold">HomeStock</span> account balance has been updated successfully.
              </p>
              <p className="text-indigo-300/90">
                Thank you for using our service.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.8, duration: 2.5 }}
              className="w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-green-500 rounded-full mt-8"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative w-full max-w-xl px-6 py-10"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center mb-10"
            >
              <div className="flex items-center justify-center mb-6">
                <motion.div
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg
                    className="w-14 h-14 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </motion.div>
                <h1 className="ml-4 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400 animate-gradient-x">
                  HomeStock
                </h1>
              </div>
              <h2 className="text-3xl font-bold mb-2">Account Balance Update</h2>
              <p className="text-gray-300/80">Manage your account details securely</p>
            </motion.div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium mb-3">Account Holder</label>
                <div className="relative group">
                  <input
                    type="text"
                    className="w-full px-5 py-4 bg-gray-900/30 border-2 border-gray-700/50 rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                    value={initialAccountHolderName}
                    disabled
                  />
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-indigo-500/20 pointer-events-none transition-all" />
                </div>
              </motion.div>

              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium mb-3">Balance (LKR)</label>
                <div className="relative group">
                  <input 
                    type="number" 
                    min="0"
                    step="0.01"
                    className="w-full px-5 py-4 bg-gray-900/30 border-2 border-gray-700/50 rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                    value={accountBalance}
                    onChange={handleBalanceChange}
                    placeholder="Enter balance"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-indigo-500/20 pointer-events-none transition-all" />
                </div>
              </motion.div>

              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium mb-3">Account Type</label>
                <div className="relative group">
                  <input
                    type="text"
                    className="w-full px-5 py-4 bg-gray-900/30 border-2 border-gray-700/50 rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                    value={initialAccountType}
                    disabled
                  />
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-indigo-500/20 pointer-events-none transition-all" />
                </div>
              </motion.div>

              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium mb-3">Account Number</label>
                <div className="relative group">
                  <input
                    type="text"
                    className="w-full px-5 py-4 bg-gray-900/30 border-2 border-gray-700/50 rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                    value={initialAccountNumber}
                    disabled
                  />
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-indigo-500/20 pointer-events-none transition-all" />
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-indigo-500/40 transition-all relative overflow-hidden"
              >
                <AnimatePresence>
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-indigo-600/80"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="h-6 w-6 border-2 border-white/50 border-t-transparent rounded-full"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className={loading ? 'opacity-0' : 'opacity-100'}>
                  Update Balance
                </span>
              </motion.button>

              {message && !showSuccess && (
                <motion.p 
                  className="text-center text-green-400 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {message}
                </motion.p>
              )}

              {errorMessage && (
                <motion.p 
                  className="text-center text-red-400 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errorMessage}
                </motion.p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EBookAccountUpdate;