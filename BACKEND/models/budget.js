const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for budget
const budgetSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// Create the Budget model
const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;
