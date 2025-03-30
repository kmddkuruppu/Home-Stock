import React, { useState } from 'react';
import axios from 'axios';

const PayBillsForm = ({ 
  accountBalance = 0,
  accountNumber = '9143562',
  accountId = '67e6c37158784ed46b22d597'
}) => {
  const [billType, setBillType] = useState('electricity');
  const [billNumber, setBillNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const billTypes = [
    { value: 'electricity', label: 'Electricity Bill' },
    { value: 'water', label: 'Water Bill' },
    { value: 'telephone', label: 'Telephone Bill' },
    { value: 'internet', label: 'Internet Bill' },
    { value: 'credit_card', label: 'Credit Card Payment' },
    { value: 'loan', label: 'Loan Payment' },
    { value: 'other', label: 'Other Payment' }
  ];

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
      setErrorMessage('Insufficient account balance');
      setLoading(false);
      return;
    }

    if (!paymentDate) {
      setErrorMessage('Payment date is required');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8070/payments/pay', {
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
      });

      setMessage('Payment successful!');
      // Reset form
      setBillNumber('');
      setAmount('');
      setPaymentDate('');
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(error.response?.data?.message || error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Remove any minus sign and ensure only positive numbers
    const positiveValue = value.replace(/^-/, '');
    setAmount(positiveValue);
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
                type="number"
                min="0"
                step="0.01"
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
              className="w-full bg-blue-600 text-white p-3 rounded mt-6 hover:bg-blue-700 transition duration-200 disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? 'Processing Payment...' : 'Pay Bill'}
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