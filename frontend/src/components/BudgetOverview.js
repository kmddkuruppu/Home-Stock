import React, { useState, useEffect } from 'react'; // Import useState and useEffect from React
import { Edit, Trash, Eye } from 'lucide-react'; // Import the icons
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { Bar } from 'react-chartjs-2'; // Import the Bar chart from Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { jsPDF } from 'jspdf'; // Import jsPDF
import html2canvas from 'html2canvas'; // Import html2canvas

// Register chart elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BudgetOverview = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const navigate = useNavigate(); // Initialize useNavigate hook for navigation

  // Fetch expenses data from the server
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/getExpense');
        const data = await response.json();

        if (Array.isArray(data.response)) {
          setExpenses(data.response);
        } else {
          console.error('API response does not contain an array:', data);
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
    console.log('Update expense with ID:', expenseId);
    navigate(`/updateExpense/${expenseId}`);
  };

  // Handle Delete functionality
  const handleDelete = async (expenseId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/deleteExpense/${expenseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Expense deleted');
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
    console.log('View expense with ID:', expenseId);
  };

  // Filter expenses based on search term
  const filteredExpenses = expenses.filter((expense) => {
    return (
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.amount.toString().includes(searchTerm)
    );
  });

  // Prepare data for the bar chart
  const chartData = {
    labels: [...new Set(expenses.map((expense) => expense.category))], // Unique categories
    datasets: [
      {
        label: 'Expenses by Category',
        data: [...new Set(expenses.map((expense) => expense.category))].map((category) => {
          return expenses
            .filter((expense) => expense.category === category)
            .reduce((total, expense) => total + parseFloat(expense.amount), 0);
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
        text: 'Expenses by Category',
      },
    },
  };

  // Function to generate the PDF with adjusted layout
  const generatePDF = () => {
    // Capture the content of the table and the chart
    const content = document.getElementById('pdfContent');
    
    // Use html2canvas to convert the content to an image
    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/png'); // Convert canvas to image data
      const doc = new jsPDF('p', 'mm', 'a4'); // Set PDF layout (portrait, millimeters, A4 size)

      // Add the image to the PDF
      doc.addImage(imgData, 'PNG', 10, 10, 190, 150); // Adjust the position and size to fit content within page

      // Add text for the title
      doc.setFontSize(16);
      doc.text('Expense Report Overview', 10, 170); // Title for the report

      // Save the PDF with a filename
      doc.save('expense_report.pdf');
    });
  };

  if (loading) {
    return <p className="text-center text-lg text-gray-600 mt-8">Loading...</p>;
  }

  return (
    <div className="py-8 px-4 max-w-screen-xl mx-auto bg-gray-100">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Expense Overview</h1>

      {/* Backward Navigation Button */}
      <div className="mb-6 text-left">
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600"
        >
          Back
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* PDF Generation Button */}
      <div className="mb-6 text-center">
        <button
          onClick={generatePDF}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
        >
          Generate PDF Report
        </button>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg overflow-x-auto" id="pdfContent">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Expenses List</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Amount</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Category</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Description</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Date</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense, index) => (
                <tr
                  key={expense._id}
                  className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="py-4 px-6 text-gray-700 text-sm">${expense.amount}</td>
                  <td className="py-4 px-6 text-gray-700 text-sm">{expense.category}</td>
                  <td className="py-4 px-6 text-gray-700 text-sm">{expense.description}</td>
                  <td className="py-4 px-6 text-gray-700 text-sm">{expense.date}</td>

                  {/* Actions column with icons */}
                  <td className="py-4 px-6 flex space-x-4 text-gray-700 text-sm">
                    <button
                      onClick={() => handleView(expense._id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleUpdate(expense._id)}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 px-6 text-center text-gray-600 text-sm">
                  No expenses available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <div className="mb-8">
        <Bar data={chartData} options={chartOptions} style={{ width: '60%', height: '250px' }} />
      </div>
    </div>
  );
};

export default BudgetOverview;
