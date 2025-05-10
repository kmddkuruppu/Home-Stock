import { useState, useEffect } from 'react';
import { Calendar, DollarSign, ShoppingBag, Clock, List, AlertTriangle, PlusCircle, MinusCircle, Save, Heart, BarChart2 } from 'lucide-react';

// Animated background particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {Array.from({ length: 12 }).map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-float"
          style={{
            width: `${Math.random() * 100 + 50}px`,
            height: `${Math.random() * 100 + 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 10 + 10}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.4
          }}
        />
      ))}
    </div>
  );
};

// Budget progress bar component
const BudgetProgress = ({ used, total }) => {
  const percentage = Math.min(Math.round((used / total) * 100), 100);
  const getColor = () => {
    if (percentage < 70) return "bg-emerald-500";
    if (percentage < 90) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="w-full mt-2">
      <div className="flex justify-between text-sm mb-1">
        <span>Budget Used: ${used.toFixed(2)}</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <div className="h-3 w-full bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColor()} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-right text-sm mt-1 font-medium">
        {percentage}%
      </div>
    </div>
  );
};

// Main Budget Dashboard Component
const BudgetDashboard = () => {
  // Current month state
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  
  // Budget state
  const [budget, setBudget] = useState({
    totalBudget: 1000,
    actualSpend: 650,
    wishlist: []
  });

  // Shopping list items state
  const [items, setItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  
  // UI state
  const [activeTab, setActiveTab] = useState('overview');
  const [showBudgetAdjust, setShowBudgetAdjust] = useState(false);
  const [newBudgetAmount, setNewBudgetAmount] = useState(budget.totalBudget);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({
    itemName: '',
    category: 'Groceries',
    quantity: 1,
    price: 0,
    priority: 'Medium',
    notes: '',
    store: 'Default Store'
  });

  // Sample shopping list data for demonstration
  useEffect(() => {
    // This would normally be a fetch to your API
    setItems([
      { 
        itemId: '1', 
        itemName: 'Milk', 
        category: 'Groceries', 
        quantity: 2, 
        price: 3.99, 
        totalPrice: 7.98,
        priority: 'High',
        purchasedDate: '2025-05-05',
        store: 'SuperMarket'
      },
      { 
        itemId: '2', 
        itemName: 'Bread', 
        category: 'Groceries', 
        quantity: 1, 
        price: 2.49, 
        totalPrice: 2.49,
        priority: 'Medium',
        purchasedDate: '2025-05-05',
        store: 'SuperMarket'
      },
      { 
        itemId: '3', 
        itemName: 'Coffee', 
        category: 'Beverages', 
        quantity: 1, 
        price: 12.99, 
        totalPrice: 12.99,
        priority: 'Low',
        purchasedDate: '2025-05-07',
        store: 'CoffeeShop'
      },
      { 
        itemId: '4', 
        itemName: 'Chicken', 
        category: 'Meat', 
        quantity: 2, 
        price: 9.99, 
        totalPrice: 19.98,
        priority: 'High',
        purchasedDate: '2025-05-08',
        store: 'ButcherShop'
      }
    ]);

    setWishlistItems([
      { 
        itemId: '5', 
        itemName: 'AirPods', 
        category: 'Electronics', 
        quantity: 1, 
        price: 179.99, 
        totalPrice: 179.99,
        priority: 'Low',
        store: 'ElectronicsStore'
      },
      { 
        itemId: '6', 
        itemName: 'Running Shoes', 
        category: 'Clothing', 
        quantity: 1, 
        price: 89.99, 
        totalPrice: 89.99,
        priority: 'Medium',
        store: 'SportingGoods'
      }
    ]);
  }, []);

  // Budget suggestions based on spending patterns
  const budgetSuggestions = [
    { item: 'Coffee', currentSpend: 45.99, suggestedReduction: 20 },
    { item: 'Eating Out', currentSpend: 120.55, suggestedReduction: 40 },
    { item: 'Entertainment', currentSpend: 89.99, suggestedReduction: 30 }
  ];

  // Store price comparison data
  const storeComparisons = {
    'Groceries': [
      { store: 'SuperMarket', priceIndex: 100 },
      { store: 'DiscountGrocer', priceIndex: 85 },
      { store: 'FarmersMarket', priceIndex: 95 }
    ],
    'Electronics': [
      { store: 'TechStore', priceIndex: 100 },
      { store: 'OnlineRetailer', priceIndex: 92 },
      { store: 'WarehouseClub', priceIndex: 96 }
    ]
  };

  // Handle adding new item
  const handleAddItem = () => {
    // In a real app, this would make a POST request to your API
    const itemWithTotal = {
      ...newItem,
      itemId: Date.now().toString(),
      totalPrice: newItem.quantity * newItem.price,
      purchasedDate: new Date().toISOString().split('T')[0],
      purchasedTime: new Date().toTimeString().split(' ')[0]
    };
    
    setItems([...items, itemWithTotal]);
    setNewItem({
      itemName: '',
      category: 'Groceries',
      quantity: 1,
      price: 0,
      priority: 'Medium',
      notes: '',
      store: 'Default Store'
    });
    setShowAddItem(false);
  };

  // Handle moving item to wishlist
  const moveToWishlist = (item) => {
    setWishlistItems([...wishlistItems, item]);
    setItems(items.filter(i => i.itemId !== item.itemId));
  };

  // Calculate category spending
  const categorySpending = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.totalPrice;
    return acc;
  }, {});

  // Top categories by spending
  const topCategories = Object.entries(categorySpending)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white relative">
      {/* Animated background */}
      <FloatingParticles />
      
      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-300">
            Smart Budget Tracker
          </h1>
          <div className="flex items-center gap-2">
            <select 
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
            >
              <option value="2025-05">May 2025</option>
              <option value="2025-04">April 2025</option>
              <option value="2025-03">March 2025</option>
            </select>
            <button 
              onClick={() => setShowAddItem(true)}
              className="bg-indigo-600 hover:bg-indigo-700 rounded-lg px-4 py-2 flex items-center gap-2"
            >
              <PlusCircle size={18} /> Add Item
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium ${activeTab === 'overview' 
              ? 'text-indigo-400 border-b-2 border-indigo-400' 
              : 'text-gray-400 hover:text-white'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('items')}
            className={`px-4 py-2 font-medium ${activeTab === 'items' 
              ? 'text-indigo-400 border-b-2 border-indigo-400' 
              : 'text-gray-400 hover:text-white'}`}
          >
            Shopping List
          </button>
          <button 
            onClick={() => setActiveTab('analysis')}
            className={`px-4 py-2 font-medium ${activeTab === 'analysis' 
              ? 'text-indigo-400 border-b-2 border-indigo-400' 
              : 'text-gray-400 hover:text-white'}`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2 font-medium ${activeTab === 'wishlist' 
              ? 'text-indigo-400 border-b-2 border-indigo-400' 
              : 'text-gray-400 hover:text-white'}`}
          >
            Wishlist
          </button>
        </div>

        {/* Main content area */}
        <div className="mb-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Budget Summary Card */}
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <DollarSign size={20} /> Budget Summary
                  </h2>
                  <button 
                    onClick={() => setShowBudgetAdjust(!showBudgetAdjust)}
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    {showBudgetAdjust ? 'Cancel' : 'Adjust'}
                  </button>
                </div>
                
                {showBudgetAdjust ? (
                  <div className="mb-4">
                    <label className="block text-sm mb-1">Adjust Monthly Budget</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={newBudgetAmount}
                        onChange={(e) => setNewBudgetAmount(Number(e.target.value))}
                        className="bg-gray-900 border border-gray-700 rounded w-full px-3 py-2"
                      />
                      <button 
                        onClick={() => {
                          setBudget({...budget, totalBudget: newBudgetAmount});
                          setShowBudgetAdjust(false);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 rounded px-3 py-2"
                      >
                        <Save size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <BudgetProgress used={budget.actualSpend} total={budget.totalBudget} />
                )}
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center bg-gray-900/70 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Remaining</div>
                    <div className="text-2xl font-bold text-indigo-400">
                      ${Math.max(0, budget.totalBudget - budget.actualSpend).toFixed(2)}
                    </div>
                  </div>
                  <div className="text-center bg-gray-900/70 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Daily Budget</div>
                    <div className="text-2xl font-bold text-indigo-400">
                      ${(budget.totalBudget / 30).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Budget Suggestions Card */}
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle size={20} /> Suggested Reductions
                </h2>
                {budgetSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="mb-3 pb-3 border-b border-gray-700 last:border-0">
                    <div className="flex justify-between items-center">
                      <span>{suggestion.item}</span>
                      <span className="text-rose-400">-${suggestion.suggestedReduction.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Current spending: ${suggestion.currentSpend.toFixed(2)}
                    </div>
                  </div>
                ))}
                <button className="w-full mt-2 bg-gray-900/70 hover:bg-gray-700 py-2 rounded-lg text-sm">
                  Apply Suggestions
                </button>
              </div>
              
              {/* Top Spending Categories Card */}
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BarChart2 size={20} /> Top Categories
                </h2>
                {topCategories.map(([category, amount], idx) => (
                  <div key={idx} className="mb-3 pb-3 border-b border-gray-700 last:border-0">
                    <div className="flex justify-between items-center">
                      <span>{category}</span>
                      <span className="font-medium">${amount.toFixed(2)}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-700 rounded-full mt-1">
                      <div 
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${(amount / budget.actualSpend) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Shopping List</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-2">Item</th>
                      <th className="text-left py-3 px-2">Category</th>
                      <th className="text-right py-3 px-2">Quantity</th>
                      <th className="text-right py-3 px-2">Price</th>
                      <th className="text-right py-3 px-2">Total</th>
                      <th className="text-center py-3 px-2">Priority</th>
                      <th className="text-right py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.itemId} className="border-b border-gray-700 last:border-0">
                        <td className="py-3 px-2">{item.itemName}</td>
                        <td className="py-3 px-2">{item.category}</td>
                        <td className="py-3 px-2 text-right">{item.quantity}</td>
                        <td className="py-3 px-2 text-right">${item.price.toFixed(2)}</td>
                        <td className="py-3 px-2 text-right">${item.totalPrice.toFixed(2)}</td>
                        <td className="py-3 px-2 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.priority === 'High' ? 'bg-rose-900/50 text-rose-200' : 
                            item.priority === 'Medium' ? 'bg-amber-900/50 text-amber-200' : 
                            'bg-emerald-900/50 text-emerald-200'
                          }`}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button 
                            onClick={() => moveToWishlist(item)}
                            className="text-indigo-400 hover:text-indigo-300 mr-2"
                            title="Move to Wishlist"
                          >
                            <Heart size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-medium">
                      <td colSpan="4" className="py-3 px-2 text-right">Total:</td>
                      <td className="py-3 px-2 text-right">
                        ${items.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                      </td>
                      <td colSpan="2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Budget vs Actual Compare */}
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl">
                <h2 className="text-xl font-semibold mb-4">Budget vs Actual Comparison</h2>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span>Budget</span>
                    <span>${budget.totalBudget.toFixed(2)}</span>
                  </div>
                  <div className="h-4 bg-gray-700 rounded-full">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span>Actual Spend</span>
                    <span>${budget.actualSpend.toFixed(2)}</span>
                  </div>
                  <div className="h-4 bg-gray-700 rounded-full">
                    <div 
                      className={`h-full rounded-full ${budget.actualSpend > budget.totalBudget ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${Math.min((budget.actualSpend / budget.totalBudget) * 100, 100)}%` }} 
                    />
                  </div>
                </div>
                <div className="text-right text-sm">
                  {budget.actualSpend > budget.totalBudget ? (
                    <span className="text-rose-400">Over budget by ${(budget.actualSpend - budget.totalBudget).toFixed(2)}</span>
                  ) : (
                    <span className="text-emerald-400">Under budget by ${(budget.totalBudget - budget.actualSpend).toFixed(2)}</span>
                  )}
                </div>
              </div>
              
              {/* Store Price Comparison */}
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl">
                <h2 className="text-xl font-semibold mb-4">Store Price Comparison</h2>
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Groceries</h3>
                  {storeComparisons['Groceries'].map((store, idx) => (
                    <div key={idx} className="mb-2">
                      <div className="flex justify-between mb-1">
                        <span>{store.store}</span>
                        <span>Price Index: {store.priceIndex}</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full">
                        <div 
                          className={`h-full ${store.priceIndex === 100 ? 'bg-amber-500' : 'bg-emerald-500'} rounded-full`} 
                          style={{ width: `${(store.priceIndex / 100) * 100}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-medium mb-2">Electronics</h3>
                  {storeComparisons['Electronics'].map((store, idx) => (
                    <div key={idx} className="mb-2">
                      <div className="flex justify-between mb-1">
                        <span>{store.store}</span>
                        <span>Price Index: {store.priceIndex}</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full">
                        <div 
                          className={`h-full ${store.priceIndex === 100 ? 'bg-amber-500' : 'bg-emerald-500'} rounded-full`} 
                          style={{ width: `${(store.priceIndex / 100) * 100}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Wishlist Items</h2>
              {wishlistItems.length === 0 ? (
                <p className="text-gray-400">Your wishlist is empty. Move low-priority items here to save for later.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-2">Item</th>
                        <th className="text-left py-3 px-2">Category</th>
                        <th className="text-right py-3 px-2">Price</th>
                        <th className="text-center py-3 px-2">Priority</th>
                        <th className="text-right py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wishlistItems.map((item) => (
                        <tr key={item.itemId} className="border-b border-gray-700 last:border-0">
                          <td className="py-3 px-2">{item.itemName}</td>
                          <td className="py-3 px-2">{item.category}</td>
                          <td className="py-3 px-2 text-right">${item.price.toFixed(2)}</td>
                          <td className="py-3 px-2 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.priority === 'High' ? 'bg-rose-900/50 text-rose-200' : 
                              item.priority === 'Medium' ? 'bg-amber-900/50 text-amber-200' : 
                              'bg-emerald-900/50 text-emerald-200'
                            }`}>
                              {item.priority}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <button className="text-indigo-400 hover:text-indigo-300">
                              <ShoppingBag size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add Item Modal */}
        {showAddItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg mx-4">
              <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">Item Name</label>
                  <input
                    value={newItem.itemName}
                    onChange={(e) => setNewItem({...newItem, itemName: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  >
                    <option>Groceries</option>
                    <option>Electronics</option>
                    <option>Clothing</option>
                    <option>Household</option>
                    <option>Entertainment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Priority</label>
                  <select
                    value={newItem.priority}
                    onChange={(e) => setNewItem({...newItem, priority: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Store</label>
                  <input
                    value={newItem.store}
                    onChange={(e) => setNewItem({...newItem, store: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm mb-1">Notes</label>
                  <textarea
                    value={newItem.notes}
                    onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                    rows="2"
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setShowAddItem(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddItem}
                  className="bg-indigo-600 hover:bg-indigo-700 rounded-lg px-4 py-2"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Footer with stats */}
        <footer className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-4 flex items-center">
            <Calendar size={24} className="text-indigo-400 mr-3" />
            <div>
              <div className="text-sm text-gray-400">Month Spending</div>
              <div className="font-medium">${budget.actualSpend.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-4 flex items-center">
            <ShoppingBag size={24} className="text-indigo-400 mr-3" />
            <div>
              <div className="text-sm text-gray-400">Total Items</div>
              <div className="font-medium">{items.length}</div>
            </div>
          </div>
          
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-4 flex items-center">
            <Heart size={24} className="text-indigo-400 mr-3" />
            <div>
              <div className="text-sm text-gray-400">Wishlist Items</div>
              <div className="font-medium">{wishlistItems.length}</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BudgetDashboard;