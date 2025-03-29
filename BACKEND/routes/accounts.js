const express = require('express');
const mongoose = require('mongoose');
const Account = require('../models/account');
const Transaction = require('../models/transaction');
const router = express.Router();

// Get account by ID with recent transactions
router.get('/get/:accountId', async (req, res) => {
  try {
    const accountId = req.params.accountId.trim();

    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ message: 'Invalid account ID' });
    }

    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Get last 3 transactions for notifications
    const recentTransactions = await Transaction.find({ accountId })
      .sort({ timestamp: -1 })
      .limit(3)
      .lean();

    res.status(200).json({ 
      account,
      notifications: recentTransactions.map(tx => ({
        title: tx.type === 'deposit' ? 'Payment Received' : 
               tx.type === 'payment' ? 'Bill Payment' : 'Account Update',
        description: tx.description,
        amount: tx.amount,
        type: tx.type,
        time: formatTimeDifference(tx.timestamp)
      }))
    });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ 
      message: 'Server error fetching account', 
      error: err.message 
    });
  }
});

// Helper function to format time difference
function formatTimeDifference(date) {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} mins ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

// Update account by ID (modified to create transaction records)
router.put('/update/:accountId', async (req, res) => {
  try {
    const accountId = req.params.accountId.trim();
    const { balance, description = 'Account update' } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ message: 'Invalid account ID' });
    }

    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (typeof balance !== 'number') {
      return res.status(400).json({ message: 'Invalid balance amount' });
    }

    const totalBalance = account.balance + balance;
    const updatedAccount = await Account.findByIdAndUpdate(
      accountId,
      { balance: totalBalance },
      { new: true }
    );

    // Create a transaction record
    const transactionType = balance >= 0 ? 'deposit' : 'withdrawal';
    await new Transaction({
      accountId,
      type: transactionType,
      amount: Math.abs(balance),
      description: description || (balance >= 0 ? 'Deposit' : 'Withdrawal')
    }).save();

    res.status(200).json({ 
      message: 'Account balance updated successfully', 
      account: {
        ...updatedAccount.toObject(),
        previousBalance: account.balance,
        addedAmount: balance,
        totalBalance: totalBalance
      }
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ 
      message: 'Server error updating account', 
      error: err.message 
    });
  }
});

module.exports = router;