// routes/budget.js
const express = require('express');
const router = express.Router();
const Budget = require('../models/budget');
const Item = require('../models/Shoppinglist'); // Import shopping list model

// GET all budget items
router.get('/', async (req, res) => {
  try {
    const budgetItems = await Budget.find().sort({ createdAt: -1 });
    res.status(200).json(budgetItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET budget item by ID
router.get('/:id', async (req, res) => {
  try {
    const budgetItem = await Budget.findById(req.params.id);
    if (!budgetItem) {
      return res.status(404).json({ message: 'Budget item not found' });
    }
    res.status(200).json(budgetItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add new budget item (from shopping list)
router.post('/', async (req, res) => {
  try {
    // Validate incoming data
    const requiredFields = ['itemId', 'itemName', 'category', 'price', 'quantity'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    // Format dates if they're strings
    let purchasedDate = req.body.purchasedDate;
    if (typeof purchasedDate === 'string') {
      purchasedDate = new Date(purchasedDate);
    }

    // Create new budget entry
    const budgetItem = new Budget({
      itemId: req.body.itemId,
      itemName: req.body.itemName,
      category: req.body.category,
      price: parseFloat(req.body.price),
      quantity: parseInt(req.body.quantity),
      totalPrice: parseFloat(req.body.totalPrice) || parseFloat(req.body.price) * parseInt(req.body.quantity),
      purchasedDate: purchasedDate,
      purchasedTime: req.body.purchasedTime,
      store: req.body.store || 'Unknown',
      notes: req.body.notes || '',
      priority: req.body.priority || 'Medium',
      paymentMethod: req.body.paymentMethod || 'Cash',
      status: req.body.status || 'Completed'
    });

    // Save the budget item
    const savedItem = await budgetItem.save();
    
    // Return the saved item
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error adding item to budget:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update a budget item
router.put('/:id', async (req, res) => {
  try {
    // If quantity or price is updated, recalculate totalPrice
    if (req.body.quantity || req.body.price) {
      const item = await Budget.findById(req.params.id);
      const quantity = req.body.quantity || item.quantity;
      const price = req.body.price || item.price;
      req.body.totalPrice = quantity * price;
    }

    const updatedItem = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Budget item not found' });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a budget item
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Budget.findByIdAndDelete(req.params.id);
    
    if (!deletedItem) {
      return res.status(404).json({ message: 'Budget item not found' });
    }
    
    res.status(200).json({ message: 'Budget item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET summary statistics by category
router.get('/stats/categories', async (req, res) => {
  try {
    const categoryStats = await Budget.aggregate([
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$totalPrice' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } }
    ]);
    
    res.status(200).json(categoryStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET summary statistics by date range
router.get('/stats/daterange', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the full end date
    
    const dateRangeStats = await Budget.aggregate([
      {
        $match: {
          purchasedDate: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$totalPrice' },
          count: { $sum: 1 },
          avgCost: { $avg: '$totalPrice' }
        }
      }
    ]);
    
    res.status(200).json(dateRangeStats[0] || { totalSpent: 0, count: 0, avgCost: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;