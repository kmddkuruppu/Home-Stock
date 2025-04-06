import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const PayBillsForm = ({ 
  accountId = '67e6c37158784ed46b22d597',
  accountNumber = '9143562',
  onPaymentSuccess
}) => {
  const [billType, setBillType] = useState('electricity');
  const [billNumber, setBillNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [accountBalance, setAccountBalance] = useState(0);
  const [isMounted, setIsMounted] = useState(true);

  const billTypes = [
    { value: 'electricity', label: 'Electricity Bill' },
    { value: 'water', label: 'Water Bill' },
    { value: 'telephone', label: 'Telephone Bill' },
    { value: 'internet', label: 'Internet Bill' },
    { value: 'credit_card', label: 'Credit Card Payment' },
    { value: 'loan', label: 'Loan Payment' },
    { value: 'other', label: 'Other Payment' }
  ];

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch account balance when component mounts
  useEffect(() => {
    const fetchAccountBalance = async () => {
      try {
        const response = await axios.get(`http://localhost:8070/account/get/${accountId}`);
        if (isMounted) {
          setAccountBalance(response.data.account.balance);
        }
      } catch (error) {
        console.error('Error fetching account balance:', error);
        if (isMounted) {
          setErrorMessage('Failed to load account balance. Please refresh the page.');
        }
      }
    };

    fetchAccountBalance();

    return () => {
      setIsMounted(false);
    };
  }, [accountId, isMounted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrorMessage('');

    // Validation
    if (!billNumber.trim()) {
      setErrorMessage('Bill number is required');
      setLoading(false);
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setErrorMessage('Amount must be a valid positive number');
      setLoading(false);
      return;
    }

    if (amountValue > accountBalance) {
      setErrorMessage(`Insufficient account balance. Your current balance is LKR ${accountBalance.toFixed(2)}`);
      setLoading(false);
      return;
    }

    try {
      // Make payment and update balance in a single transaction if possible
      await Promise.all([
        axios.post('http://localhost:8070/payments/pay', {
          accountId,
          accountNumber,
          billType,
          billNumber,
          amount: amountValue,
          paymentDate: getCurrentDate(),
          status: 'completed'
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        }),
        axios.put(`http://localhost:8070/account/update/${accountId}`, {
          balance: -amountValue,
          description: `Payment for ${billType} bill (${billNumber})`
        })
      ]);

      if (isMounted) {
        setMessage('Payment successful!');
        setAccountBalance(prev => prev - amountValue);
        
        // Reset form
        setBillNumber('');
        setAmount('');
        
        // Notify parent component
        if (onPaymentSuccess) {
          onPaymentSuccess(amountValue);
        }
      }
    } catch (error) {
      if (isMounted) {
        console.error('Payment error:', error);
        const errorMsg = error.response?.data?.message || 
                        error.message || 
                        'Payment failed. Please try again.';
        setErrorMessage(errorMsg);
        
        // If it's a network error, suggest checking connection
        if (error.message === 'Network Error') {
          setErrorMessage('Network error. Please check your internet connection.');
        }
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Remove any non-numeric characters except decimal point
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = sanitizedValue.split('.');
    if (parts.length > 2) {
      return; // Invalid input, don't update state
    }
    setAmount(sanitizedValue);
  };

  const particleColors = [
    'from-indigo-400 to-purple-400',
    'from-blue-400 to-cyan-400',
    'from-pink-400 to-rose-400'
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center relative overflow-hidden">
      {/* Animated background gradient */}
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

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(30)].map((_, i) => {
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

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-lg px-6 py-8"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg
                className="w-10 h-10 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </motion.div>
            <h1 className="ml-3 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400">
              Pay Bills
            </h1>
          </div>
          <motion.div
            className="flex justify-center items-center py-2 mb-2 px-4 bg-indigo-900/40 rounded-lg border border-indigo-500/20"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-lg font-semibold">
              Balance: <span className="text-indigo-300">LKR {accountBalance.toFixed(2)}</span>
            </p>
          </motion.div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium mb-2">Account Number</label>
            <div className="relative group">
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-gray-900/30 border-2 border-gray-700/50 rounded-xl transition-all placeholder-gray-500/60 text-gray-300 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" 
                value={accountNumber} 
                disabled 
              />
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-indigo-500/20 pointer-events-none transition-all" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
           <label className="block text-sm font-medium mb-2">Bill Type</label>
            <div className="relative group">
              <select
                 className="w-full px-4 py-3 bg-gray-900/30 border-2 border-gray-700/50 rounded-xl transition-all text-gray-300 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 appearance-none"
                 value={billType}
                 onChange={(e) => setBillType(e.target.value)}
                 required
               >
            {billTypes.map((type) => (
            <option 
              key={type.value} 
              value={type.value}
              style={{ color: 'black' }} // 👈 Set font color to black
            >
             {type.label}
              </option>
             ))}
         </select>
    
         <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-indigo-500/20 pointer-events-none transition-all" />
    
           {/* Custom dropdown arrow */}
         <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
           <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
             </div>
            </div>
          </motion.div>


          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium mb-2">Bill Number/Reference</label>
            <div className="relative group">
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-900/30 border-2 border-gray-700/50 rounded-xl transition-all placeholder-gray-500/60 text-gray-300 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                placeholder="Enter bill number"
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
            <label className="block text-sm font-medium mb-2">Amount (LKR)</label>
            <div className="relative group">
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-900/30 border-2 border-gray-700/50 rounded-xl transition-all placeholder-gray-500/60 text-gray-300 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                required
              />
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-indigo-500/20 pointer-events-none transition-all" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium mb-2">Payment Date</label>
            <div className="relative group">
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-900/30 border-2 border-gray-700/50 rounded-xl transition-all placeholder-gray-500/60 text-gray-300"
                value={getCurrentDate()}
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
            className="w-full py-4 mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-indigo-500/40 transition-all relative overflow-hidden"
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
              Pay Bill
            </span>
          </motion.button>
        </form>

        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 p-4 bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 rounded-xl text-center"
            >
              <svg className="w-6 h-6 text-indigo-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {message}
            </motion.div>
          )}
          
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 p-4 bg-red-900/30 border border-red-500/30 text-red-300 rounded-xl text-center"
            >
              <svg className="w-6 h-6 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PayBillsForm;