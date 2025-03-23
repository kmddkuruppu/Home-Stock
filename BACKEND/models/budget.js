const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for budgets
const budgetSchema = new Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    category: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    pricePerUnit: {
        type: Number,
        required: true,
        min: 0
    },
    totalCost: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["Cash", "Card", "Online", "Other"] // Restrict to specific payment methods
    }
});

// Pre-save middleware to automatically calculate totalCost
budgetSchema.pre("save", function(next) {
    this.totalCost = this.quantity * this.pricePerUnit;
    next();
});

// Create the Budget model
const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;
