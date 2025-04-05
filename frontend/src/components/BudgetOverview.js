import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash, Eye, FileText, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../logo.png';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const particleColors = [
  'from-green-400 to-emerald-500',
  'from-blue-400 to-cyan-500',
  'from-purple-400 to-indigo-500',
  'from-yellow-400 to-amber-500',
];

const SuccessConfetti = () => (
  <>
    {[...Array(100)].map((_, i) => (
      <motion.div
        key={i}
        className={`absolute rounded-md bg-gradient-to-r ${
          particleColors[Math.floor(Math.random() * particleColors.length)]
        }`}
        initial={{
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          width: Math.random() * 10 + 5,
          height: Math.random() * 10 + 5,
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

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96 border border-gray-700 animate-fade-in">
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
      fillColor: [71, 201, 255],
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
        color: '#e5e7eb'
      },
      legend: { 
        display: true, 
        position: 'top',
        labels: {
          color: '#e5e7eb'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { 
          display: true, 
          text: 'Amount (LKR)',
          color: '#e5e7eb'
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.1)'
        },
        ticks: {
          color: '#e5e7eb'
        }
      },
      x: {
        grid: {
          color: 'rgba(229, 231, 235, 0.1)'
        },
        ticks: {
          color: '#e5e7eb'
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-2xl text-gray-300">Loading Expenses...</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-screen-xl mx-auto bg-gray-900 min-h-screen">
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => handleDelete(selectedExpenseId)}
      />

      {showSuccessToast && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="relative z-10 w-full max-w-md px-6 py-10 flex flex-col items-center bg-gray-800 rounded-lg border border-gray-700"
          >
            <SuccessConfetti />
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-5 mb-8 shadow-xl shadow-emerald-600/30"
            >
              <svg 
                className="w-14 h-14 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </svg>
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
              <p className="text-gray-300/90 text-lg mb-6">
                The expense has been permanently removed.
              </p>
              <p className="text-indigo-300/90">
                Updating expense list...
              </p>
            </motion.div>
            
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.8, duration: 2.5 }}
              className="w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-green-500 rounded-full mt-8"
            />
          </motion.div>
        </div>
      )}

      <div className="bg-gray-800 shadow-xl rounded-lg p-8 border border-gray-700">
        <h1 className="text-4xl font-bold text-center text-gray-100 mb-8">
          Expense Overview
        </h1>

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
                        onClick={() => openDeleteModal(expense._id)} 
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

        <ExpenseBarChart expenses={expenses} />
      </div>
    </div>
  );
};

export default BudgetOverview;