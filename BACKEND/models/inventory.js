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

// Fix for the update middleware
inventorySchema.pre('findOneAndUpdate', async function(next) {
  try {
    const update = this.getUpdate();
    const doc = await this.model.findOne(this.getQuery());
    
    if (!doc) {
      return next();
    }
    
    // Only calculate totalValue and status if quantity or unitCost is changing
    if (update.quantity !== undefined || update.unitCost !== undefined) {
      const newQuantity = update.quantity !== undefined ? update.quantity : doc.quantity;
      const newUnitCost = update.unitCost !== undefined ? update.unitCost : doc.unitCost;
      
      // Calculate and set the new totalValue
      update.totalValue = newQuantity * newUnitCost;
      
      // Don't override 'On Order' status manually set by the user
      if (update.status !== 'On Order') {
        // Set the status based on the new quantity
        if (newQuantity <= 0) {
          update.status = 'Out of Stock';
        } else if (newQuantity <= doc.minStockLevel) {
          update.status = 'Low Stock';
        } else {
          update.status = 'In Stock';
        }
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Add a hook for findByIdAndUpdate as well to ensure it works with both methods
inventorySchema.pre('findByIdAndUpdate', async function(next) {
  try {
    const update = this.getUpdate();
    const doc = await this.model.findOne(this.getQuery());
    
    if (!doc) {
      return next();
    }
    
    // Only calculate totalValue and status if quantity or unitCost is changing
    if (update.quantity !== undefined || update.unitCost !== undefined) {
      const newQuantity = update.quantity !== undefined ? update.quantity : doc.quantity;
      const newUnitCost = update.unitCost !== undefined ? update.unitCost : doc.unitCost;
      
      // Calculate and set the new totalValue
      update.totalValue = newQuantity * newUnitCost;
      
      // Don't override 'On Order' status manually set by the user
      if (update.status !== 'On Order') {
        // Set the status based on the new quantity
        if (newQuantity <= 0) {
          update.status = 'Out of Stock';
        } else if (newQuantity <= doc.minStockLevel) {
          update.status = 'Low Stock';
        } else {
          update.status = 'In Stock';
        }
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Inventory', inventorySchema);