const express = require('express');
const mongoose = require('mongoose');
const Account = require('../models/account');
const router = express.Router();

// Update account by ID (add to existing balance)
router.put('/update/:accountId', async (req, res) => {
  try {
    const accountId = req.params.accountId.trim(); // Remove any whitespace
    const { balance } = req.body;
    
    // Validate accountId
    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ message: 'Invalid account ID' });
    }

    // Find the account first to get current balance
    const account = await Account.findById(accountId);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Validate input balance
    if (typeof balance !== 'number' || balance <= 0) {
      return res.status(400).json({ message: 'Invalid balance amount' });
    }

    // Calculate total balance by adding the input to existing balance
    const totalBalance = account.balance + balance;

    // Update the account with the new total balance
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