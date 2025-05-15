// routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// Create inventory item
router.post('/', async (req, res) => {
  try {
    // Process subcategory from notes if needed
    const itemData = { ...req.body };
    
    if (itemData.notes && itemData.notes.includes(':')) {
      const colonIndex = itemData.notes.indexOf(':');
      if (colonIndex > 0) {
        itemData.subcategory = itemData.notes.substring(0, colonIndex).trim();
        itemData.notes = itemData.notes.substring(colonIndex + 1).trim();
      }
    }
    
    const newItem = new Inventory(itemData);
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

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const items = await Inventory.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get inventory items by category
router.get('/category/:category', async (req, res) => {
  try {
    const items = await Inventory.find({ category: req.params.category })
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get inventory items by location
router.get('/location/:location', async (req, res) => {
  try {
    const items = await Inventory.find({ location: req.params.location })
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get inventory items by status
router.get('/status/:status', async (req, res) => {
  try {
    const items = await Inventory.find({ status: req.params.status })
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get low stock items
router.get('/low-stock', async (req, res) => {
  try {
    const items = await Inventory.find({ status: 'Low Stock' })
      .sort({ quantity: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get out of stock items
router.get('/out-of-stock', async (req, res) => {
  try {
    const items = await Inventory.find({ status: 'Out of Stock' })
      .sort({ lastRestockDate: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get items by supplier
router.get('/supplier/:supplier', async (req, res) => {
  try {
    const items = await Inventory.find({ supplier: req.params.supplier })
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get expiring items (within next 30 days)
router.get('/expiring', async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);
    
    const items = await Inventory.find({
      expiryDate: { $gte: today, $lte: thirtyDaysLater }
    }).sort({ expiryDate: 1 });
    
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get inventory item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Inventory item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update inventory item
router.put('/:id', async (req, res) => {
  try {
    // Process subcategory from notes if needed
    const itemData = { ...req.body };
    
    if (itemData.notes && itemData.notes.includes(':')) {
      const colonIndex = itemData.notes.indexOf(':');
      if (colonIndex > 0) {
        itemData.subcategory = itemData.notes.substring(0, colonIndex).trim();
        itemData.notes = itemData.notes.substring(colonIndex + 1).trim();
      }
    }
    
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      itemData,
      { new: true, runValidators: true }
    );
    
    if (!updatedItem) return res.status(404).json({ error: 'Inventory item not found' });
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

// Update inventory quantity (for restocking or consumption)
router.patch('/:id/quantity', async (req, res) => {
  try {
    const { adjustment, reason } = req.body;
    
    if (adjustment === undefined) {
      return res.status(400).json({ error: 'Quantity adjustment is required' });
    }
    
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Inventory item not found' });
    
    const newQuantity = item.quantity + adjustment;
    
    if (newQuantity < 0) {
      return res.status(400).json({ error: 'Cannot reduce quantity below zero' });
    }
    
    // If it's a restock, update the lastRestockDate
    const updateData = { quantity: newQuantity };
    if (adjustment > 0) {
      updateData.lastRestockDate = new Date();
    }
    
    // Add the reason to notes if provided
    if (reason) {
      const dateStr = new Date().toISOString().split('T')[0];
      const noteEntry = `[${dateStr}] ${adjustment > 0 ? 'Added' : 'Removed'} ${Math.abs(adjustment)} units. Reason: ${reason}`;
      updateData.notes = item.notes ? `${item.notes}\n${noteEntry}` : noteEntry;
    }
    
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ error: 'Inventory item not found' });
    res.json({ message: 'Inventory item deleted successfully', deletedItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get inventory statistics and summary
router.get('/stats/summary', async (req, res) => {
  try {
    const items = await Inventory.find();
    
    // Calculate statistics
    const totalItems = items.length;
    const totalUnits = items.reduce((total, item) => total + item.quantity, 0);
    const totalValue = items.reduce((total, item) => total + (item.totalValue || 0), 0);
    
    // Count by category
    const categoryCount = {};
    items.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });
    
    // Count by status
    const statusCount = {
      'In Stock': 0,
      'Low Stock': 0,
      'Out of Stock': 0,
      'On Order': 0
    };
    
    items.forEach(item => {
      statusCount[item.status] = (statusCount[item.status] || 0) + 1;
    });
    
    // Count items by location
    const locationCount = {};
    items.forEach(item => {
      locationCount[item.location] = (locationCount[item.location] || 0) + 1;
    });
    
    // Calculate expiring items in next 30 days
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);
    
    const expiringItems = items.filter(item => 
      item.expiryDate && item.expiryDate >= today && item.expiryDate <= thirtyDaysLater
    ).length;
    
    res.json({
      totalItems,
      totalUnits,
      totalValue,
      categoryBreakdown: categoryCount,
      statusBreakdown: statusCount,
      locationBreakdown: locationCount,
      expiringItems
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;