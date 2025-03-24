import React, { useState, useEffect } from 'react'; // Import useState and useEffect from React
import { Edit, Trash, Eye } from 'lucide-react'; // Import the icons

const BudgetOverview = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Handle Update functionality (implement according to your needs)
  const handleUpdate = (expenseId) => {
    console.log('Update expense with ID:', expenseId);
    // You can redirect to a form for editing the expense or display a modal
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

  // Handle View functionality (implement according to your needs)
  const handleView = (expenseId) => {
    console.log('View expense with ID:', expenseId);
    // You can display a modal or navigate to a new route with more details
  };

  if (loading) {
    return <p className="text-center text-lg text-gray-600 mt-8">Loading...</p>;
  }

  return (
    <div className="py-8 px-4 max-w-screen-xl mx-auto bg-gray-100">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        Expense Overview
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-lg overflow-x-auto">
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
            {expenses.length > 0 ? (
              expenses.map((expense, index) => (
                <tr
                  key={expense._id}
                  className={`border-b border-gray-200 ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
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
                <td
                  colSpan="5"
                  className="py-4 px-6 text-center text-gray-600 text-sm"
                >
                  No expenses available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetOverview;
