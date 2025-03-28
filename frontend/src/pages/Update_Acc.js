import React, { useState } from 'react';
import axios from 'axios';
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
  initialAccountHolderName = 'Home Stock', 
  initialAccountBalance = 250.75, 
  initialAccountType = 'Saving', 
  initialAccountNumber = '9143562',
  accountId
}) => {
  const [accountHolderName, setAccountHolderName] = useState(initialAccountHolderName);
  const [accountBalance, setAccountBalance] = useState(initialAccountBalance);
  const [accountType, setAccountType] = useState(initialAccountType);
  const [accountNumber, setAccountNumber] = useState(initialAccountNumber);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.put(`http://localhost:8070/accounts/update/${accountId}`, {
        accountHolderName,
        accountBalance,
        accountType,
        accountNumber
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error updating account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">E-Book Account</h2>
        </div>

        {/* Account Update Form */}
        <div className="p-8 space-y-6">
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="text-gray-600 block mb-1">Account Holder</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-gray-600 block mb-1">Balance (LKR)</label>
              <input 
                type="number" 
                className="w-full border p-2 rounded"
                value={accountBalance}
                onChange={(e) => setAccountBalance(parseFloat(e.target.value))}
                required
              />
            </div>

            <div>
              <label className="text-gray-600 block mb-1">Account Type</label>
              <select 
                className="w-full border p-2 rounded"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option value="Saving">Saving</option>
                <option value="Current">Current</option>
              </select>
            </div>

            <div>
              <label className="text-gray-600 block mb-1">Account Number</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Account'}
            </button>
          </form>

          {message && <p className="text-center text-green-600 mt-2">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default EBookAccountInterface;
