// routes/budgetComparison.js
const express = require('express');
const router = express.Router();
const Item = require('../models/shoppinglist');
const Budget = require('../models/budget');
const BudgetPlan = require('../models/budgetPlan');

// GET budget vs actual comparison for a specific budget plan
router.get('/plan/:budgetPlanId', async (req, res) => {
  try {
    const { budgetPlanId } = req.params;
    
    // Get the budget plan
    const budgetPlan = await BudgetPlan.findById(budgetPlanId);
    if (!budgetPlan) {
      return res.status(404).json({ message: 'Budget plan not found' });
    }
    
    // Get all items associated with this budget plan
    const items = await Item.find({ budgetId: budgetPlanId });
    
    // Calculate totals
    const estimatedTotal = items.reduce((sum, item) => sum + item.totalEstimatedPrice, 0);
    
    // Filter items that have been purchased (have actual prices)
    const purchasedItems = items.filter(item => item.purchased && item.actualPrice !== null);
    const actualTotal = purchasedItems.reduce((sum, item) => sum + item.totalActualPrice, 0);
    
    // Calculate difference
    const difference = estimatedTotal - actualTotal;
    const percentageDifference = estimatedTotal > 0 ? (difference / estimatedTotal) * 100 : 0;
    
    // Category breakdown
    const categoryComparison = await generateCategoryComparison(items);
    
    res.status(200).json({
      budgetPlan: {
        id: budgetPlan._id,
        name: budgetPlan.name,
        totalBudget: budgetPlan.totalBudget,
        dateRange: {
          start: budgetPlan.startDate,
          end: budgetPlan.endDate
        }
      },
      comparison: {
        estimated: estimatedTotal,
        actual: actualTotal,
        difference: difference,
        percentageDifference: percentageDifference.toFixed(2)
      },
      categories: categoryComparison,
      itemsCount: {
        total: items.length,
        purchased: purchasedItems.length,
        remaining: items.length - purchasedItems.length
      }
    });
  } catch (error) {
    console.error('Error fetching budget comparison:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update actual price for an item
router.put('/item/:itemId/actual-price', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { actualPrice, actualPurchaseDate, store } = req.body;
    
    if (actualPrice === undefined) {
      return res.status(400).json({ message: 'Actual price is required' });
    }
    
    // Find and update the item
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    item.actualPrice = parseFloat(actualPrice);
    item.totalActualPrice = item.actualPrice * item.quantity;
    item.purchased = true;
    
    if (actualPurchaseDate) {
      item.actualPurchaseDate = new Date(actualPurchaseDate);
    } else {
      item.actualPurchaseDate = new Date();
    }
    
    if (store) {
      item.store = store;
    }
    
    await item.save();
    
    // Update the overall budget plan total if this item is part of a budget plan
    if (item.budgetId) {
      await updateBudgetPlanTotal(item.budgetId);
    }
    
    res.status(200).json({
      message: 'Actual price updated successfully',
      item: item
    });
  } catch (error) {
    console.error('Error updating actual price:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET comparison trends over time
router.get('/trends', async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'month' } = req.query;
    
    // Validate date range
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    // Find all budget plans within the date range
    const budgetPlans = await BudgetPlan.find({
      $or: [
        { startDate: { $gte: start, $lte: end } },
        { endDate: { $gte: start, $lte: end } }
      ]
    }).sort({ startDate: 1 });
    
    const trends = [];
    
    for (const plan of budgetPlans) {
      // Get items for this budget plan
      const items = await Item.find({ budgetId: plan._id });
      
      const estimatedTotal = items.reduce((sum, item) => sum + item.totalEstimatedPrice, 0);
      const purchasedItems = items.filter(item => item.purchased && item.actualPrice !== null);
      const actualTotal = purchasedItems.reduce((sum, item) => sum + item.totalActualPrice, 0);
      
      trends.push({
        period: formatDateByGrouping(plan.startDate, groupBy),
        planName: plan.name,
        planned: plan.totalBudget,
        estimated: estimatedTotal,
        actual: actualTotal,
        difference: estimatedTotal - actualTotal,
        percentageDifference: estimatedTotal > 0 ? ((estimatedTotal - actualTotal) / estimatedTotal * 100).toFixed(2) : 0
      });
    }
    
    res.status(200).json(trends);
  } catch (error) {
    console.error('Error fetching comparison trends:', error);
    res.status(500).json({ message: error.message });
  }
});

// Helper function to generate category comparison
async function generateCategoryComparison(items) {
  const categoryMap = {};
  
  // Group items by category
  items.forEach(item => {
    const category = item.category;
    
    if (!categoryMap[category]) {
      categoryMap[category] = {
        estimated: 0,
        actual: 0,
        purchased: 0,
        total: 0
      };
    }
    
    categoryMap[category].estimated += item.totalEstimatedPrice;
    categoryMap[category].total += 1;
    
    if (item.purchased && item.actualPrice !== null) {
      categoryMap[category].actual += item.totalActualPrice;
      categoryMap[category].purchased += 1;
    }
  });
  
  // Convert map to array and calculate differences
  return Object.keys(categoryMap).map(category => {
    const data = categoryMap[category];
    return {
      category,
      estimated: data.estimated,
      actual: data.actual,
      difference: data.estimated - data.actual,
      percentageDifference: data.estimated > 0 ? ((data.estimated - data.actual) / data.estimated * 100).toFixed(2) : 0,
      completionRate: data.total > 0 ? (data.purchased / data.total * 100).toFixed(2) : 0
    };
  });
}

// Helper function to update budget plan's actual spent amount
async function updateBudgetPlanTotal(budgetPlanId) {
  try {
    const items = await Item.find({ 
      budgetId: budgetPlanId,
      purchased: true,
      actualPrice: { $ne: null }
    });
    
    const actualTotal = items.reduce((sum, item) => sum + item.totalActualPrice, 0);
    
    await BudgetPlan.findByIdAndUpdate(budgetPlanId, { actualSpent: actualTotal });
  } catch (error) {
    console.error('Error updating budget plan total:', error);
  }
}

// Helper function to format date by grouping
function formatDateByGrouping(date, groupBy) {
  const d = new Date(date);
  
  switch (groupBy.toLowerCase()) {
    case 'day':
      return d.toISOString().split('T')[0];
    case 'week':
      const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
      const pastDaysOfYear = (d - firstDayOfYear) / 86400000;
      const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
      return `${d.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
    case 'month':
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    case 'quarter':
      const quarter = Math.floor(d.getMonth() / 3) + 1;
      return `${d.getFullYear()}-Q${quarter}`;
    case 'year':
      return d.getFullYear().toString();
    default:
      return d.toISOString().split('T')[0];
  }
}

module.exports = router;