import React from 'react';
import { BookOpen, CreditCard, User, DollarSign } from 'lucide-react';

const EBookAccountInterface = ({ 
  accountHolderName = 'Home Stock', 
  accountBalance = 250.75, 
  accountType = 'Saving', 
  accountNumber = '9143562' 
}) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">E-Book Account</h2>
          <BookOpen className="w-10 h-10" />
        </div>
        <div className="p-8 space-y-6">
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
        </div>
      </div>
    </div>
  );
};

export default EBookAccountInterface;