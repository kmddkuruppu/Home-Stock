// models/Inventory.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
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
    enum: ['Raw Materials', 'Finished Products', 'Packaging', 'Equipment', 'Office Supplies', 'Other']
  },
  subcategory: {
    type: String,
    // Optional categorization
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    required: true,
    enum: ['pcs', 'kg', 'g', 'l', 'ml', 'box', 'carton', 'pack', 'other']
  },
  unitCost: {
    type: Number,
    required: true,
    min: 0,
  },
  totalValue: {
    type: Number,
    min: 0,
  },
  location: {
    type: String,
    required: true,
    enum: ['Warehouse A', 'Warehouse B', 'Production Floor', 'Store Room', 'Office', 'Other']
  },
  minStockLevel: {
    type: Number,
    required: true,
    min: 0,
    default: 5
  },
  status: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Out of Stock', 'On Order'],
    default: 'In Stock'
  },
  supplier: {
    type: String,
    default: '',
  },
  lastRestockDate: {
    type: Date,
    default: Date.now
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
  notes: {
    type: String,
    default: '',
  },
}, { timestamps: true });

// Automatically calculate totalValue before saving
inventorySchema.pre('save', function (next) {
  this.totalValue = this.quantity * this.unitCost;
  
  // Automatically set status based on quantity and minStockLevel
  if (this.quantity <= 0) {
    this.status = 'Out of Stock';
  } else if (this.quantity <= this.minStockLevel) {
    this.status = 'Low Stock';
  } else {
    this.status = 'In Stock';
  }
  
  next();
});

// Also apply the calculations on update
inventorySchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  
  // Calculate totalValue if quantity or unitCost changes
  if (update.quantity !== undefined || update.unitCost !== undefined) {
    this.findOne().then(doc => {
      const newQuantity = update.quantity !== undefined ? update.quantity : doc.quantity;
      const newUnitCost = update.unitCost !== undefined ? update.unitCost : doc.unitCost;
      
      update.totalValue = newQuantity * newUnitCost;
      
      // Update status based on new quantity
      if (newQuantity <= 0) {
        update.status = 'Out of Stock';
      } else if (newQuantity <= doc.minStockLevel) {
        update.status = 'Low Stock';
      } else {
        update.status = 'In Stock';
      }
      
      next();
    });
    return;
  }
  
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);