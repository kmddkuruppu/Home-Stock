// models/budget.js
const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
    ref: 'Item'  // Reference to the Item model
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
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
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
  notes: {
    type: String,
    default: '',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  budgetCategory: {
    type: String,
    default: 'Shopping',
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'Mobile Payment', 'Other'],
    default: 'Cash',
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Archived'],
    default: 'Completed',
  }
}, { timestamps: true });

// Pre-save hook to ensure totalPrice calculation is correct
budgetSchema.pre('save', function (next) {
  // Make sure totalPrice is calculated properly
  if (!this.totalPrice || this.totalPrice !== this.price * this.quantity) {
    this.totalPrice = this.price * this.quantity;
  }
  next();
});

module.exports = mongoose.model('Budget', budgetSchema);