// models/budgetPlan.js
const mongoose = require('mongoose');

const budgetPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  totalBudget: {
    type: Number,
    required: true,
    min: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  categoryBudgets: [{
    category: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  actualSpent: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Archived'],
    default: 'Active'
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('BudgetPlan', budgetPlanSchema);