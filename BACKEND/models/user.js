const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin",],
    },
    isBlocked: { 
      type: Boolean, 
      default: false 
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
