import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ShoppingCart, Calendar, Plus, Settings } from 'lucide-react';
import axios from 'axios';

// Animated background particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {Array.from({ length: 12 }).map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-float"
          style={{
            width: `${Math.random() * 200 + 50}px`,
            height: `${Math.random() * 200 + 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 20 + 20}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.4
          }}
        />
      ))}
    </div>
  );
};

// Budget alert component
const BudgetAlert = ({ isOverBudget, percentUsed, isOverSpendingLimit }) => {
  if (!isOverBudget && percentUsed < 80 && !isOverSpendingLimit) return null;
  
  // Show spending limit alert instead of budget alert if spending limit is exceeded
  if (isOverSpendingLimit) {
    return (
      <div className="flex items-center p-4 mt-4 mb-6 rounded-lg border bg-red-950/40 border-red-500 text-red-200">
        <AlertTriangle className="mr-3" />
        <div>
          <h3 className="font-bold text-lg">Monthly Spending Limit Exceeded!</h3>
          <p>Your monthly spending has exceeded the Rs.50,000 limit. Please review your expenses.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex items-center p-4 mt-4 mb-6 rounded-lg border ${
      isOverBudget 
        ? 'bg-red-950/40 border-red-500 text-red-200' 
        : 'bg-yellow-950/40 border-yellow-500 text-yellow-200'
    }`}>
      <AlertTriangle className="mr-3" />
      <div>
        <h3 className="font-bold text-lg">
          {isOverBudget ? 'Budget Exceeded!' : 'Approaching Budget Limit'}
        </h3>
        <p>
          {isOverBudget 
            ? `You've exceeded your monthly budget by ${percentUsed.toFixed(0)}%.` 
            : `You've used ${percentUsed.toFixed(0)}% of your monthly budget.`}
        </p>
      </div>
    </div>
  );
};

// Store recommendation card
const StoreRecommendation = ({ storeData }) => {
  if (!storeData) return null;
  
  return (
    <div className="bg-indigo-950/30 backdrop-blur-sm rounded-lg p-5 border border-indigo-500/30 shadow-lg">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <ShoppingCart className="mr-2" size={20} />
        Recommended Store
      </h3>
      <div className="text-2xl font-bold text-indigo-300 mb-2">{storeData.store}</div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-400">Estimated Cost:</span>
          <div className="font-medium">Rs.{storeData.totalCost.toFixed(2)}</div>
        </div>
        <div>
          <span className="text-gray-400">Coverage:</span>
          <div className="font-medium">{storeData.coveragePercent.toFixed(0)}%</div>
        </div>
      </div>
      {storeData.itemsMissing.length > 0 && (
        <div className="mt-3 text-sm">
          <span className="text-yellow-300 font-medium">{storeData.itemsMissing.length} items not available</span>
        </div>
      )}
    </div>
  );
};

