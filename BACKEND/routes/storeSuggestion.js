// routes/storeSuggestion.js
const express = require('express');
const router = express.Router();
const StorePrice = require('../models/storePrice');
const Item = require('../models/shoppinglist');

// POST - Add a new price entry for a store
router.post('/prices', async (req, res) => {
  try {
    const { itemName, category, store, price, unit, userId } = req.body;
    
    // Validate required fields
    if (!itemName || !category || !store || price === undefined) {
      return res.status(400).json({ message: 'Item name, category, store, and price are required' });
    }
    
    // Check if a similar price entry already exists
    const existingEntry = await StorePrice.findOne({
      itemName: { $regex: new RegExp(`^${itemName}$`, 'i') }, // Case-insensitive match
      store: store,
      priceDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Within the last 30 days
    });
    
    if (existingEntry) {
      // Update the existing entry instead
      existingEntry.price = price;
      existingEntry.reportCount += 1;
      // If reported multiple times, mark as verified
      if (existingEntry.reportCount >= 3) {
        existingEntry.isVerified = true;
      }
      await existingEntry.save();
      
      return res.status(200).json({
        message: 'Price updated and report count increased',
        storePrice: existingEntry
      });
    }
    
    // Create new store price entry
    const newStorePrice = new StorePrice({
      itemName,
      category,
      store,
      price: parseFloat(price),
      unit: unit || 'item',
      userId: userId || null,
      priceDate: new Date()
    });
    
    await newStorePrice.save();
    
    res.status(201).json({
      message: 'Store price added successfully',
      storePrice: newStorePrice
    });
  } catch (error) {
    console.error('Error adding store price:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET - Find cheapest store for a specific item
router.get('/cheapest/:itemName', async (req, res) => {
  try {
    const { itemName } = req.params;
    const { maxDays = 90 } = req.query; // Default to 90 days of price history
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(maxDays));
    
    // Find all price entries for this item across different stores
    const priceEntries = await StorePrice.find({
      itemName: { $regex: new RegExp(itemName, 'i') },
      priceDate: { $gte: cutoffDate }
    }).sort({ price: 1, priceDate: -1 });
    
    if (priceEntries.length === 0) {
      return res.status(404).json({ message: 'No price data found for this item' });
    }
    
    // Group by store and find the cheapest recent price for each
    const storeMap = {};
    priceEntries.forEach(entry => {
      if (!storeMap[entry.store] || entry.price < storeMap[entry.store].price) {
        storeMap[entry.store] = {
          price: entry.price,
          date: entry.priceDate,
          unit: entry.unit,
          isVerified: entry.isVerified,
          reportCount: entry.reportCount
        };
      }
    });
    
    // Convert to array and sort by price
    const storeComparison = Object.keys(storeMap).map(store => ({
      store,
      ...storeMap[store]
    })).sort((a, b) => a.price - b.price);
    
    res.status(200).json({
      itemName,
      cheapestStore: storeComparison[0],
      allStores: storeComparison,
      savings: storeComparison.length > 1 ? {
        amount: (storeComparison[storeComparison.length - 1].price - storeComparison[0].price).toFixed(2),
        percentage: ((storeComparison[storeComparison.length - 1].price - storeComparison[0].price) / 
                   storeComparison[storeComparison.length - 1].price * 100).toFixed(2)
      } : null
    });
  } catch (error) {
    console.error('Error finding cheapest store:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET - Find best stores for an entire shopping list
router.get('/optimal-stores/:budgetPlanId', async (req, res) => {
  try {
    const { budgetPlanId } = req.params;
    const { maxDays = 90, maxStores = 3 } = req.query;
    
    // Get all items in the shopping list for this budget plan
    const shoppingItems = await Item.find({ budgetId: budgetPlanId });
    
    if (shoppingItems.length === 0) {
      return res.status(404).json({ message: 'No items found in this shopping list' });
    }
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(maxDays));
    
    // Store analysis data structure
    const storeAnalysis = {};
    const itemsWithPrices = [];
    const itemsWithoutPrices = [];
    
    // Process each item in the shopping list
    for (const item of shoppingItems) {
      // Find prices for this item across all stores
      const prices = await StorePrice.find({
        itemName: { $regex: new RegExp(item.name, 'i') },
        priceDate: { $gte: cutoffDate }
      }).sort({ price: 1 });
      
      if (prices.length === 0) {
        itemsWithoutPrices.push({
          id: item._id,
          name: item.name,
          estimatedPrice: item.estimatedPrice,
          quantity: item.quantity
        });
        continue;
      }
      
      // Record price data for this item
      itemsWithPrices.push({
        id: item._id,
        name: item.name,
        estimatedPrice: item.estimatedPrice,
        quantity: item.quantity,
        prices: prices.map(p => ({
          store: p.store,
          price: p.price,
          totalPrice: p.price * item.quantity
        }))
      });
      
      // Update store analysis
      prices.forEach(price => {
        if (!storeAnalysis[price.store]) {
          storeAnalysis[price.store] = {
            itemsFound: 0,
            totalCost: 0,
            itemsCovered: []
          };
        }
        
        // Only count each item once per store - use the cheapest price
        if (!storeAnalysis[price.store].itemsCovered.includes(item._id.toString())) {
          storeAnalysis[price.store].itemsFound += 1;
          storeAnalysis[price.store].totalCost += price.price * item.quantity;
          storeAnalysis[price.store].itemsCovered.push(item._id.toString());
        }
      });
    }
    
    // Convert to array and calculate coverage
    const totalItems = shoppingItems.length;
    const storeRankings = Object.keys(storeAnalysis).map(store => ({
      store,
      itemsFound: storeAnalysis[store].itemsFound,
      totalCost: storeAnalysis[store].totalCost,
      coverage: (storeAnalysis[store].itemsFound / totalItems * 100).toFixed(2),
      averageCostPerItem: storeAnalysis[store].itemsFound > 0 
        ? (storeAnalysis[store].totalCost / storeAnalysis[store].itemsFound).toFixed(2)
        : 0
    }));
    
    // Sort by coverage first, then by total cost
    storeRankings.sort((a, b) => {
      if (b.coverage === a.coverage) {
        return a.totalCost - b.totalCost;
      }
      return b.coverage - a.coverage;
    });
    
    // Find optimal store combination (greedy algorithm)
    const optimalCombination = findOptimalStoreCombination(
      storeRankings, 
      itemsWithPrices, 
      parseInt(maxStores)
    );
    
    res.status(200).json({
      shoppingListSummary: {
        totalItems: totalItems,
        itemsWithPriceData: itemsWithPrices.length,
        itemsWithoutPriceData: itemsWithoutPrices.length
      },
      optimalStoreVisit: optimalCombination.length === 1 
        ? { 
            type: 'single',
            store: optimalCombination[0].store,
            coverage: optimalCombination[0].coverage,
            totalCost: optimalCombination[0].totalCost
          }
        : {
            type: 'multiple',
            storeCount: optimalCombination.length,
            stores: optimalCombination,
            totalCoverage: calculateTotalCoverage(optimalCombination, itemsWithPrices),
            totalCost: optimalCombination.reduce((sum, store) => sum + store.totalCost, 0)
          },
      allStores: storeRankings.slice(0, 10), // Return top 10 stores
      itemsWithoutPrices: itemsWithoutPrices
    });
  } catch (error) {
    console.error('Error finding optimal stores:', error);
    res.status(500).json({ message: error.message });
  }
});

// Calculate total coverage from multiple stores
function calculateTotalCoverage(stores, items) {
  const coveredItems = new Set();
  
  // Count unique items covered across all stores
  stores.forEach(store => {
    const itemsInStore = store.items.map(item => item.id);
    itemsInStore.forEach(id => coveredItems.add(id));
  });
  
  return ((coveredItems.size / items.length) * 100).toFixed(2);
}

// Helper function to find optimal store combination
function findOptimalStoreCombination(storeRankings, items, maxStores) {
  // If we have only one store or max is 1, return the best store
  if (storeRankings.length <= 1 || maxStores === 1) {
    return storeRankings.slice(0, 1);
  }
  
  // Create a map of items to their best prices at each store
  const itemPriceMap = {};
  items.forEach(item => {
    itemPriceMap[item.id] = {};
    item.prices.forEach(price => {
      if (!itemPriceMap[item.id][price.store] || 
          price.price < itemPriceMap[item.id][price.store]) {
        itemPriceMap[item.id][price.store] = {
          price: price.price,
          totalPrice: price.totalPrice
        };
      }
    });
  });
  
  // Initialize with the best coverage store
  const selectedStores = [storeRankings[0]];
  const coveredItems = new Set(
    items
      .filter(item => item.prices.some(p => p.store === storeRankings[0].store))
      .map(item => item.id)
  );
  
  // Greedy approach: Add stores that cover the most remaining items
  while (selectedStores.length < maxStores && 
         selectedStores.length < storeRankings.length && 
         coveredItems.size < items.length) {
    
    let bestNextStore = null;
    let bestAdditionalCoverage = 0;
    let bestAdditionalCost = Infinity;
    
    // Find store that adds most new items (or lowest cost if tied)
    for (const store of storeRankings) {
      // Skip already selected stores
      if (selectedStores.some(s => s.store === store.store)) {
        continue;
      }
      
      // Count additional items this store would cover
      let additionalItems = 0;
      let additionalCost = 0;
      
      items.forEach(item => {
        if (!coveredItems.has(item.id)) {
          const storeHasItem = item.prices.some(p => p.store === store.store);
          if (storeHasItem) {
            additionalItems++;
            // Get the price at this store
            const priceInfo = itemPriceMap[item.id][store.store];
            if (priceInfo) {
              additionalCost += priceInfo.totalPrice;
            }
          }
        }
      });
      
      // If this store adds more coverage or same coverage with less cost
      if (additionalItems > bestAdditionalCoverage || 
          (additionalItems === bestAdditionalCoverage && additionalCost < bestAdditionalCost)) {
        bestNextStore = store;
        bestAdditionalCoverage = additionalItems;
        bestAdditionalCost = additionalCost;
      }
    }
    
    // If we found a store that adds coverage, add it
    if (bestNextStore && bestAdditionalCoverage > 0) {
      selectedStores.push(bestNextStore);
      
      // Update covered items
      items.forEach(item => {
        if (item.prices.some(p => p.store === bestNextStore.store)) {
          coveredItems.add(item.id);
        }
      });
    } else {
      // No more stores add coverage, so we're done
      break;
    }
  }
  
  // Calculate the optimal distribution of items across the selected stores
  return optimizeItemDistribution(selectedStores, items, itemPriceMap);
}

// Helper function to optimize which items to buy at which stores
function optimizeItemDistribution(selectedStores, items, itemPriceMap) {
  const storeItems = {};
  
  // Initialize store data
  selectedStores.forEach(store => {
    storeItems[store.store] = {
      store: store.store,
      items: [],
      totalCost: 0,
      itemCount: 0
    };
  });
  
  // Assign each item to the cheapest store that has it
  items.forEach(item => {
    let cheapestStore = null;
    let cheapestPrice = Infinity;
    
    // Find cheapest store for this item
    selectedStores.forEach(store => {
      if (itemPriceMap[item.id] && itemPriceMap[item.id][store.store]) {
        const priceInfo = itemPriceMap[item.id][store.store];
        if (priceInfo.price < cheapestPrice) {
          cheapestStore = store.store;
          cheapestPrice = priceInfo.price;
        }
      }
    });
    
    // If found a store for this item
    if (cheapestStore) {
      const totalItemPrice = cheapestPrice * item.quantity;
      storeItems[cheapestStore].items.push({
        id: item.id,
        name: item.name,
        price: cheapestPrice,
        quantity: item.quantity,
        totalPrice: totalItemPrice
      });
      storeItems[cheapestStore].totalCost += totalItemPrice;
      storeItems[cheapestStore].itemCount += 1;
    }
  });
  
  // Convert to array and calculate coverage
  const result = Object.values(storeItems).filter(store => store.itemCount > 0);
  
  // Add coverage percentage
  result.forEach(store => {
    store.coverage = ((store.itemCount / items.length) * 100).toFixed(2);
  });
  
  return result;
}

module.exports = router;