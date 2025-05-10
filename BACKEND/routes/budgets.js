const express = require('express');
const router = express.Router();
const Budget = require('../models/budget');
const Item = require('../models/shoppinglist');

// 1. Create or update monthly budget
router.post('/', async (req, res) => {
  const { month, totalBudget } = req.body;
  try {
    const budget = await Budget.findOneAndUpdate(
      { month },
      { totalBudget },
      { upsert: true, new: true }
    );
    res.status(200).json(budget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. Get budget by month
router.get('/:month', async (req, res) => {
  try {
    const budget = await Budget.findOne({ month: req.params.month }).populate('wishlist');
    if (!budget) return res.status(404).json({ error: 'Budget not found' });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Add item to wishlist
router.post('/:month/wishlist', async (req, res) => {
  const { itemId } = req.body;
  try {
    const budget = await Budget.findOne({ month: req.params.month });
    if (!budget) return res.status(404).json({ error: 'Budget not found' });

    budget.wishlist.push(itemId);
    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. Recalculate actual spend
router.post('/:month/recalculate', async (req, res) => {
  const { month } = req.params;
  try {
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const items = await Item.find({
      purchasedDate: { $gte: startDate, $lt: endDate }
    });

    const actualSpend = items.reduce((sum, item) => sum + item.totalPrice, 0);

    const budget = await Budget.findOneAndUpdate(
      { month },
      { actualSpend },
      { new: true }
    );

    res.json({ actualSpend, budget });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Suggest reductions (simple logic)
router.get('/:month/suggestions', async (req, res) => {
  try {
    const month = req.params.month;
    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);

    const items = await Item.find({
      purchasedDate: { $gte: start, $lt: end }
    });

    const overspentItems = items
      .filter(i => i.priority === 'Low')
      .sort((a, b) => b.totalPrice - a.totalPrice)
      .slice(0, 3);

    res.json({ suggestions: overspentItems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;