// routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const Item = require('../models/Shoppinglist');

// Create item
router.post('/', async (req, res) => {
  try {
    // Process Groceries subcategory from notes if needed
    const itemData = { ...req.body };
    
    if (itemData.category === 'Groceries' && itemData.notes && itemData.notes.includes(':')) {
      const colonIndex = itemData.notes.indexOf(':');
      if (colonIndex > 0) {
        itemData.subcategory = itemData.notes.substring(0, colonIndex).trim();
        itemData.notes = itemData.notes.substring(colonIndex + 1).trim();
      }
    }
    
    const newItem = new Item(itemData);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: Object.values(err.errors).map(val => val.message).join(', ')
      });
    }
    res.status(500).json({ error: err.message });
  }
});

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ purchasedDate: -1, purchasedTime: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get items by category
router.get('/category/:category', async (req, res) => {
  try {
    const items = await Item.find({ category: req.params.category })
      .sort({ purchasedDate: -1, purchasedTime: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get items by store
router.get('/store/:store', async (req, res) => {
  try {
    const items = await Item.find({ store: req.params.store })
      .sort({ purchasedDate: -1, purchasedTime: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update item
router.put('/:id', async (req, res) => {
  try {
    // Process Groceries subcategory from notes if needed
    const itemData = { ...req.body };
    
    if (itemData.category === 'Groceries' && itemData.notes && itemData.notes.includes(':')) {
      const colonIndex = itemData.notes.indexOf(':');
      if (colonIndex > 0) {
        itemData.subcategory = itemData.notes.substring(0, colonIndex).trim();
        itemData.notes = itemData.notes.substring(colonIndex + 1).trim();
      }
    }
    
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      itemData,
      { new: true, runValidators: true }
    );
    
    if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
    res.json(updatedItem);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: Object.values(err.errors).map(val => val.message).join(', ')
      });
    }
    res.status(400).json({ error: err.message });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted successfully', deletedItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const items = await Item.find();
    
    // Calculate statistics
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const totalSpending = items.reduce((total, item) => total + (item.price * item.quantity || 0), 0);
    
    // Find most purchased category
    const categoryCount = {};
    items.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + item.quantity;
    });
    
    let mostPurchasedCategory = { name: 'None', count: 0 };
    for (const [category, count] of Object.entries(categoryCount)) {
      if (count > mostPurchasedCategory.count) {
        mostPurchasedCategory = { name: category, count };
      }
    }
    
    // Find most visited store
    const storeCount = {};
    items.forEach(item => {
      storeCount[item.store] = (storeCount[item.store] || 0) + 1;
    });
    
    let mostVisitedStore = { name: 'None', count: 0 };
    for (const [store, count] of Object.entries(storeCount)) {
      if (count > mostVisitedStore.count) {
        mostVisitedStore = { name: store, count };
      }
    }
    
    res.json({
      totalItems,
      totalSpending,
      mostPurchasedCategory: mostPurchasedCategory.name,
      mostVisitedStore: mostVisitedStore.name
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;