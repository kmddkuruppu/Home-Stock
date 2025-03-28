const express = require("express");
const router = express.Router();
const Account = require("../models/account");

// Get all accounts
router.get("/", async (req, res) => {
    try {
        const accounts = await Account.find();
        res.status(200).json({ accounts });
    } catch (error) {
        res.status(500).json({ error: "Error fetching accounts", details: error.message });
    }
});

// Get account by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }
        res.status(200).json({ account });
    } catch (error) {
        res.status(500).json({ error: "Error fetching account", details: error.message });
    }
});

// Add a new account
router.post("/add", async (req, res) => {
    try {
        const { accountHolderName, accountBalance, accountType, accountNumber } = req.body;
        const newAccount = new Account({ accountHolderName, accountBalance, accountType, accountNumber });
        await newAccount.save();
        res.status(201).json({ message: "Account added successfully", account: newAccount });
    } catch (error) {
        res.status(500).json({ error: "Error adding account", details: error.message });
    }
});

// Update an account
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { accountHolderName, accountBalance, accountType, accountNumber } = req.body;
        const updatedAccount = await Account.findByIdAndUpdate(id, { accountHolderName, accountBalance, accountType, accountNumber }, { new: true });
        
        if (!updatedAccount) {
            return res.status(404).json({ error: "Account not found" });
        }
        res.status(200).json({ message: "Account updated successfully", account: updatedAccount });
    } catch (error) {
        res.status(500).json({ error: "Error updating account", details: error.message });
    }
});

// Delete an account
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAccount = await Account.findByIdAndDelete(id);
        
        if (!deletedAccount) {
            return res.status(404).json({ error: "Account not found" });
        }
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting account", details: error.message });
    }
});

module.exports = router;
