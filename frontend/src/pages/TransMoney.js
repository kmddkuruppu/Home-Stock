import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MoneyTransferForm = ({ 
  senderAccountId = '67e6c37158784ed46b22d597',
  senderAccountNumber = '9143562',
  onTransferSuccess
}) => {
  const [recipientAccountNumber, setRecipientAccountNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [accountBalance, setAccountBalance] = useState(0);
  const [isMounted, setIsMounted] = useState(true);
  const [recipientAccountValid, setRecipientAccountValid] = useState(false);
  const [recipientAccountLoading, setRecipientAccountLoading] = useState(false);

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Fetch account balance when component mounts
  useEffect(() => {
    const fetchAccountBalance = async () => {
      try {
        const response = await axios.get(`http://localhost:8070/account/get/${senderAccountId}`);
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
  }, [senderAccountId, isMounted]);

  // Validate recipient account number
  useEffect(() => {
    const validateRecipientAccount = async () => {
      if (recipientAccountNumber.length < 5) {
        setRecipientAccountValid(false);
        setRecipientName('');
        return;
      }

      setRecipientAccountLoading(true);
      try {
        const response = await axios.get(`http://localhost:8070/account/find-by-number/${recipientAccountNumber}`);
        if (isMounted) {
          setRecipientName(response.data.account?.holderName || '');
          setRecipientAccountValid(true);
        }
      } catch (error) {
        if (isMounted) {
          setRecipientName('');
          setRecipientAccountValid(false);
        }
      } finally {
        if (isMounted) {
          setRecipientAccountLoading(false);
        }
      }
    };

    const debounceTimer = setTimeout(() => {
      validateRecipientAccount();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [recipientAccountNumber, isMounted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrorMessage('');

    // Validation
    if (!recipientAccountValid) {
      setErrorMessage('Please enter a valid recipient account number');
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
      // Perform transfer
      const response = await axios.post('http://localhost:8070/transfers', {
        senderAccountId,
        senderAccountNumber,
        recipientAccountNumber,
        amount: amountValue,
        description: description || `Transfer to ${recipientAccountNumber}`,
        transferDate: getCurrentDate()
      });

      if (isMounted) {
        setMessage(`Transfer of LKR ${amountValue.toFixed(2)} to ${recipientName || recipientAccountNumber} was successful!`);
        setAccountBalance(prev => prev - amountValue);
        
        // Reset form
        setRecipientAccountNumber('');
        setAmount('');
        setDescription('');
        
        // Notify parent component
        if (onTransferSuccess) {
          onTransferSuccess(amountValue);
        }
      }
    } catch (error) {
      if (isMounted) {
        console.error('Transfer error:', error);
        const errorMsg = error.response?.data?.message || 
                        error.message || 
                        'Transfer failed. Please try again.';
        setErrorMessage(errorMsg);
        
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
      return;
    }
    setAmount(sanitizedValue);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Money Transfer</h2>
          <div className="text-lg">Balance: LKR {accountBalance.toFixed(2)}</div>
        </div>

        <div className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-600 block mb-1">From Account</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded bg-gray-200" 
                value={senderAccountNumber} 
                disabled 
              />
            </div>

            <div>
              <label className="text-gray-600 block mb-1">To Account Number</label>
              <div className="relative">
                <input
                  type="text"
                  className={`w-full border p-2 rounded ${
                    recipientAccountNumber && !recipientAccountLoading
                      ? recipientAccountValid 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-red-500 bg-red-50'
                      : ''
                  }`}
                  value={recipientAccountNumber}
                  onChange={(e) => setRecipientAccountNumber(e.target.value)}
                  placeholder="Enter recipient account number"
                  required
                />
                {recipientAccountLoading && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  </div>
                )}
              </div>
              {recipientAccountNumber && !recipientAccountLoading && (
                <p className={`text-sm mt-1 ${
                  recipientAccountValid ? 'text-green-600' : 'text-red-600'
                }`}>
                  {recipientAccountValid 
                    ? `Account verified: ${recipientName}` 
                    : 'Account not found'}
                </p>
              )}
            </div>

            <div>
              <label className="text-gray-600 block mb-1">Amount (LKR)</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                required
              />
            </div>

            <div>
              <label className="text-gray-600 block mb-1">Description (Optional)</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Rent payment, Loan repayment"
                maxLength="50"
              />
            </div>

            <div>
              <label className="text-gray-600 block mb-1">Transfer Date</label>
              <input
                type="text"
                className="w-full border p-2 rounded bg-gray-200"
                value={getCurrentDate()}
                disabled
              />
            </div>

            <button
              type="submit"
              className={`w-full p-3 rounded mt-6 transition duration-200 ${
                loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
              disabled={loading || !recipientAccountValid}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Transfer...
                </span>
              ) : 'Transfer Money'}
            </button>
          </form>

          {message && (
            <div className="p-4 bg-green-100 text-green-700 rounded-lg text-center">
              {message}
            </div>
          )}
          {errorMessage && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoneyTransferForm;