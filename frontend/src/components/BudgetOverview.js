import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle, TrendingUp, ArrowLeft, Search, Filter, Calendar, DollarSign, Tag, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../logo.png';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Particle animation for success message
const SuccessParticles = () => (
  <>
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        className={`absolute rounded-full bg-gradient-to-r ${
          ['from-green-400 to-teal-500', 'from-blue-400 to-indigo-500', 'from-purple-400 to-pink-500', 'from-amber-300 to-yellow-500'][Math.floor(Math.random() * 4)]
        }`}
        initial={{
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          width: Math.random() * 12 + 4,
          height: Math.random() * 12 + 4,
          opacity: 0,
          scale: 0
        }}
        animate={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          opacity: [0, 1, 0.8, 0],
          scale: [0, 1, 0.8]
        }}
        transition={{
          duration: Math.random() * 3 + 1.5,
          delay: Math.random() * 0.5,
          ease: "easeOut"
        }}
      />
    ))}
  </>
);

// Modernized Delete Confirmation Modal
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-xl p-8 w-96 border border-gray-700 shadow-2xl"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-red-500 bg-opacity-20 rounded-full">
            <AlertTriangle size={28} className="text-red-500" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-100 mb-3 text-center">Delete Expense</h3>
        <p className="text-gray-300 mb-8 text-center">Are you sure you want to delete this expense? This action cannot be undone.</p>
        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-700 text-white rounded-lg border border-gray-600 shadow-md hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-200"
          >
            Delete
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const generateHomeStockPDF = (expenses) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  doc.addImage(logo, 'PNG', 14, 20, 20, 20);
  doc.setFontSize(17);
  doc.text('WELCOME TO', 40, 27);
  doc.setFontSize(24);
  doc.text('HOME STOCK PRO', 40, 38);
  doc.setFontSize(20);
  doc.text('Expense Management Report', 14, 50);

  const date = new Date();
  doc.setFontSize(12);
  doc.text(`Generated on: ${date.toLocaleString()}`, 14, 60);

  const contactInfo = `Contact: +94 77 123 4567\nEmail: homestockpro@gmail.com\nAddress: 45 Main Avenue, Colombo\nSri Lanka`;
  doc.setFontSize(11);
  doc.text(contactInfo, 195, 75, { align: 'right' });

  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  
  doc.setFontSize(14);
  doc.text('Financial Summary', 14, 75);
  doc.setFontSize(11);
  doc.text(`Total Expenses: Rs. ${totalExpenses.toFixed(2)}`, 14, 82);
  doc.text(`Average Expense: Rs. ${averageExpense.toFixed(2)}`, 14, 88);

  const tableColumn = ["Category", "Description", "Amount (Rs.)", "Date"];
  const tableRows = expenses.map(expense => [
    expense.category,
    expense.description.length > 30 ? expense.description.substring(0, 30) + '...' : expense.description,
    expense.amount.toFixed(2),
    new Date(expense.date).toLocaleDateString(),
  ]);

  autoTable(doc, {
    startY: 95,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { 
      fillColor: [28, 102, 130],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: { fillColor: [239, 239, 239] },
    styles: { 
      fontSize: 10, 
      cellPadding: 3,
      textColor: [0, 0, 0]
    },
    columnStyles: {
      2: { halign: 'right' }
    }
  });

  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.text('Generated by Home Stock Pro System', 105, pageHeight - 10, { align: 'center' });

  doc.save('Expense_Management_Report.pdf');
};

// Modernized Bar Chart component
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
        'rgba(99, 102, 241, 0.7)',   // Indigo
        'rgba(168, 85, 247, 0.7)',   // Purple
        'rgba(236, 72, 153, 0.7)',   // Pink
        'rgba(248, 113, 113, 0.7)',  // Red
        'rgba(251, 146, 60, 0.7)',   // Orange
        'rgba(250, 204, 21, 0.7)',   // Yellow
        'rgba(34, 197, 94, 0.7)',    // Green
        'rgba(20, 184, 166, 0.7)',   // Teal
        'rgba(6, 182, 212, 0.7)',    // Cyan
      ],
      borderColor: [
        'rgba(99, 102, 241, 1)',
        'rgba(168, 85, 247, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(248, 113, 113, 1)',
        'rgba(251, 146, 60, 1)',
        'rgba(250, 204, 21, 1)',
        'rgba(34, 197, 94, 1)',
        'rgba(20, 184, 166, 1)',
        'rgba(6, 182, 212, 1)',
      ],
      borderWidth: 2,
      borderRadius: 8,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Expenses Distribution by Category',
        font: { size: 18, family: 'Inter, sans-serif', weight: 'bold' },
        color: '#e5e7eb',
        padding: 20
      },
      legend: { 
        display: true, 
        position: 'top',
        labels: {
          color: '#e5e7eb',
          padding: 20,
          font: {
            family: 'Inter, sans-serif',
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleFont: {
          family: 'Inter, sans-serif',
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          family: 'Inter, sans-serif',
          size: 13
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
        borderColor: 'rgba(75, 85, 99, 0.5)',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { 
          display: true, 
          text: 'Amount (LKR)',
          color: '#e5e7eb',
          font: {
            family: 'Inter, sans-serif',
            size: 14
          }
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: '#e5e7eb',
          font: {
            family: 'Inter, sans-serif'
          },
          callback: function(value) {
            return 'Rs. ' + value;
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.1)',
          display: false
        },
        ticks: {
          color: '#e5e7eb',
          font: {
            family: 'Inter, sans-serif'
          }
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl mt-8 border border-gray-700">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, colorClass }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
      className={`${colorClass} rounded-xl p-6 shadow-lg flex items-center`}
    >
      <div className="mr-4 p-3 rounded-full bg-white bg-opacity-20">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-medium text-white opacity-80">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
};

// Success Toast Component
const SuccessToast = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, y: -50 }}
    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div className="relative z-10 w-full max-w-md px-6 py-10 flex flex-col items-center bg-gray-800 rounded-xl border border-gray-700 shadow-2xl">
      <SuccessParticles />
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ 
          scale: [0, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-5 mb-8 shadow-xl"
      >
        <CheckCircle className="w-14 h-14 text-white" />
      </motion.div>
      
      <motion.h2 
        className="text-3xl font-bold mb-2 text-center text-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Successfully Deleted!
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <p className="text-gray-300 text-lg mb-6">
          The expense has been permanently removed.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ delay: 0.8, duration: 2.5 }}
        className="w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-green-500 rounded-full mt-8"
      />
    </div>
  </motion.div>
);

