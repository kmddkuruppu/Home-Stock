import React from 'react';

const AccountInfo = ({ account }) => {
  const { accountHolderName, accountBalance, accountType, accountNumber } = account;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Account Information</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Account Holder:</span>
          <span className="text-gray-800 font-medium">{accountHolderName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Account Number:</span>
          <span className="text-gray-800 font-medium">{accountNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Account Type:</span>
          <span className="text-gray-800 font-medium">{accountType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Account Balance:</span>
          <span className="text-gray-800 font-medium">${accountBalance}</span>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
