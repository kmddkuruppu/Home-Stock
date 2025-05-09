// models/Item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
    unique: true,
  },
  itemName: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  notes: {
    type: String,
    default: '',
  },
  expiryDate: {
    type: Date,
  },
  purchasedDate: {
    type: Date,
    required: true,
  },
  purchasedTime: {
    type: String,
    required: true,
  },
  store: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
