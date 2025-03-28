import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';

const EBookAccountInterface = ({ 
  accountHolderName = 'Home Stock', 
  accountBalance = 250.75, 
  accountType = 'Saving', 
  accountNumber = '9143562' 
}) => {
  const [activeNotifications, setActiveNotifications] = useState(3);
  const [showNotificationDetail, setShowNotificationDetail] = useState(false);

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
        <div className="space-y-4">
          {[
            { title: "Payment Received", description: "You received LKR 5,000", time: "2 mins ago" },
            { title: "Bill Payment", description: "Electricity bill paid", time: "1 hour ago" },
            { title: "Account Update", description: "Your account details updated", time: "Today" }
          ].map((notification, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between">
                <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                <span className="text-xs text-gray-500">{notification.time}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {showNotificationDetail && <NotificationModal />}
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">E-Book Account</h2>
          <div 
            className="relative cursor-pointer"
            onClick={() => setShowNotificationDetail(true)}
          >
            <Bell className="w-8 h-8" />
            {activeNotifications > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {activeNotifications}
              </span>
            )}
          </div>
        </div>

        {/* Rest of the component remains the same */}
        <div className="p-8 space-y-6">
          {/* Account Details Section */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <User className="text-blue-600 w-8 h-8" />
              <div>
                <p className="text-md text-gray-600">Account Holder</p>
                <p className="font-bold text-lg">{accountHolderName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <DollarSign className="text-green-600 w-8 h-8" />
              <div>
                <p className="text-md text-gray-600">Balance</p>
                <p className="font-bold text-lg">LKR. {accountBalance.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <BookOpen className="text-purple-600 w-8 h-8" />
              <div>
                <p className="text-md text-gray-600">Account Type</p>
                <p className="font-bold text-lg">{accountType}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <CreditCard className="text-indigo-600 w-8 h-8" />
              <div>
                <p className="text-md text-gray-600">Account Number</p>
                <p className="font-bold text-lg">{accountNumber}</p>
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
                onClick={() => alert('Fund Transfer')}
              />
              <QuickActionButton 
                icon={QrCode} 
                label="QR Pay" 
                color="text-green-500 bg-green-50"
                onClick={() => alert('QR Payment')}
              />
              <QuickActionButton 
                icon={FileText} 
                label="Pay Bills" 
                color="text-purple-500 bg-purple-50"
                onClick={() => alert('Pay Bills')}
              />
              <QuickActionButton 
                icon={Store} 
                label="My Shop" 
                color="text-orange-500 bg-orange-50"
                onClick={() => alert('My Shop')}
              />
              <QuickActionButton 
                icon={Bell} 
                label="Notify" 
                color="text-red-500 bg-red-50"
                onClick={() => setShowNotificationDetail(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EBookAccountInterface;