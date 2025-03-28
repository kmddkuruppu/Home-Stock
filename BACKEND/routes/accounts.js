const express = require('express');
const mongoose = require('mongoose'); // Add this import
const Account = require('../models/account');
const router = express.Router();

// Update account by ID (only balance is updated)
router.put('/update/:accountId', async (req, res) => {
  try {
    const accountId = req.params.accountId.trim(); // Remove any whitespace
    const { balance } = req.body;
    
    // Validate accountId
    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ message: 'Invalid account ID' });
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      accountId,
      { balance },
      { new: true }
    );

    if (!updatedAccount) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.status(200).json({ message: 'Account updated successfully', account: updatedAccount });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error updating account', error: err.message });
  }
});

module.exports = router;