const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountHolder: {
    type: String,
    required: true
  },
  balance: {
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

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
