import React, { useState, useEffect } from 'react'; 
import { Edit, Trash, Eye, FileText } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { jsPDF } from 'jspdf'; 
// Remove html2canvas import since it's not being used
// import html2canvas from 'html2canvas'; 

// Rest of the code remains the same as the original implementation
// ... [previous code continues]

// Register chart elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Enhanced PDF Generation Function
const generateEnhancedPDF = (expenses) => {
  // Create a new jsPDF instance
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // Set background color and header
  doc.setFillColor(240, 240, 240); // Light gray background
  doc.rect(0, 0, 210, 297, 'F');
  
  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(33, 33, 33);
  doc.text('Expense Report', 105, 20, { align: 'center' });
  
  // Subheader with date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
  
  // Summary Statistics
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const averageExpense = totalExpenses / expenses.length;
  const highestExpense = Math.max(...expenses.map(e => parseFloat(e.amount)));
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary Statistics', 20, 50);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Total Expenses: Rs. ${totalExpenses.toFixed(2)}`, 20, 60);
  doc.text(`Average Expense: Rs. ${averageExpense.toFixed(2)}`, 20, 67);
  doc.text(`Highest Expense: Rs. ${highestExpense.toFixed(2)}`, 20, 74);
  
  // Expense Details Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Expense Details', 20, 90);
  
  // Table Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Amount', 20, 100, { align: 'left' });
  doc.text('Category', 50, 100, { align: 'left' });
  doc.text('Description', 80, 100, { align: 'left' });
  doc.text('Date', 140, 100, { align: 'left' });
  
  // Table Rows
  doc.setFont('helvetica', 'normal');
  expenses.forEach((expense, index) => {
    const yPosition = 110 + (index * 7);
    doc.text(`Rs. ${expense.amount.toFixed(2)}`, 20, yPosition, { align: 'left' });
    doc.text(expense.category, 50, yPosition, { align: 'left' });
    doc.text(expense.description, 80, yPosition, { align: 'left' });
    doc.text(new Date(expense.date).toLocaleDateString(), 140, yPosition, { align: 'left' });
  });
  
  
  // Footer
  doc.setTextColor(100);
  doc.setFontSize(10);
  doc.text('Expense Tracking System', 105, 290, { align: 'center' });
  
  // Save the PDF
  doc.save('comprehensive_expense_report.pdf');
};

// Bar Chart Component
const ExpenseBarChart = ({ expenses }) => {
  // Prepare data for the bar chart
  const chartData = {
    labels: [...new Set(expenses.map((expense) => expense.category))], 
    datasets: [
      {
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
      },
    ],
  };

  // Chart.js options
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Expenses Distribution by Category',
        font: {
          size: 16
        }
      },
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (LKR)'
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

// Main BudgetOverview Component
const BudgetOverview = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); 
  const navigate = useNavigate(); 

  // Fetch expenses data from the server
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('http://localhost:8070/budget'); 
        const data = await response.json();

        if (Array.isArray(data.expenses)) {
          setExpenses(data.expenses);
        } else {
          console.error('API response does not contain an expenses array:', data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Handle Update functionality
  const handleUpdate = (expenseId) => {
    navigate(`/updateExpense/${expenseId}`);
  };

  // Handle Delete functionality
  const handleDelete = async (expenseId) => {
    try {
      const response = await fetch(`http://localhost:8070/budget/delete/${expenseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setExpenses((prevExpenses) =>
          prevExpenses.filter((expense) => expense._id !== expenseId)
        );
      } else {
        console.error('Failed to delete the expense');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  // Handle View functionality
  const handleView = (expenseId) => {
    navigate(`/viewExpense/${expenseId}`);
  };

  // Handle PDF Generation
  const handleGeneratePDF = () => {
    generateEnhancedPDF(expenses);
  };

  // Filter expenses based on search term
  const filteredExpenses = expenses.filter((expense) => {
    return (
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.amount.toString().includes(searchTerm)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-gray-600">Loading Expenses...</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-screen-xl mx-auto bg-gray-50">
      <div className="bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Expense Overview
        </h1>

        {/* Top Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition"
          >
            Back
          </button>

          <div className="flex items-center space-x-4">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* PDF Generation Button */}
            <button
              onClick={handleGeneratePDF}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
            >
              <FileText className="mr-2" size={20} />
              Generate PDF
            </button>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-gray-600">Amount (LKR)</th>
                <th className="px-6 py-4 text-left text-gray-600">Category</th>
                <th className="px-6 py-4 text-left text-gray-600">Description</th>
                <th className="px-6 py-4 text-left text-gray-600">Date</th>
                <th className="px-6 py-4 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense, index) => (
                  <tr 
                    key={expense._id} 
                    className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition`}
                  >
                    <td className="px-6 py-4 text-gray-700">Rs. {expense.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-700">{expense.category}</td>
                    <td className="px-6 py-4 text-gray-700">{expense.description}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 flex space-x-3">
                      <button 
                        onClick={() => handleView(expense._id)} 
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Eye size={20} />
                      </button>
                      <button 
                        onClick={() => handleUpdate(expense._id)} 
                        className="text-yellow-500 hover:text-yellow-700"
                      >
                        <Edit size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(expense._id)} 
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
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