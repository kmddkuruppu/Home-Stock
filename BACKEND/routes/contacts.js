const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

// Submit contact form
router.post('/add', async (req, res) => {
  try {
    const { fullName, email, message } = req.body;

    const newContact = new Contact({
      fullName,
      email,
      message
    });

    const savedContact = await newContact.save();
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: savedContact
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;