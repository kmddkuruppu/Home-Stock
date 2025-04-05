import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  CreditCard, 
  User, 
  DollarSign, 
  Send, 
  QrCode, 
  FileText, 
  Store, 
  Bell,
  ChevronRight,
  Loader2,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Download,
  Zap
} from 'lucide-react';

const EBookAccountInterface = ({ 
  accountId = '67e6c37158784ed46b22d597',
  accountHolderName = 'Home Stock', 
  accountBalance: initialBalance = 0.00, 
  accountType = 'Saving', 
  accountNumber = '9143562' 
}) => {
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState({
    balance: initialBalance,
    holderName: accountHolderName,
    type: accountType,
    number: accountNumber
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const particleColors = [
    'from-indigo-400 to-purple-400',
    'from-blue-400 to-cyan-400',
    'from-pink-400 to-rose-400'
  ];

  useEffect(() => {
    const fetchAccountData = async () => {
      if (!accountId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:8070/account/get/${accountId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch account data');
        }
        const data = await response.json();
        
        setAccountData({
          balance: data.account.balance,
          holderName: data.account.accountHolder,
          type: data.account.accountType,
          number: data.account.accountNumber
        });
        
        setTransactions(data.transactions || []);
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error('Error fetching account data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountData();
  }, [accountId]);

  const handleDownloadBill = async (transactionId, isNotification = false) => {
    try {
      setDownloadingId(transactionId);
      
      const response = await fetch(`http://localhost:8070/account/transactions/receipt/${transactionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to download bill');
      }

      // Get the filename from content-disposition header or generate one
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `bill_${transactionId}.pdf`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success toast
      alert(`Bill downloaded successfully${isNotification ? ' from notification' : ''}!`);
    } catch (error) {
      console.error('Error downloading bill:', error);
      alert(`Failed to download bill: ${error.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const QuickActionButton = ({ icon: Icon, label, color, onClick }) => (
    <motion.button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-gray-900/30 border-2 border-gray-700/50 rounded-xl transition-colors group"
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div 
        className={`mb-2 ${color} p-3 rounded-full`}
        whileHover={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="w-6 h-6" />
      </motion.div>
      <p className="text-sm text-gray-100 font-medium">{label}</p>
    </motion.button>
  );

  const TransactionHistoryModal = () => (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-gray-900 border-2 border-gray-700/50 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        >
          <div className="flex justify-between items-center border-b border-gray-700/50 p-6">
            <h2 className="text-xl font-bold text-gray-100">Transaction History</h2>
            <motion.button 
              onClick={() => setShowTransactionHistory(false)}
              className="text-gray-400 hover:text-gray-100"
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
          
          <div className="overflow-y-auto flex-1 p-6">
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <motion.div 
                    key={transaction._id} 
                    className="p-4 hover:bg-gray-800/50 rounded-xl transition-colors cursor-pointer border border-gray-800 group"
                    whileHover={{ scale: 1.02, x: 5 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'deposit' ? 'bg-green-900/30 text-green-400' : 
                          'bg-red-900/30 text-red-400'
                        }`}>
                          {transaction.type === 'deposit' ? (
                            <ArrowDownLeft className="w-5 h-5" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-100 capitalize">{transaction.type}</h3>
                          <p className="text-sm text-gray-400">{transaction.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'deposit' ? '+' : '-'}LKR {transaction.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(transaction.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mt-2 ml-12 space-x-3">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-gray-500 capitalize">completed</span>
                      <motion.button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadBill(transaction._id);
                        }}
                        className="flex items-center text-xs text-indigo-400 hover:text-indigo-300"
                        disabled={downloadingId === transaction._id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {downloadingId === transaction._id ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <>
                            <Download className="w-3 h-3 mr-1" />
                            Bill
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No transactions found</p>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-700/50 p-4 bg-gray-800/30 rounded-b-xl">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">
                Showing {transactions.length} transactions
              </p>
              <p className="text-sm font-medium text-gray-200">
                Current Balance: LKR {accountData.balance.toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-xl bg-gray-900/60 border-2 border-gray-700/50 shadow-2xl rounded-xl overflow-hidden p-8 flex justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          >
            <Loader2 className="w-8 h-8 text-indigo-400" />
          </motion.div>
          <span className="ml-3 text-gray-300">Loading account data...</span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {[...Array(20)].map((_, i) => {
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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-xl bg-gray-900/60 border-2 border-gray-700/50 shadow-2xl rounded-xl overflow-hidden p-8 text-center relative"
        >
          <p className="text-red-400 font-medium">Error loading account:</p>
          <p className="mt-2 text-gray-300">{error}</p>
          <motion.button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-indigo-500/40 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
      {showTransactionHistory && <TransactionHistoryModal />}
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900/50 to-purple-900/50"
      />

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
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-xl bg-gray-900/60 backdrop-blur-sm border-2 border-gray-700/50 shadow-2xl rounded-xl overflow-hidden relative"
      >
        {/* Header */}
        <motion.div 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex items-center justify-between"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mr-3"
            >
              <Zap className="w-6 h-6 text-indigo-200" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold">E-Book Account</h2>
              <p className="text-indigo-200 text-sm mt-1">Active • {accountData.type} Account</p>
            </div>
          </div>
          <motion.div 
            className="relative cursor-pointer"
            onClick={() => setShowTransactionHistory(true)}
            whileHover={{ scale: 1.1, rotate: [0, 15, -15, 0] }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <Bell className="w-8 h-8" />
            {transactions.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {transactions.length}
              </span>
            )}
          </motion.div>
        </motion.div>

        <div className="p-8 space-y-6 backdrop-blur-sm">
          {/* Account Details Section */}
          <motion.div 
            className="grid grid-cols-2 gap-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ x: 5, transition: { duration: 0.2 } }}
            >
              <div className="bg-indigo-900/30 p-3 rounded-xl text-indigo-400">
                <User className="w-8 h-8" />
              </div>
              <div>
                <p className="text-md text-gray-400">Account Holder</p>
                <p className="font-bold text-lg text-gray-100">{accountData.holderName || accountHolderName}</p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ x: 5, transition: { duration: 0.2 } }}
            >
              <div className="bg-green-900/30 p-3 rounded-xl text-green-400">
                <DollarSign className="w-8 h-8" />
              </div>
              <div>
                <p className="text-md text-gray-400">Balance</p>
                <p className="font-bold text-lg text-gray-100">LKR {accountData.balance.toFixed(2)}</p>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 gap-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ x: 5, transition: { duration: 0.2 } }}
            >
              <div className="bg-purple-900/30 p-3 rounded-xl text-purple-400">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <p className="text-md text-gray-400">Account Type</p>
                <p className="font-bold text-lg text-gray-100">{accountData.type}</p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ x: 5, transition: { duration: 0.2 } }}
            >
              <div className="bg-blue-900/30 p-3 rounded-xl text-blue-400">
                <CreditCard className="w-8 h-8" />
              </div>
              <div>
                <p className="text-md text-gray-400">Account Number</p>
                <p className="font-bold text-lg text-gray-100">{accountData.number}</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="mt-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Quick Actions</h3>
            <div className="grid grid-cols-5 gap-3">
              <QuickActionButton 
                icon={Send} 
                label="Transfer" 
                color="text-blue-500"
                onClick={() => navigate('/TransMoney')}
              />
              <QuickActionButton 
                icon={QrCode} 
                label="QR Pay" 
                color="text-green-500"
                onClick={() => alert('QR Payment feature would open here')}
              />
              <QuickActionButton 
                icon={FileText} 
                label="Pay Bills" 
                color="text-purple-500"
                onClick={() => navigate('/payments')}
              />
              <QuickActionButton 
                icon={Store} 
                label="My Shop" 
                color="text-orange-500"
                onClick={() => alert('Shop feature would open here')}
              />
              <QuickActionButton 
                icon={Bell} 
                label="History" 
                color="text-red-500"
                onClick={() => setShowTransactionHistory(true)}
              />
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div 
            className="mt-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-200">Recent Transactions</h3>
              <motion.button 
                onClick={() => setShowTransactionHistory(true)}
                className="text-sm text-indigo-400 hover:text-indigo-300"
                whileHover={{ scale: 1.05, x: 3 }}
                whileTap={{ scale: 0.95 }}
              >
                View All ({transactions.length})
              </motion.button>
            </div>
            <div className="space-y-3">
              {transactions.slice(0, 3).map((transaction, index) => (
                <motion.div 
                  key={transaction._id} 
                  className="flex items-center justify-between p-3 bg-gray-800/30 border border-gray-700/50 rounded-xl group hover:bg-gray-800/50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + (index * 0.1) }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'deposit' ? 'bg-green-900/30 text-green-400' : 
                      'bg-red-900/30 text-red-400'
                    }`}>
                      {transaction.type === 'deposit' ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-200 capitalize">{transaction.type}</p>
                      <p className="text-sm text-gray-400">{transaction.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}LKR {transaction.amount.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-end space-x-3">
                      <span className="text-xs text-gray-500">
                        {formatDate(transaction.timestamp)}
                      </span>
                      <motion.button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadBill(transaction._id);
                        }}
                        className="flex items-center text-xs text-indigo-400 hover:text-indigo-300"
                        disabled={downloadingId === transaction._id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {downloadingId === transaction._id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Download className="w-3 h-3" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {transactions.length === 0 && (
                <motion.p 
                  className="text-gray-400 text-center py-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  No recent transactions
                </motion.p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default EBookAccountInterface;