// Budget card component 
const BudgetCard = ({ title, amount, icon: Icon, bgClass }) => {
  return (
    <div className={`rounded-lg p-5 ${bgClass} border border-indigo-500/30 backdrop-blur-sm shadow-lg`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-300 font-medium">{title}</h3>
        <span className="p-2 bg-white/10 rounded-full">
          <Icon size={16} />
        </span>
      </div>
      <div className="text-2xl font-bold text-white">Rs.{amount.toFixed(2)}</div>
    </div>
  );
};

// Budget dashboard main component
export default function BudgetDashboard() {
  // State for date filters
  const [currentMonth, setCurrentMonth] = useState(new Date().toLocaleString('default', { month: 'long' }).toLowerCase());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  
  // State for fetched data
  const [budgetData, setBudgetData] = useState({
    totalBudget: 50000, // Setting budget to Rs.50,000
    totalSpent: 0,
    accountBalance: 0, // Changed "remaining" to "accountBalance" for clarity
    isOverBudget: false,
    percentUsed: 0,
    categoryBreakdown: {},
    isOverSpendingLimit: false
  });
  
  // Get the first day of month
  const getFirstDayOfMonth = (month, year) => {
    const monthIndex = new Date(`${month} 1, 2000`).getMonth();
    return new Date(year, monthIndex, 1);
  };
  
  // Get the last day of month
  const getLastDayOfMonth = (month, year) => {
    const monthIndex = new Date(`${month} 1, 2000`).getMonth();
    return new Date(year, monthIndex + 1, 0);
  };
  
  // Fetch account balance
  const fetchAccountBalance = async () => {
    try {
      // Using fixed accountId from the EBookAccountInterface component
      const accountId = '67e6c37158784ed46b22d597';
      const response = await axios.get(`http://localhost:8070/account/get/${accountId}`);
      return response.data.account.balance || 0;
    } catch (error) {
      console.error('Error fetching account balance:', error);
      return 0;
    }
  };
  
  // Fetch budget data from API
  const fetchBudgetData = async () => {
    setIsLoading(true);
    try {
      const startDate = getFirstDayOfMonth(currentMonth, currentYear);
      const endDate = getLastDayOfMonth(currentMonth, currentYear);
      
      // Fetch account balance first
      const accountBalance = await fetchAccountBalance();
      
      // Fetch total spending for the current month
      const spendingResponse = await axios.get(`http://localhost:8070/budget/stats/daterange`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      
      // Fetch category breakdown
      const categoryResponse = await axios.get('http://localhost:8070/budget/stats/categories');
      
      // Calculate category breakdown for current month
      const thisMonthCategories = await axios.get('http://localhost:8070/budget', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      
      // Process category data
      const categoryBreakdown = {};
      const monthItems = thisMonthCategories.data.filter(item => {
        const purchaseDate = new Date(item.purchasedDate);
        return purchaseDate >= startDate && purchaseDate <= endDate;
      });
      
      monthItems.forEach(item => {
        if (!categoryBreakdown[item.category]) {
          categoryBreakdown[item.category] = 0;
        }
        categoryBreakdown[item.category] += item.totalPrice;
      });
      
      // Set budget to Rs.50,000
      const totalBudget = 50000;
      const totalSpent = spendingResponse.data.totalSpent || 0;
      const percentUsed = (totalSpent / totalBudget) * 100;
      const isOverBudget = totalSpent > totalBudget;
      const isOverSpendingLimit = totalSpent > 50000; // Check if spending exceeds 50,000
      
      // Update budget data state
      setBudgetData({
        totalBudget,
        totalSpent,
        accountBalance, // Set directly from fetched account balance
        isOverBudget,
        percentUsed,
        categoryBreakdown,
        isOverSpendingLimit
      });
      
      // Fetch monthly spending trends for the past six months
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentYear, new Date(`${currentMonth} 1, 2000`).getMonth() - i, 1);
        const monthName = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        
        const monthStart = new Date(year, date.getMonth(), 1);
        const monthEnd = new Date(year, date.getMonth() + 1, 0);
        
        try {
          const response = await axios.get(`http://localhost:8070/budget/stats/daterange`, {
            params: {
              startDate: monthStart.toISOString(),
              endDate: monthEnd.toISOString()
            }
          });
          
          monthlyData.push({
            month: monthName,
            spent: response.data.totalSpent || 0,
            budget: totalBudget // Using the same budget for all months for simplicity
          });
        } catch (error) {
          console.error(`Error fetching data for ${monthName} ${year}:`, error);
          monthlyData.push({
            month: monthName,
            spent: 0,
            budget: totalBudget
          });
        }
      }
      
      setMonthlyExpenses(monthlyData);
      
      // Calculate suggested budget based on spending trends
      const avgSpending = monthlyData.reduce((sum, month) => sum + month.spent, 0) / monthlyData.length;
      const nextMonth = new Date(currentYear, new Date(`${currentMonth} 1, 2000`).getMonth() + 1, 1);
      const nextMonthName = nextMonth.toLocaleString('default', { month: 'long' }).toLowerCase();
      
      // Create suggested budget with 5% buffer
      const suggestedTotal = Math.ceil(avgSpending * 1.05);
      
      // Distribute suggested budget across categories based on current spending patterns
      const totalCategorySpending = Object.values(categoryBreakdown).reduce((sum, amount) => sum + amount, 0);
      const categorySuggestions = {};
      
      Object.entries(categoryBreakdown).forEach(([category, amount]) => {
        const percentage = amount / totalCategorySpending;
        categorySuggestions[category] = Math.ceil(suggestedTotal * percentage);
      });
      
      setSuggestedBudget({
        month: nextMonthName,
        year: nextMonth.getFullYear(),
        suggestedBudget: suggestedTotal,
        categorySuggestions,
        basedOn: {
          months: monthlyData.length,
          averageSpending: avgSpending
        }
      });
      
      // Find recommended store based on purchase history
      const allItems = await axios.get('http://localhost:8070/budget');
      const stores = {};
      
      allItems.data.forEach(item => {
        if (!stores[item.store]) {
          stores[item.store] = {
            totalSpent: 0,
            count: 0,
            items: []
          };
        }
        stores[item.store].totalSpent += item.totalPrice;
        stores[item.store].count += 1;
        if (!stores[item.store].items.includes(item.itemName)) {
          stores[item.store].items.push(item.itemName);
        }
      });
      
      // Find store with most purchases
      let bestStore = null;
      let maxCount = 0;
      
      Object.entries(stores).forEach(([store, data]) => {
        if (data.count > maxCount && store !== 'Unknown') {
          maxCount = data.count;
          bestStore = store;
        }
      });
      
      if (bestStore) {
        // Simple recommendation algorithm - in a real app this would be more sophisticated
        const commonItems = ["Milk", "Bread", "Eggs", "Cheese", "Pasta", "Rice"];
        const available = commonItems.filter(() => Math.random() > 0.2); // Simulate items availability
        const missing = commonItems.filter(item => !available.includes(item));
        
        setStoreRecommendation({
          store: bestStore,
          totalCost: (stores[bestStore].totalSpent / stores[bestStore].count) * available.length,
          itemsFound: available.length,
          itemsMissing: missing,
          coveragePercent: (available.length / commonItems.length) * 100,
          itemsTotal: commonItems.length
        });
      }
      
    } catch (error) {
      console.error('Error fetching budget data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format category breakdown for pie chart
  const [categoryPieData, setCategoryPieData] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [suggestedBudget, setSuggestedBudget] = useState(null);
  const [storeRecommendation, setStoreRecommendation] = useState(null);
  
  useEffect(() => {
    // Update pie chart data when category breakdown changes
    const pieData = Object.entries(budgetData.categoryBreakdown).map(([name, value]) => ({
      name, value
    }));
    setCategoryPieData(pieData);
  }, [budgetData.categoryBreakdown]);
  
  // COLORS for pie chart
  const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#f472b6'];
  
  // Fetch data when component mounts or when month/year changes
  useEffect(() => {
    fetchBudgetData();
  }, [currentMonth, currentYear]);
  
  // Handle month change
  const handleMonthYearChange = (e) => {
    const [month, year] = e.target.value.split('-');
    setCurrentMonth(month);
    setCurrentYear(parseInt(year));
  };
  
  // Convert month name to number
  const getMonthOptions = () => {
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june', 
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    
    const options = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Add options for previous year
    months.forEach(month => {
      options.push({
        value: `${month}-${currentYear - 1}`,
        label: `${month.charAt(0).toUpperCase() + month.slice(1)} ${currentYear - 1}`
      });
    });
    
    // Add options for current year
    months.forEach(month => {
      options.push({
        value: `${month}-${currentYear}`,
        label: `${month.charAt(0).toUpperCase() + month.slice(1)} ${currentYear}`
      });
    });
    
    return options;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white relative">
      {/* Animated particles background */}
      <FloatingParticles />
      
      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
              Budget Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Track, analyze, and optimize your spending</p>
          </div>
          
          {/* Month selector */}
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="mr-2"><Calendar size={18} /></span>
            <select 
              className="bg-indigo-900/50 border border-indigo-700 rounded-md py-1 px-2 text-white"
              value={`${currentMonth}-${currentYear}`}
              onChange={handleMonthYearChange}
            >
              {getMonthOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <button className="ml-3 p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
              <Plus size={18} />
            </button>
            <button className="ml-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              <Settings size={18} />
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
          </div>
        ) : (
          <>
            {/* Budget alert (if over budget, approaching limit, or over spending limit) */}
            <BudgetAlert 
              isOverBudget={budgetData.isOverBudget} 
              percentUsed={budgetData.percentUsed}
              isOverSpendingLimit={budgetData.isOverSpendingLimit}
            />
            
            {/* Budget summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <BudgetCard 
                title="Total Budget" 
                amount={budgetData.totalBudget} 
                icon={Settings}
                bgClass="bg-indigo-900/30" 
              />
              <BudgetCard 
                title="Total Spent" 
                amount={budgetData.totalSpent} 
                icon={ShoppingCart}
                bgClass="bg-purple-900/30" 
              />
              <BudgetCard 
                title="Account Balance" 
                amount={budgetData.accountBalance} 
                icon={budgetData.accountBalance >= 0 ? CheckCircle : AlertTriangle}
                bgClass={budgetData.accountBalance >= 0 ? "bg-emerald-900/30" : "bg-rose-900/30"} 
              />
            </div>
            
            {/* Main dashboard grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column: Spending by category */}
              <div className="lg:col-span-2">
                <div className="bg-indigo-950/30 backdrop-blur-sm border border-indigo-500/30 rounded-lg p-5 shadow-lg mb-6">
                  <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
                  <div className="h-64">
                    {categoryPieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={categoryPieData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
                          <YAxis tick={{ fill: '#9ca3af' }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}
                            labelStyle={{ color: '#f3f4f6' }}
                            formatter={(value) => [`Rs.${value.toFixed(2)}`, 'Amount']}
                          />
                          <Bar dataKey="value" fill="#6366f1" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full justify-center items-center text-gray-400">
                        <p>No spending data available for this period</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Spending trends */}
                <div className="bg-indigo-950/30 backdrop-blur-sm border border-indigo-500/30 rounded-lg p-5 shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">Monthly Spending Trends</h2>
                  <div className="h-64">
                    {monthlyExpenses.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={monthlyExpenses}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} />
                          <YAxis tick={{ fill: '#9ca3af' }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}
                            labelStyle={{ color: '#f3f4f6' }}
                            formatter={(value) => [`Rs.${value.toFixed(2)}`, 'Amount']}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="budget" stroke="#6366f1" strokeWidth={2} />
                          <Line type="monotone" dataKey="spent" stroke="#a855f7" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full justify-center items-center text-gray-400">
                        <p>No trend data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right column: Category Breakdown + Suggestions */}
              <div className="space-y-6">
                {/* Category breakdown pie chart */}
                <div className="bg-indigo-950/30 backdrop-blur-sm border border-indigo-500/30 rounded-lg p-5 shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
                  <div className="h-64">
                    {categoryPieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryPieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryPieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`Rs.${value.toFixed(2)}`, 'Amount']}
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}
                            labelStyle={{ color: '#f3f4f6' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full justify-center items-center text-gray-400">
                        <p>No category data available</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Store recommendation */}
                {storeRecommendation && <StoreRecommendation storeData={storeRecommendation} />}
                
                {/* Next month's budget suggestion */}
                {suggestedBudget && (
                  <div className="bg-indigo-950/30 backdrop-blur-sm rounded-lg p-5 border border-indigo-500/30 shadow-lg">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <TrendingUp className="mr-2" size={20} />
                      Suggested Budget for {suggestedBudget.month.charAt(0).toUpperCase() + suggestedBudget.month.slice(1)}
                    </h3>
                    <div className="text-2xl font-bold text-indigo-300 mb-3">Rs.{suggestedBudget.suggestedBudget.toFixed(2)}</div>
                    <p className="text-sm text-gray-400 mb-4">
                      Based on your spending in the last {suggestedBudget.basedOn.months} months
                    </p>
                    
                    <div className="space-y-2">
                      {Object.entries(suggestedBudget.categorySuggestions).map(([category, amount]) => (
                        <div key={category} className="flex justify-between items-center text-sm">
                          <span className="text-gray-300">{category}</span>
                          <span className="font-medium">Rs.{amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition-colors font-medium">
                      Apply Suggested Budget
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}