import React, { useState, useEffect } from 'react';
import { FileText, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

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

const particleColors = [
  'from-green-400 to-emerald-500',
  'from-blue-400 to-cyan-500',
  'from-purple-400 to-indigo-500',
  'from-yellow-400 to-amber-500',
];

const SuccessConfetti = () => (
  <>
    {[...Array(100)].map((_, i) => (
      <div
        key={i}
        className={`absolute rounded-md bg-gradient-to-r ${
          particleColors[Math.floor(Math.random() * particleColors.length)]
        }`}
        style={{
          width: `${Math.random() * 10 + 5}px`,
          height: `${Math.random() * 10 + 5}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: 0,
          animation: `confetti ${Math.random() * 3 + 1.5}s ease-out ${Math.random() * 0.5}s forwards`
        }}
      />
    ))}
  </>
);

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/90 rounded-xl p-6 w-96 border border-gray-700 shadow-2xl animate-fade-in">
        <h3 className="text-xl font-semibold text-gray-100 mb-4">Confirm Deletion</h3>
        <p className="text-gray-300 mb-6">Are you sure you want to delete this expense? This action cannot be undone.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const generateHomeStockPDF = (expenses, month, year, totalOverall) => {
  // PDF generation logic would go here
  // This is a simplified version as we're not importing jsPDF and autoTable
  console.log('Generating PDF for', month, year, 'with', expenses.length, 'expenses');
  alert(`PDF Generated for ${month}/${year} with ${expenses.length} expenses!`);
};

const MonthlyExpenseCard = ({ monthData, onGeneratePDF }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const totalMonthlyExpense = monthData.expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount), 
    0
  );
  
  return (
    <div className="mb-6 bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-purple-500/30">
      <div 
        className="flex justify-between items-center bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4 cursor-pointer hover:from-indigo-900 hover:to-gray-800 transition-all duration-300"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-bold text-gray-100 flex items-center">
          <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
          {monthData.monthName} {monthData.year}
        </h2>
        <div className="flex items-center">
          <span className="text-lg font-semibold text-green-400 mr-4">
            LKR {totalMonthlyExpense.toFixed(2)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onGeneratePDF(monthData);
            }}
            className="mr-4 flex items-center px-3 py-1 bg-blue-600/80 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
          >
            <FileText className="mr-1" size={16} />
            PDF
          </button>
          <div className="p-1 rounded-full bg-gray-700/70 hover:bg-indigo-700/70 transition-colors">
            {isExpanded ? (
              <ChevronUp className="text-gray-300" size={18} />
            ) : (
              <ChevronDown className="text-gray-300" size={18} />
            )}
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="transition-all duration-300 max-h-96 overflow-y-auto bg-gray-800/30 backdrop-blur-sm">
          <table className="w-full table-auto">
            <thead className="bg-gray-800/70 sticky top-0 border-b border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-gray-300">Amount (LKR)</th>
                <th className="px-6 py-3 text-left text-gray-300">Category</th>
                <th className="px-6 py-3 text-left text-gray-300">Description</th>
                <th className="px-6 py-3 text-left text-gray-300">Date</th>
              </tr>
            </thead>
            <tbody>
              {monthData.expenses.map((expense, index) => (
                <tr 
                  key={expense._id || index} 
                  className={`border-b border-gray-700/30 hover:bg-indigo-900/30 transition-colors duration-200`}
                >
                  <td className="px-6 py-4 text-left font-medium text-green-400">Rs. {expense.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-left text-gray-300">{expense.category}</td>
                  <td className="px-6 py-4 text-left text-gray-300">{expense.description}</td>
                  <td className="px-6 py-4 text-left text-gray-300">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const BudgetOverview = () => {
  const [expenses, setExpenses] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch expenses from the API
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8070/budget');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        const expensesData = Array.isArray(data.expenses) ? data.expenses : [];
        
        setExpenses(expensesData);
        
        // Extract unique categories from expenses
        const uniqueCategories = [...new Set(expensesData.map(expense => expense.category))];
        setCategories(uniqueCategories);
        
        const groupedExpenses = groupExpensesByMonth(expensesData);
        setMonthlyExpenses(groupedExpenses);
        setError(null);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setError('Failed to load expenses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpenses();
  }, []);

  const groupExpensesByMonth = (expenses) => {
    const monthsMap = new Map();
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const key = `${year}-${month}`;
      
      if (!monthsMap.has(key)) {
        monthsMap.set(key, {
          month,
          year,
          monthName: date.toLocaleString('default', { month: 'long' }),
          expenses: []
        });
      }
      
      monthsMap.get(key).expenses.push(expense);
    });
    
    return Array.from(monthsMap.values())
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });
  };

  const handleGeneratePDF = (monthData) => {
    const totalOverall = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    generateHomeStockPDF(monthData.expenses, monthData.month, monthData.year, totalOverall);
    
    // Show confetti effect
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleBack = () => {
    console.log('Going back to previous page');
    // In a real app we would use navigation like:
    // navigate(-1);
    alert('Going back to previous page');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 flex justify-center items-center">
        <div className="relative">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-t-4 border-purple-500 border-solid rounded-full animate-ping absolute top-0 opacity-30"></div>
        </div>
        <p className="text-2xl text-gray-300 ml-4">Loading Expenses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 flex justify-center items-center">
        <div className="bg-gray-800/50 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-gray-700/50 max-w-lg mx-auto text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalExpensesAmount = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  
  // Budget target value - this could be fetched from a settings API in a real app
  const budgetTarget = 15000;

  // Calculate the category percentages dynamically from the actual data
  const categoryData = categories.map(category => {
    const categoryTotal = expenses
      .filter(exp => exp.category === category)
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const percentage = totalExpensesAmount > 0 ? (categoryTotal / totalExpensesAmount) * 100 : 0;
    
    return {
      name: category,
      total: categoryTotal,
      percentage
    };
  }).sort((a, b) => b.total - a.total); // Sort by highest amount first

  // Color map for categories - will assign colors dynamically based on order
  const categoryColors = [
    'bg-green-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-red-500',
    'bg-cyan-500'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white relative">
      {/* Animated particles background */}
      <FloatingParticles />
      
      {showSuccess && <SuccessConfetti />}
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto py-12">
        <div className="bg-gray-800/50 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-gray-700/50 mx-4">
          <h1 className="text-4xl font-bold text-center text-white mb-8 flex items-center justify-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Monthly Expense Overview
            </span>
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search by month..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-10 py-3 w-full border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-700/60 text-gray-200 transition-all duration-300"
              />
              <svg className="absolute right-3 top-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {monthlyExpenses
            .filter(monthData => 
              monthData.monthName.toLowerCase().includes(searchTerm.toLowerCase().trim())
            )
            .map((monthData) => (
              <MonthlyExpenseCard
                key={`${monthData.year}-${monthData.month}`}
                monthData={monthData}
                onGeneratePDF={() => handleGeneratePDF(monthData)}
              />
            ))}
          
          {monthlyExpenses.length === 0 && (
            <div className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-600/30 shadow-lg">
              <div className="w-20 h-20 rounded-full bg-gray-600/50 mx-auto flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-gray-300 text-lg">No expenses found. Add some expenses to get started!</p>
            </div>
          )}

          <div className="mt-8 bg-gradient-to-r from-gray-800/70 to-indigo-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-600/50 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Overall Summary</h2>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-300">Total Expenses</span>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                LKR {totalExpensesAmount.toFixed(2)}
              </span>
            </div>
            
            <div className="mt-4 bg-gray-900/30 h-3 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                style={{ width: `${Math.min(100, (totalExpensesAmount / budgetTarget) * 100)}%` }}
              ></div>
            </div>
            
            <div className="mt-4 flex justify-between text-sm text-gray-400">
              <span>0</span>
              <span>Budget Progress</span>
              <span>{budgetTarget.toLocaleString()}</span>
            </div>
            
            {/* Category breakdown - dynamically generated from actual data */}
            <div className="mt-6 pt-4 border-t border-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-200 mb-3">Category Breakdown</h3>
              <div className="space-y-3">
                {categoryData.map((category, index) => (
                  <div key={category.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300">{category.name}</span>
                      <span className="text-gray-300">{category.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-gray-900/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${categoryColors[index % categoryColors.length]}`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-sm mt-6">
          © 2025 Home Stock Pro. All rights reserved.
        </div>
      </div>
      
      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(5%, 5%) rotate(5deg);
          }
          66% {
            transform: translate(-5%, 2%) rotate(-5deg);
          }
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
        }
        
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
            scale: 0;
          }
          10% {
            opacity: 1;
            scale: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default BudgetOverview;