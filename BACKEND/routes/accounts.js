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
    try {
      // Validate required fields
      if (!transaction) throw new Error('Transaction data is required');
      if (!account) throw new Error('Account data is required');
      
      // Set default values for missing fields
      transaction.status = transaction.status || 'completed';
      transaction.type = transaction.type || 'payment';
      transaction.description = transaction.description || 'Transaction';
      transaction.amount = transaction.amount || 0;
      transaction.timestamp = transaction.timestamp || new Date();
      transaction._id = transaction._id || new mongoose.Types.ObjectId();
      
      account.accountHolder = account.accountHolder || 'Home Stock';
      account.accountNumber = account.accountNumber || '00000000';
      account.accountType = account.accountType || 'Savings';
      account.balance = account.balance || 0;

      const doc = new PDFDocument({ 
        size: 'A5', 
        margin: 30,
        layout: 'portrait',
        info: {
          Title: `Payment Receipt ${transaction._id}`,
          Author: 'YourBank',
          Subject: 'Transaction Receipt'
        }
      });
      
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Color palette
      const primaryColor = '#2c3e50';
      const secondaryColor = '#7f8c8d';
      const accentColor = '#3498db';
      const successColor = '#27ae60';
      const lightBg = '#f8f9fa';
      const borderColor = '#e0e0e0';

      // Fonts setup
      const fontRegular = 'Helvetica';
      const fontBold = 'Helvetica-Bold';
      const fontItalic = 'Helvetica-Oblique';
      
      // Header with gradient background
      doc.rect(0, 0, doc.page.width, 100)
        .fill(primaryColor);

      // Logo and header text
      try {
        doc.image(path.join(__dirname, '../logo.png'), 30, 25, { 
          width: 50,
          align: 'left'
        });
      } catch (e) {
        console.log('Logo not found, using text instead');
        doc.fill('#fff')
          .font(fontBold)
          .fontSize(14)
          .text('YourBank', 30, 40);
      }
      
      doc.fill('#ffffff')
        .font(fontBold)
        .fontSize(18)
        .text('TRANSACTION RECEIPT', 0, 40, {
          align: 'center'
        })
        .font(fontRegular)
        .fontSize(10)
        .text('Official Payment Confirmation', 0, 65, {
          align: 'center'
        });
      
      // Receipt metadata section
      const metaTop = 110;
      doc.fill(primaryColor)
        .font(fontBold)
        .fontSize(10)
        .text('RECEIPT NUMBER:', 30, metaTop)
        .fill(secondaryColor)
        .font(fontRegular)
        .text(transaction._id.toString(), 130, metaTop)
        
        .fill(primaryColor)
        .font(fontBold)
        .text('DATE:', 30, metaTop + 15)
        .fill(secondaryColor)
        .font(fontRegular)
        .text(transaction.timestamp.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }), 130, metaTop + 15)
        
        .fill(primaryColor)
        .font(fontBold)
        .text('STATUS:', 30, metaTop + 30)
        .fill(transaction.status === 'completed' ? successColor : '#e74c3c')
        .font(fontRegular)
        .text((transaction.status || '').toUpperCase(), 130, metaTop + 30);
      
      // Decorative divider
      doc.moveTo(30, metaTop + 50)
        .lineTo(doc.page.width - 30, metaTop + 50)
        .lineWidth(1)
        .dash(2, { space: 2 })
        .stroke(borderColor)
        .undash();

      // Transaction details section
      const detailsTop = metaTop + 70;
      doc.fill(primaryColor)
        .font(fontBold)
        .fontSize(14)
        .text('TRANSACTION DETAILS', 30, detailsTop);
      
      // Details table
      const tableTop = detailsTop + 25;
      const col1 = 40;
      const col2 = 200;
      
      // Table rows with alternating background
      const rows = [
        { label: 'Type', value: (transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)) || 'Payment' },
        { label: 'Reference', value: transaction.referenceNumber || 'N/A' },
        { label: 'Description', value: transaction.description || 'Transaction' },
        { label: 'Method', value: 'Online Banking' }
      ];
      
      rows.forEach((row, i) => {
        const y = tableTop + (i * 20);
        
        // Alternate row background
        if (i % 2 === 0) {
          doc.rect(col1 - 10, y - 5, doc.page.width - 80, 20)
            .fill(lightBg);
        }
        
        doc.fill(secondaryColor)
          .font(fontBold)
          .fontSize(9)
          .text(row.label + ':', col1, y)
          .fill(primaryColor)
          .font(fontRegular)
          .text(row.value, col2, y);
      });

      // Amount highlight section
      const amountTop = tableTop + 100;
      doc.rect(30, amountTop, doc.page.width - 60, 60)
        .fill(lightBg)
        .stroke(borderColor);
      
      doc.fill(secondaryColor)
        .font(fontBold)
        .fontSize(12)
        .text('TOTAL AMOUNT', 50, amountTop + 15);
      
      doc.fill(transaction.type === 'deposit' ? successColor : primaryColor)
        .font(fontBold)
        .fontSize(24)
        .text(`LKR ${(transaction.amount || 0).toFixed(2)}`, 50, amountTop + 35);
      
      // Account information section
      const accountTop = amountTop + 80;
      doc.fill(primaryColor)
        .font(fontBold)
        .fontSize(14)
        .text('ACCOUNT INFORMATION', 30, accountTop);
      
      const accountRows = [
        { label: 'Account Holder', value: account.accountHolder || 'N/A' },
        { label: 'Account Number', value: account.accountNumber || 'N/A' },
        { label: 'Account Type', value: account.accountType || 'N/A' },
        { label: 'Current Balance', value: `LKR ${(account.balance || 0).toFixed(2)}` }
      ];
      
      accountRows.forEach((row, i) => {
        const y = accountTop + 25 + (i * 20);
        
        doc.fill(secondaryColor)
          .font(fontBold)
          .fontSize(9)
          .text(row.label + ':', col1, y)
          .fill(primaryColor)
          .font(fontRegular)
          .text(row.value, col2, y);
      });

      // Footer with watermark effect
      const footerY = doc.page.height - 60;
      
      // Footer content
      doc.moveTo(30, footerY)
        .lineTo(doc.page.width - 30, footerY)
        .lineWidth(0.5)
        .stroke(borderColor);
      
      doc.fill(secondaryColor)
        .font(fontItalic)
        .fontSize(8)
        .text('This is an official receipt. Please retain for your records.', 30, footerY + 10)
        .text('Thank you for banking with us!', 0, footerY + 10, {
          align: 'right'
        })
        .font(fontRegular)
        .text('© ' + new Date().getFullYear() + ' YourBank. All rights reserved.', 30, footerY + 30)
        .text(`Page 1 of 1 • Generated on ${new Date().toLocaleString()}`, 0, footerY + 30, {
          align: 'right'
        });
        
      doc.end();
      
      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);

    } catch (error) {
      console.error('Error in PDF generation:', error);
      reject(error);
    }
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