// Empty state component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-6">
      <DollarSign size={40} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-300 mb-2">No expenses found</h3>
    <p className="text-gray-400 max-w-md mb-8">
      Start tracking your expenses by adding new records to visualize your spending patterns.
    </p>
    <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
      Add New Expense
    </button>
  </div>
);

// Main Component
const BudgetOverview = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

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
        setShowSuccessToast(true);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleView = (expenseId) => {
    navigate(`/viewExpense/${expenseId}`);
  };

  const handleGeneratePDF = () => {
    generateHomeStockPDF(filteredExpenses);
  };

  const openDeleteModal = (expenseId) => {
    setSelectedExpenseId(expenseId);
    setShowDeleteModal(true);
  };

  const filteredExpenses = expenses.filter((expense) => {
    return (
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.amount.toString().includes(searchTerm)
    );
  });
  
  // Calculate stats
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const averageExpense = filteredExpenses.length > 0 ? totalExpenses / filteredExpenses.length : 0;
  const highestExpense = filteredExpenses.length > 0 
    ? Math.max(...filteredExpenses.map(expense => parseFloat(expense.amount)))
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-xl text-gray-300">Loading Expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 md:px-8 max-w-screen-xl mx-auto bg-gray-900 min-h-screen">
      <AnimatePresence>
        {showDeleteModal && (
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => handleDelete(selectedExpenseId)}
          />
        )}
        
        {showSuccessToast && <SuccessToast />}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl rounded-2xl p-8 border border-gray-700"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Expense Dashboard
            </h1>
            <p className="text-gray-400">Manage and analyze your spending patterns</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 transition flex items-center"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </motion.button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            title="Total Expenses" 
            value={`Rs. ${totalExpenses.toFixed(2)}`} 
            icon={<DollarSign size={24} className="text-white" />}
            colorClass="bg-gradient-to-br from-blue-600 to-indigo-700"
          />
          <StatsCard 
            title="Average Expense" 
            value={`Rs. ${averageExpense.toFixed(2)}`} 
            icon={<TrendingUp size={24} className="text-white" />}
            colorClass="bg-gradient-to-br from-purple-600 to-indigo-700"
          />
          <StatsCard 
            title="Highest Expense" 
            value={`Rs. ${highestExpense.toFixed(2)}`} 
            icon={<Tag size={24} className="text-white" />}
            colorClass="bg-gradient-to-br from-pink-600 to-purple-700"
          />
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-gray-200"
              />
            </div>

            <div className="flex items-center space-x-4 w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                <Filter size={18} className="mr-2" />
                Filter
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGeneratePDF}
                className="flex items-center px-4 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
              >
                <FileText size={18} className="mr-2" />
                Export PDF
              </motion.button>
            </div>
          </div>

          {filteredExpenses.length > 0 ? (
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full table-auto">
                <thead className="bg-gray-700 border-b border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-300 font-semibold">Amount (LKR)</th>
                    <th className="px-6 py-4 text-left text-gray-300 font-semibold">Category</th>
                    <th className="px-6 py-4 text-left text-gray-300 font-semibold">Description</th>
                    <th className="px-6 py-4 text-left text-gray-300 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense, index) => (
                    <motion.tr 
                      key={expense._id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/50'} hover:bg-gray-700 transition`}
                    >
                      <td className="px-6 py-4 text-left">
                        <span className="font-mono font-medium text-green-400">Rs. {expense.amount.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-left">
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-left text-gray-300">{expense.description}</td>
                      <td className="px-6 py-4 text-left">
                        <div className="flex items-center">
                          <Calendar size={16} className="text-gray-400 mr-2" />
                          <span className="text-gray-300">{new Date(expense.date).toLocaleDateString()}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            
              {/* Total Expenses Summary */}
              <div className="flex justify-between items-center bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4 rounded-b-lg">
                <span className="text-lg font-semibold text-gray-300">Total Expenses</span>
                <span className="text-xl font-bold text-green-400">
                  Rs. {totalExpenses.toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        <ExpenseBarChart expenses={expenses} />
      </motion.div>
    </div>
  );
};

export default BudgetOverview;