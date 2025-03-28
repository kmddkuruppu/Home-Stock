const express = require('express');
const mongoose = require('mongoose');
const Account = require('../models/account');
const router = express.Router();

// Get account by ID
router.get('/get/:accountId', async (req, res) => {
  try {
    const accountId = req.params.accountId.trim();

    // Validate accountId
    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ message: 'Invalid account ID' });
    }

    // Find account
    const account = await Account.findById(accountId);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.status(200).json({ account });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ 
      message: 'Server error fetching account', 
      error: err.message 
    });
  }
});

// Update account by ID (add to existing balance)
router.put('/update/:accountId', async (req, res) => {
  try {
    const accountId = req.params.accountId.trim();
    const { balance } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ message: 'Invalid account ID' });
    }

    const account = await Account.findById(accountId);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (typeof balance !== 'number' || balance <= 0) {
      return res.status(400).json({ message: 'Invalid balance amount' });
    }

    const totalBalance = account.balance + balance;

    const updatedAccount = await Account.findByIdAndUpdate(
      accountId,
      { balance: totalBalance },
      { new: true }
    );

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
