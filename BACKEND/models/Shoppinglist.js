// models/shoppinglist.js
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
    enum: ['Groceries', 'Household Essentials', 'Cleaning Supplies', 'Personal Care', 'Other']
  },
  subcategory: {
    type: String,
    // Only required for Groceries category
    validate: {
      validator: function(v) {
        // Subcategory is required only if category is Groceries
        return this.category !== 'Groceries' || (this.category === 'Groceries' && v && v.trim().length > 0);
      },
      message: 'Subcategory is required for Grocery items'
    }
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPrice: {
    type: Number,
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
    validate: {
      validator: function(v) {
        // If expiry date is provided, it should be in the future or today
        return !v || v >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Expiry date cannot be before the current date'
    }
  },
  purchasedDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        // Purchase date should be within 5 days before today or today
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        fiveDaysAgo.setHours(0, 0, 0, 0);
        
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        return v >= fiveDaysAgo && v <= today;
      },
      message: 'Purchase date must be within 5 days before today or today'
    }
  },
  purchasedTime: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Purchase time must be in valid format (HH:MM)']
  },
  store: {
    type: String,
    required: true,
    enum: ['Spar Supermarket', 'Kills', 'ARPICO Super Market', 'Fresh Market', 'Food City', 'Local Shop', 'Other']
  },
}, { timestamps: true });

// Automatically calculate totalPrice before saving
itemSchema.pre('save', function (next) {
  this.totalPrice = this.quantity * this.price;
  
  // Extract subcategory from notes for Groceries if present in notes format
  if (this.category === 'Groceries' && this.notes && !this.subcategory) {
    const colonIndex = this.notes.indexOf(':');
    if (colonIndex > 0) {
      this.subcategory = this.notes.substring(0, colonIndex).trim();
      this.notes = this.notes.substring(colonIndex + 1).trim();
    }
  }
  
  next();
});

// Also apply the totalPrice calculation on update
itemSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.quantity && update.price) {
    update.totalPrice = update.quantity * update.price;
  } else if (update.quantity && !update.price) {
    // Get the original document to use its price
    this.findOne().then(doc => {
      update.totalPrice = update.quantity * doc.price;
      next();
    });
    return;
  } else if (!update.quantity && update.price) {
    // Get the original document to use its quantity
    this.findOne().then(doc => {
      update.totalPrice = doc.quantity * update.price;
      next();
    });
    return;
  }
  next();
});

module.exports = mongoose.model('Item', itemSchema);