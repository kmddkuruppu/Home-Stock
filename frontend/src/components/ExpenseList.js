import React, { useState, useEffect } from 'react';
import { Calendar, Download, Filter, Wallet, ArrowUpDown, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalExpense, setTotalExpense] = useState(0);
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterCategory, setFilterCategory] = useState('All');

  const COLORS = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

  // Format date without date-fns
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8070/budget');
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const data = await response.json();
      
      // Sort expenses by date (newest first)
      const sortedExpenses = data.expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setExpenses(sortedExpenses);
      
      // Calculate total expenses
      const total = sortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalExpense(total);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(sortedExpenses.map(expense => expense.category))];
      setCategories(['All', ...uniqueCategories]);
      
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    
    const sorted = [...expenses].sort((a, b) => {
      if (newOrder === 'desc') {
        return new Date(b.date) - new Date(a.date);
      } else {
        return new Date(a.date) - new Date(b.date);
      }
    });
    
    setExpenses(sorted);
  };

  const handleFilter = (category) => {
    setFilterCategory(category);
  };

  const getCategoryData = () => {
    const categoryMap = {};
    expenses.forEach(expense => {
      if (categoryMap[expense.category]) {
        categoryMap[expense.category] += expense.amount;
      } else {
        categoryMap[expense.category] = expense.amount;
      }
    });
    
    return Object.keys(categoryMap).map((category, index) => ({
      name: category,
      value: categoryMap[category],
      color: COLORS[index % COLORS.length]
    }));
  };

  const filteredExpenses = filterCategory === 'All' 
    ? expenses 
    : expenses.filter(expense => expense.category === filterCategory);
    
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-900 rounded-lg">
        <div className="flex flex-col items-center">
          <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="mt-4 text-gray-300">Loading expense data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-red-900 border border-red-700 rounded-lg">
        <p className="text-red-200 text-center">Error: {error}</p>
        <button 
          className="mt-4 mx-auto block px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
          onClick={fetchExpenses}
        >
          <div className="flex items-center justify-center">
            <RefreshCw className="mr-2" size={16} />
            Retry
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-xl">
      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Wallet className="mr-2 text-purple-500" />
          Expense Tracker
        </h2>
        <div className="flex space-x-2">
          <button 
            className="flex items-center px-3 py-1 bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
            onClick={fetchExpenses}
          >
            <RefreshCw className="mr-1" size={14} />
            Refresh
          </button>
          <button 
            className="flex items-center px-3 py-1 bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
          >
            <Download className="mr-1" size={14} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg shadow-md">
          <p className="text-purple-300 text-sm">Total Expenses</p>
          <p className="text-white text-2xl font-bold">LKR {totalExpense.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg shadow-md">
          <p className="text-blue-300 text-sm">Number of Expenses</p>
          <p className="text-white text-2xl font-bold">{expenses.length}</p>
        </div>
        <div className="p-4 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg shadow-md">
          <p className="text-indigo-300 text-sm">Categories</p>
          <p className="text-white text-2xl font-bold">{categories.length - 1}</p>
        </div>
      </div>

      {/* Visualization and Filter Row */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* Chart Section */}
        <div className="w-full md:w-1/3 bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-gray-300 text-sm mb-2">Expense Breakdown</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getCategoryData()}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {getCategoryData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `LKR ${value.toFixed(2)}`}
                  contentStyle={{backgroundColor: '#374151', borderColor: '#4B5563', borderRadius: '4px', color: '#E5E7EB'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filter Section */}
        <div className="w-full md:w-2/3 bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Filter className="mr-2 text-gray-400" size={16} />
              <h3 className="text-gray-300 text-sm">Filter by Category</h3>
            </div>
            <button 
              className="flex items-center px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
              onClick={handleSort}
            >
              <ArrowUpDown className="mr-1" size={12} />
              {sortOrder === 'desc' ? 'Newest' : 'Oldest'} First
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-3 py-1.5 text-xs rounded-full transition ${
                  filterCategory === category 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => handleFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expense Table */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center p-8 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-gray-400">No expenses found</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredExpenses.map((expense, index) => (
                  <tr 
                    key={expense._id || index}
                    className="hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-900 text-indigo-200">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-300">
                      LKR {expense.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 flex justify-end">
        <button
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition"
        >
          <Calendar className="mr-2" size={20} />
          View Monthly Budget Overview
        </button>
      </div>
    </div>
  );
};

export default ExpenseList;