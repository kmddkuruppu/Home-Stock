const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Account = require('../models/account');
const Transaction = require('../models/transaction');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
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

// Generate PDF receipt
function generateReceiptPDF(transaction, account, filePath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    
    doc.pipe(stream);

    // Header
    doc.fontSize(20).text('Payment Receipt', { align: 'center' });
    doc.moveDown();
    
    // Transaction Details
    doc.fontSize(14).text('Transaction Details', { underline: true });
    doc.fontSize(12).text(`Transaction ID: ${transaction._id}`);
    doc.text(`Reference Number: ${transaction.referenceNumber}`);
    doc.text(`Date: ${transaction.timestamp.toLocaleString()}`);
    doc.text(`Type: ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}`);
    doc.text(`Status: ${transaction.status}`);
    doc.moveDown();
    
    // Amount
    doc.fontSize(14).text('Amount', { underline: true });
    doc.fontSize(16).text(`LKR ${transaction.amount.toFixed(2)}`, { align: 'center' });
    doc.moveDown();
    
    // Account Details
    doc.fontSize(14).text('Account Details', { underline: true });
    doc.fontSize(12).text(`Account Holder: ${account.accountHolder}`);
    doc.text(`Account Number: ${account.accountNumber}`);
    doc.text(`Account Type: ${account.accountType}`);
    doc.moveDown();
    
    // Description
    doc.fontSize(14).text('Description', { underline: true });
    doc.fontSize(12).text(transaction.description);
    
    // Footer
    doc.moveDown(2);
    doc.fontSize(10).text('This is an official receipt. Please retain for your records.', { align: 'center' });
    
    doc.end();
    
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

// Get account by ID with all transactions
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

    // Get all transactions sorted by most recent
    const transactions = await Transaction.find({ accountId })
      .sort({ timestamp: -1 })
      .lean();

    res.status(200).json({ 
      account,
      transactions,
      notifications: transactions.slice(0, 3).map(tx => ({
        title: tx.type === 'deposit' ? 'Payment Received' : 
               tx.type === 'payment' ? 'Bill Payment' : 'Account Update',
        description: tx.description,
        amount: tx.amount,
        type: tx.type,
        time: formatTimeDifference(tx.timestamp),
        transactionId: tx._id
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

// Create new account
router.post('/create', async (req, res) => {
  try {
    const { accountHolder, accountType, initialBalance } = req.body;

    // Generate account number
    const accountNumber = `AC-${Date.now().toString().slice(-8)}`;

    const newAccount = new Account({
      accountHolder,
      accountType,
      balance: initialBalance || 0,
      accountNumber
    });

    await newAccount.save();

    // Create initial transaction if there's an initial balance
    if (initialBalance && initialBalance > 0) {
      await new Transaction({
        accountId: newAccount._id,
        type: 'deposit',
        amount: initialBalance,
        description: 'Initial deposit'
      }).save();
    }

    res.status(201).json({
      message: 'Account created successfully',
      account: newAccount
    });
  } catch (err) {
    console.error('Create error:', err);
    res.status(500).json({ 
      message: 'Server error creating account', 
      error: err.message 
    });
  }
});

// Update account balance
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
    const transactionAmount = Math.abs(balance);
    const transaction = await new Transaction({
      accountId,
      type: transactionType,
      amount: transactionAmount,
      description: description || (balance >= 0 ? 'Deposit' : 'Withdrawal')
    }).save();

    // Send email notification for the transaction
    await sendTransactionEmail({
      type: transactionType,
      amount: transactionAmount,
      description: transaction.description,
      accountNumber: account.accountNumber
    });

    res.status(200).json({ 
      message: 'Account balance updated successfully', 
      account: {
        ...updatedAccount.toObject(),
        previousBalance: account.balance,
        addedAmount: balance,
        totalBalance: totalBalance
      },
      transaction
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ 
      message: 'Server error updating account', 
      error: err.message 
    });
  }
});

// Generate and download bill receipt
router.get('/transactions/receipt/:transactionId', async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    
    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const account = await Account.findById(transaction.accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Create receipts directory if it doesn't exist
    const receiptsDir = path.join(__dirname, '../receipts');
    if (!fs.existsSync(receiptsDir)) {
      fs.mkdirSync(receiptsDir);
    }

    const fileName = `receipt_${transactionId}.pdf`;
    const filePath = path.join(receiptsDir, fileName);

    // Generate PDF receipt
    await generateReceiptPDF(transaction, account, filePath);

    // Set headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Delete the file after streaming (optional)
    fileStream.on('end', () => {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting receipt file:', err);
      });
    });
  } catch (err) {
    console.error('Receipt generation error:', err);
    res.status(500).json({ 
      message: 'Error generating receipt', 
      error: err.message 
    });
  }
});

// Get transaction history
router.get('/transactions/:accountId', async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ message: 'Invalid account ID' });
    }

    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const transactions = await Transaction.find({ accountId })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const totalTransactions = await Transaction.countDocuments({ accountId });

    res.status(200).json({
      transactions,
      total: totalTransactions,
      page: parseInt(page),
      pages: Math.ceil(totalTransactions / limit)
    });
  } catch (err) {
    console.error('Transaction history error:', err);
    res.status(500).json({ 
      message: 'Error fetching transaction history', 
      error: err.message 
    });
  }
});

// Function to send transaction email
async function sendTransactionEmail(transactionDetails) {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: 'homestockpro@gmail.com',
    subject: `New Transaction: ${transactionDetails.type}`,
    html: `
      <h2>Transaction Notification</h2>
      <p><strong>Account:</strong> ${transactionDetails.accountNumber}</p>
      <p><strong>Type:</strong> ${transactionDetails.type}</p>
      <p><strong>Amount:</strong> LKR ${transactionDetails.amount.toFixed(2)}</p>
      <p><strong>Description:</strong> ${transactionDetails.description}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      <p>This is an automated notification. Please do not reply to this email.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Transaction email sent successfully');
  } catch (error) {
    console.error('Error sending transaction email:', error);
  }
}

module.exports = router;