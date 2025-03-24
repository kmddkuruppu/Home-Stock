import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const UpdateExpenseForm = () => {
  const { expenseId } = useParams(); // Get expense ID from URL
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: '',
  });

  // Fetch the expense details by ID
  useEffect(() => {
    const fetchExpenseDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/getExpense/${expenseId}`);
        const data = await response.json();
        setExpense(data.response);
        setFormData({
          amount: data.response.amount,
          category: data.response.category,
          description: data.response.description,
          date: data.response.date,
        });
      } catch (error) {
        console.error('Error fetching expense details:', error);
      }
    };

    fetchExpenseDetails();
  }, [expenseId]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submit to update the expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/updateExpense/${expenseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Expense updated successfully');
        navigate('/'); // Navigate back to the BudgetOverview page
      } else {
        console.error('Failed to update expense');
      }
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  if (!expense) {
    return <p>Loading expense details...</p>;
  }

  return (
    <div className="py-8 px-4 max-w-screen-xl mx-auto bg-gray-100">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        Update Expense
      </h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Update Expense
        </button>
      </form>
    </div>
  );
};

export default UpdateExpenseForm;
