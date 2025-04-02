import React, { useState, useEffect } from 'react';
import { Edit, Trash, Eye, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../logo.png';

// Register chart elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// PDF Generation Function (unchanged)
const generateHomeStockPDF = (expenses) => {
  // ... (keep the same PDF generation code)
};

// Dark Theme Bar Chart Component
const ExpenseBarChart = ({ expenses }) => {
  const chartData = {
    labels: [...new Set(expenses.map((expense) => expense.category))],
    datasets: [{
      label: 'Expenses by Category',
      data: [...new Set(expenses.map((expense) => expense.category))].map((category) => {
        return expenses
          .filter((expense) => expense.category === category)
          .reduce((total, expense) => total + parseFloat(expense.amount), 0);
      }),
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(153, 102, 255, 0.6)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Expenses Distribution by Category',
        font: { size: 16 },
        color: '#e5e7eb' // Light text for dark theme
      },
      legend: { 
        display: true, 
        position: 'top',
        labels: {
          color: '#e5e7eb' // Light text for dark theme
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { 
          display: true, 
          text: 'Amount (LKR)',
          color: '#e5e7eb' // Light text for dark theme
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.1)' // Light grid with low opacity
        },
        ticks: {
          color: '#e5e7eb' // Light text for dark theme
        }
      },
      x: {
        grid: {
          color: 'rgba(229, 231, 235, 0.1)' // Light grid with low opacity
        },
        ticks: {
          color: '#e5e7eb' // Light text for dark theme
        }
      }
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6 border border-gray-700">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

// Main BudgetOverview Component with Dark Theme
const BudgetOverview = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch expenses data (unchanged)
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('http://localhost:8070/budget');
        const data = await response.json();
        setExpenses(Array.isArray(data.expenses) ? data.expenses : []);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  // Handler functions (unchanged)
  const handleUpdate = (expenseId) => {
    navigate(`/updateExpense/${expenseId}`);
  };

  const handleDelete = async (expenseId) => {
    try {
      const response = await fetch(`http://localhost:8070/budget/delete/${expenseId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setExpenses(prev => prev.filter(expense => expense._id !== expenseId));
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleView = (expenseId) => {
    navigate(`/viewExpense/${expenseId}`);
  };

  const handleGeneratePDF = () => {
    generateHomeStockPDF(filteredExpenses);
  };

  const filteredExpenses = expenses.filter((expense) => {
    return (
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.amount.toString().includes(searchTerm)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-2xl text-gray-300">Loading Expenses...</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-screen-xl mx-auto bg-gray-900 min-h-screen">
      <div className="bg-gray-800 shadow-xl rounded-lg p-8 border border-gray-700">
        <h1 className="text-4xl font-bold text-center text-gray-100 mb-8">
          Expense Overview
        </h1>

        {/* Top Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition"
          >
            Back
          </button>

          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-600 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-200"
            />

            <button
              onClick={handleGeneratePDF}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              <FileText className="mr-2" size={20} />
              Generate PDF
            </button>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md border border-gray-700">
          <table className="w-full table-auto">
            <thead className="bg-gray-700 border-b border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-gray-300">Amount (LKR)</th>
                <th className="px-6 py-4 text-left text-gray-300">Category</th>
                <th className="px-6 py-4 text-left text-gray-300">Description</th>
                <th className="px-6 py-4 text-left text-gray-300">Date</th>
                <th className="px-6 py-4 text-left text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense, index) => (
                  <tr 
                    key={expense._id} 
                    className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'} hover:bg-gray-700 transition`}
                  >
                    <td className="px-6 py-4 text-gray-300">Rs. {expense.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-300">{expense.category}</td>
                    <td className="px-6 py-4 text-gray-300">{expense.description}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 flex space-x-3">
                      <button 
                        onClick={() => handleView(expense._id)} 
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Eye size={20} />
                      </button>
                      <button 
                        onClick={() => handleUpdate(expense._id)} 
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        <Edit size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(expense._id)} 
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No expenses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Expense Bar Chart */}
        <ExpenseBarChart expenses={expenses} />
      </div>
    </div>
  );
};

export default BudgetOverview;