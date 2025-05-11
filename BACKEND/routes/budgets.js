const express = require("express");
const router = express.Router();
const Expense = require("../models/budget");
const { ObjectId } = require("mongodb");

// Get all expenses
router.get("/", async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.status(200).json({ expenses });
    } catch (error) {
        res.status(500).json({ error: "Error fetching expenses", details: error.message });
    }
});

// Add a new expense
router.post("/add", async (req, res) => {
    try {
        console.log(req.body); // Log the incoming request body
        const { amount, category, description, date } = req.body;
        const newExpense = new Expense({ amount, category, description, date });
        await newExpense.save();
        res.status(201).json({ message: "Expense added successfully", expense: newExpense });
    } catch (error) {
        res.status(500).json({ error: "Error adding expense", details: error.message });
    }
});

// Update an expense
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, category, description, date } = req.body;
        const updatedExpense = await Expense.findByIdAndUpdate(id, { amount, category, description, date }, { new: true });
        
        if (!updatedExpense) {
            return res.status(404).json({ error: "Expense not found" });
        }
        res.status(200).json({ message: "Expense updated successfully", expense: updatedExpense });
    } catch (error) {
        res.status(500).json({ error: "Error updating expense", details: error.message });
    }
});

// Delete an expense
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedExpense = await Expense.findByIdAndDelete(id);
        
        if (!deletedExpense) {
            return res.status(404).json({ error: "Expense not found" });
        }
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting expense", details: error.message });
    }
});

module.exports = router;
