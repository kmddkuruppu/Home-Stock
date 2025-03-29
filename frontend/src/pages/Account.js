import React, { useState, useEffect } from 'react';
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
  ArrowDownLeft
} from 'lucide-react';

const EBookAccountInterface = ({ 
  accountId = '67e6c37158784ed46b22d597',
  accountHolderName = 'Home Stock', 
  accountBalance: initialBalance = 0.00, 
  accountType = 'Saving', 
  accountNumber = '9143562' 
}) => {
  const [accountData, setAccountData] = useState({
    balance: initialBalance,
    holderName: accountHolderName,
    type: accountType,
    number: accountNumber
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unseenNotifications, setUnseenNotifications] = useState(0);
  const [showNotificationDetail, setShowNotificationDetail] = useState(false);

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
        
        // Initialize notifications with seen: false for new notifications
        const fetchedNotifications = (data.notifications || []).map(notification => ({
          ...notification,
          seen: false
        }));
        
        setNotifications(fetchedNotifications);
        setUnseenNotifications(fetchedNotifications.length); // Initially all are unseen
      } catch (err) {
        console.error('Error fetching account data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountData();
  }, [accountId]);

  const handleNotificationClick = () => {
    // Mark all notifications as seen when opening the modal
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      seen: true
    }));
    
    setNotifications(updatedNotifications);
    setUnseenNotifications(0);
    setShowNotificationDetail(true);
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

  const NotificationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-96 p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
          <button 
            onClick={() => setShowNotificationDetail(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            <ChevronRight className="w-6 h-6 transform rotate-180" />
          </button>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index} className={`bg-gray-100 p-4 rounded-lg ${!notification.seen ? 'border-l-4 border-blue-500' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                  </div>
                  <div className="flex items-center">
                    {notification.type === 'deposit' ? (
                      <span className="text-green-600 font-medium flex items-center">
                        <ArrowDownLeft className="w-4 h-4 mr-1" />
                        LKR {notification.amount.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium flex items-center">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        LKR {notification.amount.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-2 block">{notification.time}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No notifications available</p>
          )}
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
      {showNotificationDetail && <NotificationModal />}
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">E-Book Account</h2>
            <p className="text-blue-100 text-sm mt-1">Active • {accountData.type} Account</p>
          </div>
          <div 
            className="relative cursor-pointer"
            onClick={handleNotificationClick}
          >
            <Bell className="w-8 h-8" />
            {unseenNotifications > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {unseenNotifications}
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
                <p className="font-bold text-lg">{accountData.holderName}</p>
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
                onClick={() => alert('Fund Transfer feature would open here')}
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
                onClick={() => alert('Bill Payment feature would open here')}
              />
              <QuickActionButton 
                icon={Store} 
                label="My Shop" 
                color="text-orange-500 bg-orange-50"
                onClick={() => alert('Shop feature would open here')}
              />
              <QuickActionButton 
                icon={Bell} 
                label="Alerts" 
                color="text-red-500 bg-red-50"
                onClick={handleNotificationClick}
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h3>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification, index) => (
                <div key={index} className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${!notification.seen ? 'border-l-4 border-blue-500' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      notification.type === 'deposit' ? 'bg-green-100 text-green-600' : 
                      notification.type === 'payment' ? 'bg-blue-100 text-blue-600' : 
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {notification.type === 'deposit' ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : notification.type === 'payment' ? (
                        <FileText className="w-5 h-5" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      notification.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {notification.type === 'deposit' ? '+' : '-'}LKR {notification.amount.toFixed(2)}
                    </p>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EBookAccountInterface;