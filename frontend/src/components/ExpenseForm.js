import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, AlertCircle } from 'lucide-react';

// Animated background particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {Array.from({ length: 15 }).map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-float"
          style={{
            width: `${Math.random() * 200 + 50}px`,
            height: `${Math.random() * 200 + 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 20 + 20}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.4
          }}
        />
      ))}
    </div>
  );
};

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
  
  const [errors, setErrors] = useState({
    amount: '',
    category: '',
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { amount: '', category: '', description: '' };
    
    // Amount validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a positive amount';
      isValid = false;
    }
    
    // Category validation
    if (!formData.category) {
      newErrors.category = 'Please select a category';
      isValid = false;
    }
    
    // Description validation
    if (!formData.description) {
      newErrors.description = 'Please enter a description';
      isValid = false;
    } else if (formData.description.length < 3) {
      newErrors.description = 'Description must be at least 3 characters';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Mock API call - would be replaced with actual API call
      setTimeout(() => {
        console.log('Expense added:', formData);
        
        // Reset form (keeping today's date)
        setFormData({
          amount: '',
          category: '',
          description: '',
          date: today,
          sliderValue: 0
        });
        
        setShowSuccess(true);
        setIsSubmitting(false);
      }, 800);
    } catch (error) {
      console.error('Error adding expense:', error);
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    
    // Allow only positive numbers
    if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
      setFormData({ ...formData, amount: value, sliderValue: value ? Math.min(parseFloat(value), 100000) : 0 });
      if (errors.amount) setErrors({ ...errors, amount: '' });
    }
  };

  const handleDescriptionChange = (e) => {
    // Block special characters by only allowing letters, numbers, and spaces
    const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
    setFormData({ ...formData, description: value });
    if (errors.description && value.length >= 3) {
      setErrors({ ...errors, description: '' });
    }
  };

  const handleDateChange = (e) => {
    // If user tries to change date, revert to today
    if (e.target.value !== today) {
      alert('Only today\'s date is allowed');
    }
    setFormData({ ...formData, date: today });
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setFormData({ ...formData, sliderValue: value, amount: value.toString() });
    if (errors.amount) setErrors({ ...errors, amount: '' });
  };

  const handleCategoryChange = (e) => {
    setFormData({ ...formData, category: e.target.value });
    if (errors.category) setErrors({ ...errors, category: '' });
  };

  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value).replace('LKR', 'Rs.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Animated particles background */}
      <FloatingParticles />
      
      {/* Success notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          Expense added successfully!
        </div>
      )}
      
      <div className="max-w-3xl w-full relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
            Expense Tracker
          </h1>
          <p className="mt-3 text-lg text-indigo-200">
            Keep track of your daily expenses
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-indigo-500/20">
          <h2 className="text-2xl font-bold text-indigo-200 mb-8 flex items-center">
            <Plus className="h-6 w-6 mr-2 text-indigo-400" />
            Add New Expense
          </h2>

          <div className="space-y-8">
            {/* Amount Input */}
            <div>
              <label className="block text-md font-medium text-indigo-200 mb-2">Amount (LKR)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-300">
                  <DollarSign size={18} />
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={formData.amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className={`w-full pl-12 pr-4 py-3 bg-indigo-950/50 border ${errors.amount ? 'border-red-500' : 'border-indigo-500/50'} rounded-lg text-lg text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                />
              </div>
              {errors.amount && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.amount}
                </p>
              )}
            </div>

            {/* Slider Section */}
            <div>
              <label className="block text-md font-medium text-indigo-200 mb-2">Amount Slider</label>
              <input
                type="range"
                min="0"
                max="100000"
                step="100"
                value={formData.sliderValue}
                onChange={handleSliderChange}
                className="w-full h-2 bg-indigo-900 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-indigo-300 mt-2">
                <span>Rs. 0</span>
                <span>{formatCurrency(formData.sliderValue)}</span>
                <span>Rs. 100,000</span>
              </div>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-md font-medium text-indigo-200 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={handleCategoryChange}
                className={`w-full p-3 bg-indigo-950/50 border ${errors.category ? 'border-red-500' : 'border-indigo-500/50'} rounded-lg text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              >
                <option value="" className="bg-indigo-900">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-indigo-900">{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-md font-medium text-indigo-200 mb-2">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={handleDescriptionChange}
                className={`w-full p-3 bg-indigo-950/50 border ${errors.description ? 'border-red-500' : 'border-indigo-500/50'} rounded-lg text-lg text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                placeholder="What did you spend on?"
              />
              <p className="text-xs text-indigo-400 mt-1">Only letters and numbers allowed</p>
              {errors.description && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Date Input */}
            <div>
              <label className="block text-md font-medium text-indigo-200 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={handleDateChange}
                min={today}
                max={today}
                className="w-full p-3 bg-indigo-950/50 border border-indigo-500/50 rounded-lg text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <p className="text-xs text-indigo-400 mt-1">Only today's date ({today}) is allowed</p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-4 px-6 rounded-lg text-lg font-medium transition-all duration-300 ${isSubmitting ? 'bg-indigo-700 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'} focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-lg`}
            >
              {isSubmitting ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
              ) : (
                <Plus className="h-5 w-5 mr-2" />
              )}
              {isSubmitting ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// We need to define the animation keyframes for the floating effect
// Since we can't modify the global CSS directly, we'll use a style component
const AnimationStyles = () => {
  return (
    <style>
      {`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(5%, 5%) rotate(5deg); }
          66% { transform: translate(-5%, 2%) rotate(-5deg); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
      `}
    </style>
  );
};

const EnhancedExpenseFormWithStyles = () => {
  return (
    <>
      <AnimationStyles />
      <ExpenseForm />
    </>
  );
};

export default EnhancedExpenseFormWithStyles;