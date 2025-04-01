import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Download
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
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-50 transition-colors group`}
    >
      <div className={`mb-2 ${color} p-3 rounded-full group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-sm text-gray-700 font-medium">{label}</p>
    </button>
  );

  const TransactionHistoryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-center border-b p-6">
          <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
          <button 
            onClick={() => setShowTransactionHistory(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            <ChevronRight className="w-6 h-6 transform rotate-180" />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-6">
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction._id} className="p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'deposit' ? 'bg-green-100 text-green-600' : 
                        'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'deposit' ? (
                          <ArrowDownLeft className="w-5 h-5" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 capitalize">{transaction.type}</h3>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
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
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadBill(transaction._id);
                      }}
                      className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                      disabled={downloadingId === transaction._id}
                    >
                      {downloadingId === transaction._id ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <>
                          <Download className="w-3 h-3 mr-1" />
                          Bill
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </div>
        
        <div className="border-t p-4 bg-gray-50 rounded-b-xl">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {transactions.length} transactions
            </p>
            <p className="text-sm font-medium text-gray-800">
              Current Balance: LKR {accountData.balance.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl overflow-hidden p-8 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3">Loading account data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl overflow-hidden p-8 text-center">
          <p className="text-red-500 font-medium">Error loading account:</p>
          <p className="mt-2 text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {showTransactionHistory && <TransactionHistoryModal />}
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">E-Book Account</h2>
            <p className="text-blue-100 text-sm mt-1">Active • {accountData.type} Account</p>
          </div>
          <div 
            className="relative cursor-pointer"
            onClick={() => setShowTransactionHistory(true)}
          >
            <Bell className="w-8 h-8" />
            {transactions.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {transactions.length}
              </span>
            )}
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Account Details Section */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <User className="text-blue-600 w-8 h-8" />
              <div>
                <p className="text-md text-gray-600">Account Holder</p>
                <p className="font-bold text-lg">{accountData.holderName || accountHolderName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <DollarSign className="text-green-600 w-8 h-8" />
              <div>
                <p className="text-md text-gray-600">Balance</p>
                <p className="font-bold text-lg">LKR {accountData.balance.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <BookOpen className="text-purple-600 w-8 h-8" />
              <div>
                <p className="text-md text-gray-600">Account Type</p>
                <p className="font-bold text-lg">{accountData.type}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <CreditCard className="text-indigo-600 w-8 h-8" />
              <div>
                <p className="text-md text-gray-600">Account Number</p>
                <p className="font-bold text-lg">{accountData.number}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
            <div className="grid grid-cols-5 gap-3">
              <QuickActionButton 
                icon={Send} 
                label="Transfer" 
                color="text-blue-500 bg-blue-50"
                onClick={() => navigate('/TransMoney')}
              />
              <QuickActionButton 
                icon={QrCode} 
                label="QR Pay" 
                color="text-green-500 bg-green-50"
                onClick={() => alert('QR Payment feature would open here')}
              />
              <QuickActionButton 
                icon={FileText} 
                label="Pay Bills" 
                color="text-purple-500 bg-purple-50"
                onClick={() => navigate('/payments')}
              />
              <QuickActionButton 
                icon={Store} 
                label="My Shop" 
                color="text-orange-500 bg-orange-50"
                onClick={() => alert('Shop feature would open here')}
              />
              <QuickActionButton 
                icon={Bell} 
                label="History" 
                color="text-red-500 bg-red-50"
                onClick={() => setShowTransactionHistory(true)}
              />
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
              <button 
                onClick={() => setShowTransactionHistory(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                View All ({transactions.length})
              </button>
            </div>
            <div className="space-y-3">
              {transactions.slice(0, 3).map((transaction) => (
                <div key={transaction._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'deposit' ? 'bg-green-100 text-green-600' : 
                      'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'deposit' ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 capitalize">{transaction.type}</p>
                      <p className="text-sm text-gray-600">{transaction.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}LKR {transaction.amount.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-end space-x-3">
                      <span className="text-xs text-gray-500">
                        {formatDate(transaction.timestamp)}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadBill(transaction._id);
                        }}
                        className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                        disabled={downloadingId === transaction._id}
                      >
                        {downloadingId === transaction._id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Download className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent transactions</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EBookAccountInterface;