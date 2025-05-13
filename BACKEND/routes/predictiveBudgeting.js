// routes/predictiveBudgeting.js
const express = require('express');
const router = express.Router();
const BudgetPlan = require('../models/budgetPlan');
const Budget = require('../models/budget');
const Item = require('../models/Shoppinglist');

// GET predicted budget based on historical data
router.get('/predict', async (req, res) => {
  try {
    const { months = 3, categoryDetail = true } = req.query;
    
    // Calculate date range for analysis (default: last 3 months)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));
    
    // Get all completed budget plans in the timeframe
    const completedBudgets = await BudgetPlan.find({
      status: 'Completed',
      endDate: { $gte: startDate, $lte: endDate }
    }).sort({ endDate: -1 });
    
    if (completedBudgets.length === 0) {
      return res.status(404).json({
        message: 'Not enough historical data to make predictions',
        recommendation: 'Complete at least one budget cycle to receive predictions'
      });
    }
    
    // Calculate average total budget and spending
    const totalBudgetValues = completedBudgets.map(budget => budget.totalBudget);
    const totalSpentValues = completedBudgets.map(budget => budget.actualSpent);
    
    const avgTotalBudget = calculateAverage(totalBudgetValues);
    const avgTotalSpent = calculateAverage(totalSpentValues);
    
    // Get spending trends (increasing/decreasing)
    const spendingTrend = calculateTrend(completedBudgets.map(b => ({
      date: b.endDate,
      value: b.actualSpent
    })));
    
    // Prepare the prediction results
    const prediction = {
      predictedTotalBudget: roundToTwoDecimals(avgTotalBudget),
      predictedSpending: roundToTwoDecimals(avgTotalSpent),
      confidence: calculateConfidence(totalSpentValues),
      trend: spendingTrend,
      basedOn: {
        months: completedBudgets.length,
        dateRange: {
          from: startDate,
          to: endDate
        }
      },
      recommendation: generateRecommendation(avgTotalBudget, avgTotalSpent, spendingTrend)
    };
    
    // If category detail is requested, add category breakdown
    if (categoryDetail === 'true') {
      prediction.categories = await generateCategoryPredictions(completedBudgets);
    }
    
    res.status(200).json(prediction);
  } catch (error) {
    console.error('Error generating budget prediction:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET predictions for upcoming unusual expenses
router.get('/predict/seasonal', async (req, res) => {
  try {
    const { lookAhead = 2 } = req.query; // How many months to look ahead
    
    // Get the upcoming date range
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + parseInt(lookAhead));
    
    // Get the same period from previous year to analyze seasonal patterns
    const lastYearStart = new Date(startDate);
    lastYearStart.setFullYear(lastYearStart.getFullYear() - 1);
    const lastYearEnd = new Date(endDate);
    lastYearEnd.setFullYear(lastYearEnd.getFullYear() - 1);
    
    // Find budget items from the same period last year
    const lastYearItems = await Budget.find({
      purchasedDate: { $gte: lastYearStart, $lte: lastYearEnd }
    }).sort({ totalPrice: -1 });
    
    // Find exceptional expenses (outliers)
    const regularItems = await getRegularPurchaseItems(6); // Last 6 months of regular items
    const seasonalSuggestions = findSeasonalItems(lastYearItems, regularItems);
    
    res.status(200).json({
      predictedSeasonalExpenses: seasonalSuggestions,
      period: {
        from: startDate,
        to: endDate
      },
      comparisonPeriod: {
        from: lastYearStart,
        to: lastYearEnd
      }
    });
  } catch (error) {
    console.error('Error predicting seasonal expenses:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST generate a suggested budget plan
router.post('/generate-plan', async (req, res) => {
  try {
    const { startDate, endDate, name, adjustmentFactor = 1.0 } = req.body;
    
    if (!startDate || !endDate || !name) {
      return res.status(400).json({ message: 'Start date, end date, and name are required' });
    }
    
    // Get predicted budget
    const months = 3; // Use last 3 months for prediction
    const predictedBudget = await generatePredictedBudget(months);
    
    if (!predictedBudget) {
      return res.status(404).json({ 
        message: 'Not enough historical data to generate a budget plan',
        recommendation: 'Complete at least one budget cycle first'
      });
    }
    
    // Apply adjustment factor
    const totalBudget = roundToTwoDecimals(predictedBudget.totalBudget * parseFloat(adjustmentFactor));
    
    // Adjust category budgets by the same factor
    const categoryBudgets = predictedBudget.categories.map(cat => ({
      category: cat.category,
      amount: roundToTwoDecimals(cat.amount * parseFloat(adjustmentFactor))
    }));
    
    // Create new budget plan
    const newBudgetPlan = new BudgetPlan({
      name,
      totalBudget,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      categoryBudgets,
      status: 'Active',
      notes: `Auto-generated based on spending history (${months} months). Adjustment factor: ${adjustmentFactor}`
    });
    
    await newBudgetPlan.save();
    
    res.status(201).json({
      message: 'Budget plan generated successfully',
      budgetPlan: newBudgetPlan,
      basedOn: predictedBudget.basedOn
    });
  } catch (error) {
    console.error('Error generating budget plan:', error);
    res.status(500).json({ message: error.message });
  }
});

// Helper function to calculate average of an array of numbers
function calculateAverage(values) {
  if (values.length === 0) return 0;
  const sum = values.reduce((total, val) => total + val, 0);
  return sum / values.length;
}

// Helper function to calculate trend
function calculateTrend(dataPoints) {
  if (dataPoints.length <= 1) return 'stable';
  
  // Sort by date ascending
  dataPoints.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Simple linear regression
  const n = dataPoints.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  
  // Convert dates to numeric values (days since first date)
  const firstDate = new Date(dataPoints[0].date);
  const xValues = dataPoints.map(dp => 
    (new Date(dp.date) - firstDate) / (1000 * 60 * 60 * 24));
  
  for (let i = 0; i < n; i++) {
    sumX += xValues[i];
    sumY += dataPoints[i].value;
    sumXY += xValues[i] * dataPoints[i].value;
    sumXX += xValues[i] * xValues[i];
  }
  
  // Calculate slope of the line
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  
  // Determine trend based on slope
  if (slope > 0.05) return 'increasing';
  if (slope < -0.05) return 'decreasing';
  return 'stable';
}

// Helper function to calculate confidence level based on variance
function calculateConfidence(values) {
  if (values.length <= 1) return 'low';
  
  const avg = calculateAverage(values);
  const squaredDifferences = values.map(v => Math.pow(v - avg, 2));
  const variance = calculateAverage(squaredDifferences);
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = (stdDev / avg) * 100;
  
  // Determine confidence based on coefficient of variation
  if (coefficientOfVariation < 15) return 'high';
  if (coefficientOfVariation < 30) return 'medium';
  return 'low';
}

// Helper function to round to two decimal places
function roundToTwoDecimals(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

// Helper function to generate budget recommendation message
function generateRecommendation(avgBudget, avgSpent, trend) {
  const buffer = 1.1; // 10% buffer
  
  if (avgSpent > avgBudget) {
    return `Your actual spending exceeds your typical budget by ${roundToTwoDecimals(avgSpent - avgBudget)}. Consider increasing your budget to ${roundToTwoDecimals(avgSpent * buffer)} to account for your actual spending patterns.`;
  }
  
  if (trend === 'increasing') {
    return `Your spending is trending upward. Consider setting a budget of ${roundToTwoDecimals(avgSpent * buffer)} to accommodate this trend.`;
  }
  
  if (trend === 'decreasing') {
    return `Your spending is trending downward. You could maintain your budget at ${roundToTwoDecimals(avgBudget)} or slightly reduce it to ${roundToTwoDecimals(avgSpent * buffer)}.`;
  }
  
  return `Based on your spending history, a budget of ${roundToTwoDecimals(avgSpent * buffer)} should be sufficient for your needs.`;
}

// Helper function to generate category-specific predictions
async function generateCategoryPredictions(budgetPlans) {
  try {
    const categoryStats = {};
    
    // Extract all budget plan IDs
    const budgetPlanIds = budgetPlans.map(plan => plan._id);
    
    // Get all shopping list items belonging to these budget plans
    const shoppingItems = await Item.find({
      budgetId: { $in: budgetPlanIds },
      purchased: true,
      actualPrice: { $ne: null }
    });
    
    // Group by category and calculate stats
    shoppingItems.forEach(item => {
      const category = item.category;
      
      if (!categoryStats[category]) {
        categoryStats[category] = {
          totalSpent: 0,
          count: 0,
          values: []
        };
      }
      
      const totalPrice = item.totalActualPrice || (item.actualPrice * item.quantity);
      categoryStats[category].totalSpent += totalPrice;
      categoryStats[category].count += 1;
      categoryStats[category].values.push(totalPrice);
    });
    
    // Convert to array and calculate averages
    return Object.keys(categoryStats).map(category => {
      const stats = categoryStats[category];
      const predictedAmount = stats.totalSpent / budgetPlans.length; // Average per budget cycle
      
      return {
        category,
        predictedAmount: roundToTwoDecimals(predictedAmount),
        itemCount: stats.count,
        confidence: calculateConfidence(stats.values),
        percentage: 0 // Will calculate below
      };
    }).sort((a, b) => b.predictedAmount - a.predictedAmount)
    .map(cat => {
      // Calculate percentage of total
      const total = Object.values(categoryStats)
        .reduce((sum, stat) => sum + stat.totalSpent, 0);
      cat.percentage = roundToTwoDecimals((categoryStats[cat.category].totalSpent / total) * 100);
      return cat;
    });
  } catch (error) {
    console.error('Error generating category predictions:', error);
    return [];
  }
}

// Helper function to get normal purchase patterns
async function getRegularPurchaseItems(months) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  // Get regular purchases from the past months
  const regularItems = await Budget.find({
    purchasedDate: { $gte: startDate }
  });
  
  // Create a frequency map of item names
  const itemFrequency = {};
  regularItems.forEach(item => {
    const itemName = item.itemName;
    itemFrequency[itemName] = (itemFrequency[itemName] || 0) + 1;
  });
  
  return itemFrequency;
}

// Helper function to find seasonal/unusual items
function findSeasonalItems(lastYearItems, regularItemFrequency) {
  const seasonalItems = [];
  
  lastYearItems.forEach(item => {
    const regularFrequency = regularItemFrequency[item.itemName] || 0;
    
    // If this item doesn't appear frequently in regular purchases
    if (regularFrequency <= 1) {
      seasonalItems.push({
        name: item.itemName,
        category: item.category,
        estimatedPrice: item.price,
        lastPurchasedDate: item.purchasedDate,
        confidence: regularFrequency === 0 ? 'high' : 'medium',
        store: item.store
      });
    }
  });
  
  return seasonalItems;
}

// Helper function to generate a predicted budget
async function generatePredictedBudget(months) {
  try {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));
    
    // Get completed budget plans
    const completedBudgets = await BudgetPlan.find({
      status: 'Completed',
      endDate: { $gte: startDate, $lte: endDate }
    });
    
    if (completedBudgets.length === 0) {
      return null;
    }
    
    // Calculate average budget
    const avgTotalBudget = calculateAverage(completedBudgets.map(b => b.actualSpent || b.totalBudget));
    
    // Get category breakdown
    const categoryPredictions = await generateCategoryPredictions(completedBudgets);
    
    return {
      totalBudget: avgTotalBudget,
      categories: categoryPredictions,
      basedOn: {
        months: completedBudgets.length,
        dateRange: {
          from: startDate,
          to: endDate
        }
      }
    };
  } catch (error) {
    console.error('Error generating predicted budget:', error);
    return null;
  }
}

module.exports = router;