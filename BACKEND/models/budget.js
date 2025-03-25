const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ExpenseSchema = new Schema({
    amount:Number,
    category:String,
    description:String,
    date:String,
});

const model = mongoose.model('expense',ExpenseSchema);
module.exports = model; 