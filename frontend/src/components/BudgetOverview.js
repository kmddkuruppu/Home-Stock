import React, { useState, useEffect } from 'react'; 
import { Edit, Trash, Eye, FileText } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { jsPDF } from 'jspdf'; 

// Register chart elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Enhanced PDF Generation Function
const generateEnhancedPDF = (expenses, companyLogoPath = null) => {
  // Create a new jsPDF instance with increased precision
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Document Dimensions and Margins
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const marginLeft = 15;
  const marginRight = 15;
  const marginTop = 15;
  const contentWidth = pageWidth - marginLeft - marginRight;

  // Professional Color Palette
  const colors = {
    background: [248, 249, 250],     // Soft off-white
    primaryHeader: [41, 128, 185],   // Professional Blue
    secondaryHeader: [52, 152, 219], // Lighter Blue
    textDark: [44, 62, 80],          // Dark Navy
    textLight: [127, 140, 141],      // Soft Gray
    rowAlternate: [241, 243, 245]    // Very Light Gray
  };

  // Background with subtle gradient effect
  doc.setFillColor(...colors.background);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header with Gradient Effect
  doc.setFillColor(...colors.primaryHeader);
  doc.rect(0, 0, pageWidth, 25, 'F');

  // Company Logo (if provided)
  if (companyLogoPath) {
    try {
      doc.addImage(
        companyLogoPath, 
        'PNG', 
        pageWidth - marginRight - 30, 
        marginTop, 
        25, 
        20
      );
    } catch (error) {
      console.error('Error adding logo:', error);
    }
  }

  // Report Title
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('Comprehensive Expense Report', pageWidth / 2, 20, { align: 'center' });

  // Date and Time
  doc.setFontSize(10);
  doc.setTextColor(...colors.textLight);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - marginRight, 30, { align: 'right' });

  // Calculation of Financial Metrics
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const averageExpense = totalExpenses / expenses.length;
  const highestExpense = Math.max(...expenses.map(e => parseFloat(e.amount)));

  // Financial Summary Section
  doc.setFillColor(...colors.secondaryHeader);
  doc.rect(marginLeft, 40, contentWidth, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text('Financial Summary', pageWidth / 2, 48, { align: 'center' });

  // Metrics Display with precise alignment
  doc.setTextColor(...colors.textDark);
  doc.setFontSize(10);
  [
    `Total Expenses: Rs. ${totalExpenses.toFixed(2)}`,
    `Average Expense: Rs. ${averageExpense.toFixed(2)}`,
    `Highest Expense: Rs. ${highestExpense.toFixed(2)}`
  ].forEach((text, index) => {
    doc.text(text, marginLeft + 5, 60 + (index * 6));
  });

  // Precise Column Widths and Positions
  const columns = {
    date: { x: marginLeft + 10, width: 30 },
    category: { x: marginLeft + 50, width: 40 },
    description: { x: marginLeft + 100, width: 50 },
    amount: { x: pageWidth - marginRight - 30, width: 30, align: 'right' }
  };

  // Expense Details Table Header with Gradient
  doc.setFillColor(...colors.secondaryHeader);
  doc.rect(marginLeft, 80, contentWidth, 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('Date', columns.date.x, 87);
  doc.text('Category', columns.category.x, 87);
  doc.text('Description', columns.description.x, 87);
  doc.text('Amount (Rs.)', columns.amount.x, 87, { align: 'right' });

  // Truncate text utility function
  const truncateText = (text, maxLength) => 
    text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

  // Expenses Table with Enhanced Precise Alignment
  expenses.forEach((expense, index) => {
    const yPosition = 95 + (index * 7);
    
    // Alternate row background with soft gradient
    doc.setFillColor(...(index % 2 ? colors.rowAlternate : [255, 255, 255]));
    doc.rect(marginLeft, yPosition - 1, contentWidth, 7, 'F');

    doc.setTextColor(...colors.textDark);
    doc.setFontSize(9);  // Slightly smaller font for better fit

    // Precise text placement with truncation
    doc.text(
      new Date(expense.date).toLocaleDateString(), 
      columns.date.x, 
      yPosition
    );
    doc.text(
      expense.category, 
      columns.category.x, 
      yPosition
    );
    doc.text(
      truncateText(expense.description, 25), 
      columns.description.x, 
      yPosition
    );
    doc.text(
      expense.amount.toFixed(2), 
      columns.amount.x, 
      yPosition, 
      { align: 'right' }
    );
  });

  // Category Distribution Section
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  doc.setFillColor(...colors.secondaryHeader);
  doc.rect(marginLeft, pageHeight - 30, contentWidth, 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.text('Expense Category Distribution', pageWidth / 2, pageHeight - 23, { align: 'center' });

  doc.setTextColor(...colors.textDark);
  let categoryText = Object.entries(categoryTotals)
    .map(([category, total]) => `${category}: Rs. ${total.toFixed(2)}`)
    .join(' | ');
  
  doc.setFontSize(8);
  doc.text(categoryText, pageWidth / 2, pageHeight - 16, { align: 'center' });

  // Footer
  doc.setFillColor(...colors.primaryHeader);
  doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('© 2024 Expense Tracking System', pageWidth / 2, pageHeight - 3, { align: 'center' });

  // Save PDF
  doc.save('professional_expense_report.pdf');
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