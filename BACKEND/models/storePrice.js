const mongoose = require('mongoose');

const storePriceSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  store: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  priceDate: {
    type: Date,
    default: Date.now
  },
  unit: {
    type: String,
    default: 'item'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  reportCount: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

// Create compound index for efficient querying
storePriceSchema.index({ itemName: 1, store: 1, priceDate: -1 });

module.exports = mongoose.model('StorePrice', storePriceSchema);