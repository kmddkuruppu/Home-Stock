const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const Account = require('../models/account');
const Transaction = require('../models/transaction');
const router = express.Router();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Process payment
router.post('/pay', async (req, res) => {
  try {
    const { 
      accountId, 
      accountNumber,
      billType,
      billNumber,
      amount,
      paymentDate,
      status 
    } = req.body;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ message: 'Invalid account ID' });
    }

    if (!accountNumber || !billType || !billNumber || !amount || !paymentDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if account exists
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Create payment record
    const payment = new Payment({
      accountId,
      accountNumber,
      billType,
      billNumber,
      amount,
      paymentDate: new Date(paymentDate),
      status,
      referenceNumber: generateReferenceNumber()
    });

    await payment.save();

    // Generate PDF receipt
    const receiptPath = await generateReceiptPDF(payment);

    // Send email with receipt
    await sendPaymentConfirmationEmail(payment, account.email, receiptPath);

    res.status(201).json({ 
      message: 'Payment processed successfully',
      payment,
      receiptUrl: `/payments/receipt/${payment._id}`
    });

  } catch (err) {
    console.error('Payment processing error:', err);
    res.status(500).json({ 
      message: 'Error processing payment', 
      error: err.message 
    });
  }
});

// Generate and download receipt
router.get('/receipt/:paymentId', async (req, res) => {
  try {
    const paymentId = req.params.paymentId;

    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({ message: 'Invalid payment ID' });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Generate PDF receipt
    const receiptPath = await generateReceiptPDF(payment);

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Payment_Receipt_${payment.referenceNumber}.pdf`);

    // Stream the PDF file
    const fileStream = fs.createReadStream(receiptPath);
    fileStream.pipe(res);

    // Delete the file after streaming
    fileStream.on('end', () => {
      fs.unlink(receiptPath, (err) => {
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

// Helper function to generate reference number
function generateReferenceNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helper function to generate PDF receipt
async function generateReceiptPDF(payment) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const fileName = `receipt_${payment._id}_${Date.now()}.pdf`;
      const filePath = path.join(__dirname, '../temp', fileName);
      
      // Ensure temp directory exists
      if (!fs.existsSync(path.join(__dirname, '../temp'))) {
        fs.mkdirSync(path.join(__dirname, '../temp'));
      }

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Add receipt content
      doc.fontSize(20).text('Payment Receipt', { align: 'center' });
      doc.moveDown();
      
      doc.fontSize(12).text(`Reference Number: ${payment.referenceNumber}`);
      doc.text(`Date: ${payment.paymentDate.toLocaleDateString()}`);
      doc.text(`Time: ${payment.paymentDate.toLocaleTimeString()}`);
      doc.moveDown();
      
      doc.fontSize(14).text('Payment Details', { underline: true });
      doc.moveDown();
      
      doc.text(`Account Number: ${payment.accountNumber}`);
      doc.text(`Bill Type: ${payment.billType}`);
      doc.text(`Bill Number: ${payment.billNumber}`);
      doc.moveDown();
      
      doc.fontSize(16).text(`Amount: LKR ${payment.amount.toFixed(2)}`, { bold: true });
      doc.moveDown();
      
      doc.fontSize(10).text('Thank you for your payment!', { align: 'center' });
      doc.text('This is an official receipt for your records.', { align: 'center' });

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);

    } catch (err) {
      reject(err);
    }
  });
}

// Helper function to send payment confirmation email
async function sendPaymentConfirmationEmail(payment, recipientEmail, receiptPath) {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: recipientEmail,
    subject: `Payment Confirmation - ${payment.referenceNumber}`,
    html: `
      <h2>Payment Confirmation</h2>
      <p>Your payment has been processed successfully.</p>
      <p><strong>Reference Number:</strong> ${payment.referenceNumber}</p>
      <p><strong>Amount:</strong> LKR ${payment.amount.toFixed(2)}</p>
      <p><strong>Bill Type:</strong> ${payment.billType}</p>
      <p><strong>Bill Number:</strong> ${payment.billNumber}</p>
      <p><strong>Date:</strong> ${payment.paymentDate.toLocaleString()}</p>
      <p>You can download your receipt from the application or find it attached to this email.</p>
      <p>Thank you for using our services!</p>
    `,
    attachments: [
      {
        filename: `Payment_Receipt_${payment.referenceNumber}.pdf`,
        path: receiptPath
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Payment confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
  }
}

module.exports = router;