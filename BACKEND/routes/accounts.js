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
    const doc = new PDFDocument({ size: 'A5', margin: 30 });
    const stream = fs.createWriteStream(filePath);
    
    doc.pipe(stream);

    // Colors
    const primaryColor = '#3498db';
    const secondaryColor = '#7f8c8d';
    const accentColor = '#2ecc71';
    const darkColor = '#2c3e50';

    // Header with logo and company info
    doc.image(path.join(__dirname, '../logo.png'), 30, 25, { width: 60 })
       .fillColor(darkColor)
       .font('Helvetica-Bold')
       .fontSize(18)
       .text('PAYMENT RECEIPT', 110, 30, { align: 'left' })
       .font('Helvetica')
       .fontSize(10)
       .text('123 Financial Street', 110, 55, { align: 'left' })
       .text('Banking City, 10001', 110, 70, { align: 'left' })
       .text('Tel: (123) 456-7890', 110, 85, { align: 'left' })
       .moveDown(2);

    // Receipt metadata
    doc.font('Helvetica-Bold')
       .fillColor(secondaryColor)
       .fontSize(10)
       .text('RECEIPT #:', { continued: true })
       .fillColor(darkColor)
       .text(` ${transaction._id}`)
       .fillColor(secondaryColor)
       .text('DATE:', { continued: true })
       .fillColor(darkColor)
       .text(` ${transaction.timestamp.toLocaleDateString()}`, { align: 'right' })
       .moveDown(0.5);

    // Divider line
    doc.strokeColor('#e0e0e0')
       .lineWidth(1)
       .moveTo(30, 150)
       .lineTo(400, 150)
       .stroke()
       .moveDown(1);

    // Transaction details header
    doc.font('Helvetica-Bold')
       .fillColor(primaryColor)
       .fontSize(14)
       .text('TRANSACTION DETAILS', { underline: false })
       .moveDown(0.5);

    // Transaction details table
    const detailsTop = 180;
    const col1 = 50;
    const col2 = 200;

    doc.font('Helvetica')
       .fillColor(secondaryColor)
       .fontSize(10)
       .text('Transaction Type:', col1, detailsTop)
       .fillColor(darkColor)
       .text(transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1), col2, detailsTop)
       
       .fillColor(secondaryColor)
       .text('Reference Number:', col1, detailsTop + 20)
       .fillColor(darkColor)
       .text(transaction.referenceNumber, col2, detailsTop + 20)
       
       .fillColor(secondaryColor)
       .text('Status:', col1, detailsTop + 40)
       .fillColor(darkColor)
       .text(transaction.status, col2, detailsTop + 40)
       
       .fillColor(secondaryColor)
       .text('Description:', col1, detailsTop + 60)
       .fillColor(darkColor)
       .text(transaction.description, col2, detailsTop + 60)
       .moveDown(3);

    // Amount section with highlight
    doc.rect(30, 300, doc.page.width - 60, 60)
       .fill('#f8f9fa')
       .stroke('#e0e0e0');
    
    doc.font('Helvetica-Bold')
       .fillColor(secondaryColor)
       .fontSize(12)
       .text('TOTAL AMOUNT', 50, 315);
    
    doc.font('Helvetica-Bold')
       .fillColor(accentColor)
       .fontSize(24)
       .text(`LKR ${transaction.amount.toFixed(2)}`, 50, 335);
    
    doc.moveDown(2);

    // Account details
    doc.font('Helvetica-Bold')
       .fillColor(primaryColor)
       .fontSize(14)
       .text('ACCOUNT INFORMATION', { underline: false })
       .moveDown(0.5);

    const accountTop = 400;
    
    doc.font('Helvetica')
       .fillColor(secondaryColor)
       .fontSize(10)
       .text('Account Holder:', col1, accountTop)
       .fillColor(darkColor)
       .text(account.accountHolder, col2, accountTop)
       
       .fillColor(secondaryColor)
       .text('Account Number:', col1, accountTop + 20)
       .fillColor(darkColor)
       .text(account.accountNumber, col2, accountTop + 20)
       
       .fillColor(secondaryColor)
       .text('Account Type:', col1, accountTop + 40)
       .fillColor(darkColor)
       .text(account.accountType, col2, accountTop + 40)
       .moveDown(3);

    // Footer
    doc.font('Helvetica-Oblique')
       .fillColor(secondaryColor)
       .fontSize(8)
       .text('This is an official receipt. Please retain for your records.', { align: 'center' })
       .moveDown(0.5)
       .text('Thank you for banking with us!', { align: 'center' });

    // Add decorative elements
    doc.strokeColor('#e0e0e0')
       .lineWidth(1)
       .moveTo(30, doc.page.height - 30)
       .lineTo(doc.page.width - 30, doc.page.height - 30)
       .stroke();

    doc.font('Helvetica')
       .fillColor(secondaryColor)
       .fontSize(8)
       .text('© 2023 Online Bank. All rights reserved.', 30, doc.page.height - 20, {
         align: 'left'
       })
       .text('Page 1 of 1', 0, doc.page.height - 20, {
         align: 'right'
       });

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