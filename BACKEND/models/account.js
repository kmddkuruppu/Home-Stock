const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for account
const accountSchema = new Schema({
    accountHolderName: {
        type: String,
        required: true
    },
    accountBalance: {
        type: Number,
        required: true
    },
    accountType: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    }
});

// Create the Account model
const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
