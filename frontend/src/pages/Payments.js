import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PayBillsForm = ({ 
  accountId = '67e6c37158784ed46b22d597',
  accountNumber = '9143562',
  onPaymentSuccess
}) => {
  const [billType, setBillType] = useState('electricity');
  const [billNumber, setBillNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
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

    if (!paymentDate) {
      setErrorMessage('Payment date is required');
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
          paymentDate,
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
        setPaymentDate('');
        
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

  // Set default payment date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Pay Bills</h2>
          <div className="text-lg">Balance: LKR {accountBalance.toFixed(2)}</div>
        </div>

        <div className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-600 block mb-1">Account Number</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded bg-gray-200" 
                value={accountNumber} 
                disabled 
              />
            </div>

            <div>
              <label className="text-gray-600 block mb-1">Bill Type</label>
              <select
                className="w-full border p-2 rounded"
                value={billType}
                onChange={(e) => setBillType(e.target.value)}
                required
              >
                {billTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-gray-600 block mb-1">Bill Number/Reference</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                placeholder="Enter bill number"
                required
              />
            </div>

            <div>
              <label className="text-gray-600 block mb-1">Amount (LKR)</label>
              <input
                type="text" // Changed to text to handle custom validation
                className="w-full border p-2 rounded"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                required
              />
            </div>

            <div>
              <label className="text-gray-600 block mb-1">Payment Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                min={today}
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full p-3 rounded mt-6 transition duration-200 ${
                loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Payment...
                </span>
              ) : 'Pay Bill'}
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

export default PayBillsForm;