const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  month: {
    type: String, // e.g., "2025-05"
    required: true,
    unique: true,
  },
  totalBudget: {
    type: Number,
    required: true,
    min: 0,
  },
  actualSpend: {
    type: Number,
    default: 0,
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
  }],
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);
