import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sparkles, Wallet, Calendar, TrendingUp, Filter, Download, RefreshCcw } from 'lucide-react';

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

// Custom card component with glass effect
const GlassCard = ({ children, className = "" }) => {
  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 ${className}`}>
      {children}
    </div>
  );
};

// Budget Summary Page
export default function BudgetSummaryPage() {
  // Sample data - this would come from your API
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Categories colors
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];
  
  // Fetch expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        // In a real implementation, this would be fetched from your API
        const response = await fetch('/api/expenses');
        const data = await response.json();
        
        // Dummy data for demonstration
        const dummyData = [
          { _id: '1', amount: 120, category: 'Food', description: 'Groceries', date: '2025-05-01' },
          { _id: '2', amount: 55, category: 'Transport', description: 'Gas', date: '2025-05-02' },
          { _id: '3', amount: 200, category: 'Housing', description: 'Rent', date: '2025-05-05' },
          { _id: '4', amount: 35, category: 'Entertainment', description: 'Movie tickets', date: '2025-05-07' },
          { _id: '5', amount: 80, category: 'Utilities', description: 'Electricity bill', date: '2025-05-08' },
          { _id: '6', amount: 60, category: 'Food', description: 'Dining out', date: '2025-05-08' }
        ];
        
        setExpenses(dummyData);
        const total = dummyData.reduce((sum, expense) => sum + expense.amount, 0);
        setTotalSpent(total);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch expenses');
        setIsLoading(false);
      }
    };
    
    fetchExpenses();
  }, []);
  
  // Process data for charts
  const categoryData = expenses.reduce((acc, expense) => {
    const existingCategory = acc.find(item => item.name === expense.category);
    if (existingCategory) {
      existingCategory.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, []);
  
  // Function to filter expenses
  const filterExpenses = (filter) => {
    setSelectedFilter(filter);
    // In a real implementation, you would apply actual filtering logic here
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white relative">
      {/* Animated particles background */}
      <FloatingParticles />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-10 flex flex-col lg:flex-row justify-between items-center">
          <div className="flex items-center mb-6 lg:mb-0">
            <Sparkles className="text-purple-400 mr-3" size={32} />
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Budget Summary Dashboard
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all">
              <RefreshCcw size={16} className="mr-2" />
              <span>Refresh</span>
            </button>
            <button className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all">
              <Download size={16} className="mr-2" />
              <span>Export</span>
            </button>
          </div>
        </header>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <GlassCard className="flex flex-col">
            <div className="flex items-center mb-2">
              <Wallet className="text-purple-400 mr-2" size={20} />
              <h3 className="text-lg font-medium text-gray-100">Total Spent</h3>
            </div>
            <p className="text-3xl font-bold">${totalSpent.toFixed(2)}</p>
            <p className="text-sm text-gray-300 mt-2">This Month</p>
          </GlassCard>
          
          <GlassCard className="flex flex-col">
            <div className="flex items-center mb-2">
              <TrendingUp className="text-green-400 mr-2" size={20} />
              <h3 className="text-lg font-medium text-gray-100">Top Category</h3>
            </div>
            {categoryData.length > 0 && (
              <>
                <p className="text-3xl font-bold">{categoryData.sort((a, b) => b.value - a.value)[0].name}</p>
                <p className="text-sm text-gray-300 mt-2">${categoryData.sort((a, b) => b.value - a.value)[0].value.toFixed(2)}</p>
              </>
            )}
          </GlassCard>
          
          <GlassCard className="flex flex-col">
            <div className="flex items-center mb-2">
              <Calendar className="text-blue-400 mr-2" size={20} />
              <h3 className="text-lg font-medium text-gray-100">Latest Expense</h3>
            </div>
            {expenses.length > 0 && (
              <>
                <p className="text-3xl font-bold">{expenses[expenses.length-1].description}</p>
                <p className="text-sm text-gray-300 mt-2">${expenses[expenses.length-1].amount.toFixed(2)} • {expenses[expenses.length-1].date}</p>
              </>
            )}
          </GlassCard>
          
          <GlassCard className="flex flex-col">
            <div className="flex items-center mb-2">
              <Filter className="text-yellow-400 mr-2" size={20} />
              <h3 className="text-lg font-medium text-gray-100">Filter Expenses</h3>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button 
                className={`px-3 py-1 text-sm rounded-full ${selectedFilter === 'all' ? 'bg-purple-500' : 'bg-white/10 hover:bg-white/20'}`}
                onClick={() => filterExpenses('all')}
              >
                All
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-full ${selectedFilter === 'week' ? 'bg-purple-500' : 'bg-white/10 hover:bg-white/20'}`}
                onClick={() => filterExpenses('week')}
              >
                This Week
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-full ${selectedFilter === 'month' ? 'bg-purple-500' : 'bg-white/10 hover:bg-white/20'}`}
                onClick={() => filterExpenses('month')}
              >
                This Month
              </button>
            </div>
          </GlassCard>
        </div>
        
        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Pie Chart */}
          <GlassCard className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-6">Spending by Category</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No data available
              </div>
            )}
          </GlassCard>
          
          {/* Bar Chart */}
          <GlassCard className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6">Recent Expenses</h2>
            {expenses.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={expenses}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="category" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip 
                    formatter={(value) => `$${value}`}
                    labelFormatter={(value) => `Category: ${value}`}
                    contentStyle={{ backgroundColor: "rgba(30, 27, 75, 0.9)", border: "1px solid rgba(255,255,255,0.2)" }}
                  />
                  <Legend />
                  <Bar dataKey="amount" name="Amount ($)" fill="#8884d8">
                    {expenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No data available
              </div>
            )}
          </GlassCard>
        </div>
        
        {/* Recent Transactions Table */}
        <GlassCard>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
              View All
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 p-4 text-center">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 font-medium text-gray-200">Description</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-200">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-200">Date</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-200">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense._id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4">{expense.description}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-1 rounded-full text-xs bg-white/10">
                          {expense.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">{expense.date}</td>
                      <td className="py-3 px-4 text-right font-medium">${expense.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {expenses.length === 0 && !isLoading && !error && (
            <div className="text-center py-8 text-gray-400">
              No transactions found
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}