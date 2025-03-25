import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const ExpenseForm = () => {
  const categories = [
    'Groceries',
    'Household Essentials',
    'Cleaning Supplies',
    'Personal Care',
    'Other'
  ];

  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: today,
    sliderValue: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8070/budget/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: today // Force today's date on submission
        }),
      });

      const data = await response.json();
      console.log('Expense added:', data);
      alert('Expense added successfully!');
      
      // Reset form (keeping today's date)
      setFormData({
        amount: '',
        category: '',
        description: '',
        date: today,
        sliderValue: 0
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense');
    }
  };

  const handleDescriptionChange = (e) => {
    // Block special characters by only allowing letters, numbers, and spaces
    const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
    setFormData({ ...formData, description: value });
  };

  const handleDateChange = (e) => {
    // If user tries to change date, revert to today
    if (e.target.value !== today) {
      alert('Only today\'s date is allowed');
    }
    setFormData({ ...formData, date: today });
  };

  const handleSliderChange = (e) => {
    setFormData({ ...formData, sliderValue: e.target.value, amount: e.target.value });
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Expense</h2>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 relative">
          <div className="space-y-6">
            {/* Amount Input - Changed to Rs. */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (LKR)</label>
              <div className="relative mt-2">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">Rs.</div>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Slider Section - Updated to Rs. */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount Slider (LKR)</label>
              <input
                type="range"
                min="0"
                max="100000"
                value={formData.sliderValue}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-full mt-2"
              />
              <div className="flex justify-between text-sm text-gray-700 mt-2">
                <span>Rs. 0</span>
                <span>Rs. {formData.sliderValue}</span>
                <span>Rs. 100,000</span>
              </div>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Description Input - Blocks special characters */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={handleDescriptionChange}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                placeholder="Only letters and numbers allowed"
              />
            </div>

            {/* Date Input - Only today's date allowed */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={handleDateChange}
                min={today}
                max={today}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Only today's date ({today}) is allowed</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;