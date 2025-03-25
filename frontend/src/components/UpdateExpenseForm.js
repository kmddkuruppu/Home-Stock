import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Navbar from './Navbar'; // Import the Navbar component

const UpdateExpense = () => {
  const categories = [
    'Groceries',
    'Household Essentials',
    'Cleaning Supplies',
    'Personal Care',
    'Other',
  ];

  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    sliderValue: 0, // Slider state for amount
  });

  const { expenseId } = useParams(); // Get expense ID from URL
  const navigate = useNavigate(); // Navigation for redirecting after submission

  // Fetch existing expense data for the specified ID
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/getExpenseById/${expenseId}`);
        if (!response.ok) {
          throw new Error('Expense not found');
        }

        const data = await response.json();
        setFormData({
          amount: data.amount,
          category: data.category,
          description: data.description,
          date: data.date,
          sliderValue: data.amount, // Set slider value to the current expense amount
        });
      } catch (error) {
        console.error('Error fetching expense:', error);
      }
    };

    fetchExpense();
  }, [expenseId]);

  // Handle form submission to update the expense
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
        alert('Expense updated successfully!');
        navigate('/display'); // Redirect to the main page or the expense overview
      } else {
        throw new Error('Failed to update expense');
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('Failed to update expense');
    }
  };

  // Handle slider value change
  const handleSliderChange = (e) => {
    setFormData({ ...formData, sliderValue: e.target.value, amount: e.target.value });
  };

  return (
    <div>
      <Navbar /> {/* Include the Navbar component here */}
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Expense</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 relative"
        >
          <div className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <div className="relative mt-2">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</div>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Slider Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount Slider</label>
              <input
                type="range"
                min="0"
                max="1000"
                value={formData.sliderValue}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-full mt-2"
              />
              <div className="flex justify-between text-sm text-gray-700 mt-2">
                <span>$0</span>
                <span>${formData.sliderValue}</span>
                <span>$1000</span>
              </div>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Date Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Update Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateExpense;
