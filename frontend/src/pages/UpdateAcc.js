import React, { useState } from 'react';
import axios from 'axios';

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrorMessage('');

    if (!accountId) {
      setErrorMessage('Error: Account ID is missing.');
      setLoading(false);
      return;
    }

    // Convert balance to number and validate
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
      // Reset balance to empty after successful update
      setAccountBalance('');
    } catch (error) {
      console.error('Full error:', error);
      setErrorMessage(error.response?.data?.message || error.message || 'Error updating account');
    } finally {
      setLoading(false);
    }
  };

  // Prevent negative values in the input
  const handleBalanceChange = (e) => {
    const value = e.target.value;
    // Remove any minus sign and ensure only positive numbers
    const positiveValue = value.replace(/^-/, '');
    setAccountBalance(positiveValue);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Update Account Balance</h2>
        </div>

        <div className="p-8 space-y-6">
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="text-gray-600 block mb-1">Account Holder</label>
              <input type="text" className="w-full border p-2 rounded bg-gray-200" value={initialAccountHolderName} disabled />
            </div>

            <div>
              <label className="text-gray-600 block mb-1">Balance (LKR)</label>
              <input 
                type="number" 
                min="0"
                step="0.01"
                className="w-full border p-2 rounded"
                value={accountBalance}
                onChange={handleBalanceChange}
                placeholder="Enter balance"
                required
              />
            </div>

            <div>
              <label className="text-gray-600 block mb-1">Account Type</label>
              <input type="text" className="w-full border p-2 rounded bg-gray-200" value={initialAccountType} disabled />
            </div>

            <div>
              <label className="text-gray-600 block mb-1">Account Number</label>
              <input type="text" className="w-full border p-2 rounded bg-gray-200" value={initialAccountNumber} disabled />
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Balance'}
            </button>
          </form>

          {message && <p className="text-center text-green-600 mt-2">{message}</p>}
          {errorMessage && <p className="text-center text-red-600 mt-2">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default EBookAccountUpdate;