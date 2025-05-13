import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, AlertCircle, Calendar, ShoppingBag, Clock, Trash, Edit, List, Store } from 'lucide-react';

// Animated background particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {Array.from({ length: 12 }).map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-float"
          style={{
            width: `${Math.floor(Math.random() * 150 + 50)}px`,
            height: `${Math.floor(Math.random() * 150 + 50)}px`,
            left: `${Math.floor(Math.random() * 100)}%`,
            top: `${Math.floor(Math.random() * 100)}%`,
            animationDuration: '20s',
            animationDelay: '0s',
            opacity: 0.4
          }}
        />
      ))}
    </div>
  );
};

// Predefined categories for budget items
const categories = [
  'Groceries',
  'Household Essentials',
  'Utilities',
  'Transportation',
  'Entertainment',
  'Dining Out',
  'Healthcare',
  'Personal Care',
  'Clothing',
  'Education',
  'Gifts',
  'Electronics',
  'Subscriptions',
  'Other'
];

const stores = [
  'Spar Supermarket',
  'Keells',
  'ARPICO Super Market',
  'Fresh Market',
  'Food City',
  'Local Shop',
  'Amazon',
  'Walmart',
  'Target',
  'Other'
];

const priorities = ['Low', 'Medium', 'High'];

const BudgetExpenseForm = () => {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toTimeString().slice(0, 5); // HH:MM format

  // Calculate the date 30 days ago for purchase date validation
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const minPurchaseDate = thirtyDaysAgo.toISOString().split('T')[0];

  // Calculate tomorrow for expiry date validation
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minExpiryDate = tomorrow.toISOString().split('T')[0];

  const generateItemId = () => {
    return `EXP-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
  };
  
  const [formData, setFormData] = useState({
    itemId: generateItemId(),
    itemName: '',
    category: '',
    price: 0,
    quantity: 1,
    totalPrice: 0,
    priority: 'Medium',
    notes: '',
    purchasedDate: today,
    purchasedTime: now,
    store: '',
    expiryDate: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [budgetItems, setBudgetItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDateRange, setFilterDateRange] = useState({
    startDate: '',
    endDate: today
  });
  const [categoryStats, setCategoryStats] = useState([]);
  const [dateRangeStats, setDateRangeStats] = useState(null);

  // Fetch existing budget items and stats when component mounts
  useEffect(() => {
    fetchBudgetItems();
    fetchCategoryStats();
  }, []);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Update totalPrice when price or quantity changes
  useEffect(() => {
    const price = parseFloat(formData.price) || 0;
    const quantity = parseInt(formData.quantity) || 0;
    setFormData(prev => ({ ...prev, totalPrice: price * quantity }));
  }, [formData.price, formData.quantity]);

  const fetchBudgetItems = async () => {
    try {
      const response = await fetch('http://localhost:8070/budget');
      if (response.ok) {
        const data = await response.json();
        setBudgetItems(data);
      } else {
        console.error('Failed to fetch budget items');
      }
    } catch (error) {
      console.error('Error fetching budget items:', error);
    }
  };

  const fetchCategoryStats = async () => {
    try {
      const response = await fetch('http://localhost:8070/budget/stats/categories');
      if (response.ok) {
        const data = await response.json();
        setCategoryStats(data);
      } else {
        console.error('Failed to fetch category stats');
      }
    } catch (error) {
      console.error('Error fetching category stats:', error);
    }
  };

  const fetchDateRangeStats = async () => {
    if (!filterDateRange.startDate) return;
    
    try {
      const response = await fetch(
        `http://localhost:8070/budget/stats/daterange?startDate=${filterDateRange.startDate}&endDate=${filterDateRange.endDate}`
      );
      if (response.ok) {
        const data = await response.json();
        setDateRangeStats(data);
      } else {
        console.error('Failed to fetch date range stats');
      }
    } catch (error) {
      console.error('Error fetching date range stats:', error);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    if (!formData.itemName) {
      newErrors.itemName = 'Item name is required';
      isValid = false;
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
      isValid = false;
    }
    
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
      isValid = false;
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
      isValid = false;
    }
    
    // Validate purchase date
    if (formData.purchasedDate) {
      const purchaseDate = new Date(formData.purchasedDate);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      thirtyDaysAgo.setHours(0, 0, 0, 0);
      
      if (purchaseDate > currentDate) {
        newErrors.purchasedDate = 'Purchase date cannot be in the future';
        isValid = false;
      } else if (purchaseDate < thirtyDaysAgo) {
        newErrors.purchasedDate = 'Purchase date cannot be more than 30 days in the past';
        isValid = false;
      }
    } else {
      newErrors.purchasedDate = 'Purchase date is required';
      isValid = false;
    }
    
    // Validate expiry date if provided
    if (formData.expiryDate) {
      const expiryDate = new Date(formData.expiryDate);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      if (expiryDate <= currentDate) {
        newErrors.expiryDate = 'Expiry date must be at least tomorrow or later';
        isValid = false;
      }
    }
    
    if (!formData.store) {
      newErrors.store = 'Please select a store';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const url = `http://localhost:8070/budget${isEditing && editId ? `/${editId}` : ''}`;
      const method = isEditing ? 'PUT' : 'POST';
      
      // Prepare the data to send
      const dataToSend = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        totalPrice: parseFloat(formData.price) * parseInt(formData.quantity)
      };
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      if (response.ok) {
        // Reset form
        setFormData({
          itemId: generateItemId(),
          itemName: '',
          category: '',
          price: 0,
          quantity: 1,
          totalPrice: 0,
          priority: 'Medium',
          notes: '',
          purchasedDate: today,
          purchasedTime: now,
          store: '',
          expiryDate: ''
        });
        
        setShowSuccess(true);
        fetchBudgetItems(); // Refresh the list
        fetchCategoryStats(); // Refresh the stats
        if (filterDateRange.startDate) {
          fetchDateRangeStats(); // Refresh date range stats if active
        }
        
        if (isEditing) {
          setIsEditing(false);
          setEditId(null);
        }
      } else {
        console.error('Error saving budget item:', await response.text());
      }
    } catch (error) {
      console.error('Error saving budget item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const response = await fetch(`http://localhost:8070/budget/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          fetchBudgetItems(); // Refresh the list
          fetchCategoryStats(); // Refresh the stats
          if (filterDateRange.startDate) {
            fetchDateRangeStats(); // Refresh date range stats if active
          }
        } else {
          console.error('Error deleting expense');
        }
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await fetch(`http://localhost:8070/budget/${id}`);
      if (response.ok) {
        const item = await response.json();
        
        setFormData({
          itemId: item.itemId,
          itemName: item.itemName,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          priority: item.priority,
          notes: item.notes || '',
          purchasedDate: new Date(item.purchasedDate).toISOString().split('T')[0],
          purchasedTime: item.purchasedTime,
          store: item.store,
          expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : ''
        });
        
        setIsEditing(true);
        setEditId(id);
        
        // Scroll to form
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        console.error('Error fetching item details');
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setFormData({ ...formData, quantity: value });
      if (errors.quantity) {
        setErrors({ ...errors, quantity: '' });
      }
    }
  };

  const handlePriceChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setFormData({ ...formData, price: value });
      if (errors.price) {
        setErrors({ ...errors, price: '' });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      itemId: generateItemId(),
      itemName: '',
      category: '',
      price: 0,
      quantity: 1,
      totalPrice: 0,
      priority: 'Medium',
      notes: '',
      purchasedDate: today,
      purchasedTime: now,
      store: '',
      expiryDate: ''
    });
    setErrors({});
    setIsEditing(false);
    setEditId(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Filter budget items by category and date range
  const filteredBudgetItems = budgetItems.filter(item => {
    let matchesCategory = true;
    let matchesDateRange = true;
    
    if (filterCategory) {
      matchesCategory = item.category === filterCategory;
    }
    
    if (filterDateRange.startDate) {
      const itemDate = new Date(item.purchasedDate);
      const start = new Date(filterDateRange.startDate);
      const end = new Date(filterDateRange.endDate);
      end.setHours(23, 59, 59, 999); // Include the full end date
      
      matchesDateRange = itemDate >= start && itemDate <= end;
    }
    
    return matchesCategory && matchesDateRange;
  });
  
  // Apply filter for date range
  const handleApplyDateFilter = () => {
    fetchDateRangeStats();
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setFilterCategory('');
    setFilterDateRange({
      startDate: '',
      endDate: today
    });
    setDateRangeStats(null);
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Animated particles background */}
      <FloatingParticles />
      
      {/* Success notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-indigo-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          {isEditing ? 'Expense updated successfully!' : 'Expense added successfully!'}
        </div>
      )}
      
      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
            <DollarSign className="inline-block mr-2 h-8 w-8" /> 
            Budget Expense Tracker
          </h1>
          <p className="mt-3 text-lg text-indigo-200">
            Track and manage your expenses with ease
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-indigo-500/20 mb-8">
          <h2 className="text-2xl font-bold text-indigo-200 mb-8 flex items-center">
            {isEditing ? (
              <>
                <Edit className="h-6 w-6 mr-2 text-indigo-400" />
                Edit Expense
              </>
            ) : (
              <>
                <Plus className="h-6 w-6 mr-2 text-indigo-400" />
                Add New Expense
              </>
            )}
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Item Name Input */}
              <div>
                <label className="block text-md font-medium text-indigo-200 mb-2">Item Name*</label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  className={`w-full p-3 bg-indigo-950/50 border ${errors.itemName ? 'border-red-500' : 'border-indigo-500/50'} rounded-lg text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                  placeholder="Enter item name"
                />
                {errors.itemName && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.itemName}
                  </p>
                )}
              </div>

              {/* Category Select */}
              <div>
                <label className="block text-md font-medium text-indigo-200 mb-2">Category*</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
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

              {/* Quantity Input */}
              <div>
                <label className="block text-md font-medium text-indigo-200 mb-2">Quantity*</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  className={`w-full p-3 bg-indigo-950/50 border ${errors.quantity ? 'border-red-500' : 'border-indigo-500/50'} rounded-lg text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                />
                {errors.quantity && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.quantity}
                  </p>
                )}
              </div>

              {/* Price Input */}
              <div>
                <label className="block text-md font-medium text-indigo-200 mb-2">Price*</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handlePriceChange}
                  min="0"
                  step="0.01"
                  className={`w-full p-3 bg-indigo-950/50 border ${errors.price ? 'border-red-500' : 'border-indigo-500/50'} rounded-lg text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                  placeholder="Enter price"
                />
                {errors.price && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Total Price (Read only) */}
              <div>
                <label className="block text-md font-medium text-indigo-200 mb-2">Total Price</label>
                <input
                  type="text"
                  value={formatCurrency(formData.totalPrice)}
                  readOnly
                  className="w-full p-3 bg-indigo-950/50 border border-indigo-500/50 rounded-lg text-lg text-white focus:outline-none opacity-70"
                />
                <p className="text-xs text-indigo-400 mt-1">Automatically calculated</p>
              </div>

              {/* Store Input */}
              <div>
                <label className="block text-md font-medium text-indigo-200 mb-2">Store*</label>
                <select
                  name="store"
                  value={formData.store}
                  onChange={handleChange}
                  className={`w-full p-3 bg-indigo-950/50 border ${errors.store ? 'border-red-500' : 'border-indigo-500/50'} rounded-lg text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                >
                  <option value="" className="bg-indigo-900">Select a store</option>
                  {stores.map((store) => (
                    <option key={store} value={store} className="bg-indigo-900">{store}</option>
                  ))}
                </select>
                {errors.store && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.store}
                  </p>
                )}
              </div>

              {/* Priority Select */}
              <div>
                <label className="block text-md font-medium text-indigo-200 mb-2">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full p-3 bg-indigo-950/50 border border-indigo-500/50 rounded-lg text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority} className="bg-indigo-900">{priority}</option>
                  ))}
                </select>
              </div>

              {/* Item ID (Read-only) */}
              <div>
                <label className="block text-md font-medium text-indigo-200 mb-2">Item ID</label>
                <input
                  type="text"
                  name="itemId"
                  value={formData.itemId}
                  readOnly
                  className="w-full p-3 bg-indigo-950/50 border border-indigo-500/50 rounded-lg text-lg text-white focus:outline-none opacity-70"
                />
                <p className="text-xs text-indigo-400 mt-1">Automatically generated</p>
              </div>

              {/* Purchase Date Input */}
              <div>
                <label className="block text-md font-medium text-indigo-200 mb-2">Purchase Date*</label>
                <input
                  type="date"
                  name="purchasedDate"
                  value={formData.purchasedDate}
                  onChange={handleChange}
                  min={minPurchaseDate} // Only allow dates within 30 days before today
                  max={today} // Cannot be in the future
                  className={`w-full p-3 bg-indigo-950/50 border ${errors.purchasedDate ? 'border-red-500' : 'border-indigo-500/50'} rounded-lg text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                />
                {errors.purchasedDate && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.purchasedDate}
                  </p>
                )}
                <p className="text-xs text-indigo-400 mt-1">Only dates within 30 days before today or today</p>
              </div>

              {/* Purchase Time Input */}
              <div>
                <label className="block text-md font-medium text-indigo-200 mb-2">Purchase Time*</label>
                <input
                  type="time"
                  name="purchasedTime"
                  value={formData.purchasedTime}
                  onChange={handleChange}
                  className="w-full p-3 bg-indigo-950/50 border border-indigo-500/50 rounded-lg text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Expiry Date Input (New field) */}
              <div>
                <label className="block text-md font-medium text-indigo-200 mb-2">Expiry Date (optional)</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  min={minExpiryDate} // Must be at least tomorrow
                  className={`w-full p-3 bg-indigo-950/50 border ${errors.expiryDate ? 'border-red-500' : 'border-indigo-500/50'} rounded-lg text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                />
                {errors.expiryDate && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.expiryDate}
                  </p>
                )}
                <p className="text-xs text-indigo-400 mt-1">Must be at least tomorrow or later</p>
              </div>
            </div>

            {/* Notes Textarea */}
            <div>
              <label className="block text-md font-medium text-indigo-200 mb-2">Notes (optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full p-3 bg-indigo-950/50 border border-indigo-500/50 rounded-lg text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-24"
                placeholder="Add any additional notes or details here..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-indigo-900/80 hover:bg-indigo-900 text-white rounded-lg transition duration-300 flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition duration-300 flex items-center justify-center shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    {isEditing ? <Edit className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
                    {isEditing ? 'Update Expense' : 'Add Expense'}
                  </span>
                )}
                </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-indigo-500/20 mb-8">
          <h2 className="text-xl font-bold text-indigo-200 mb-4 flex items-center">
            <List className="h-5 w-5 mr-2 text-indigo-400" />
            Filter Expenses
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-2">Filter by Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-2 bg-indigo-950/50 border border-indigo-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="" className="bg-indigo-900">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-indigo-900">{category}</option>
                ))}
              </select>
            </div>
            
            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-2">From Date</label>
              <input
                type="date"
                value={filterDateRange.startDate}
                onChange={(e) => setFilterDateRange({...filterDateRange, startDate: e.target.value})}
                className="w-full p-2 bg-indigo-950/50 border border-indigo-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-2">To Date</label>
              <input
                type="date"
                value={filterDateRange.endDate}
                max={today}
                onChange={(e) => setFilterDateRange({...filterDateRange, endDate: e.target.value})}
                className="w-full p-2 bg-indigo-950/50 border border-indigo-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4 space-x-3">
            <button
              onClick={handleApplyDateFilter}
              disabled={!filterDateRange.startDate}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:opacity-50 text-white rounded-lg transition duration-300 text-sm"
            >
              Apply Date Filter
            </button>
            
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-indigo-900/80 hover:bg-indigo-900 text-white rounded-lg transition duration-300 text-sm"
            >
              Clear All Filters
            </button>
          </div>
        </div>
        
        {/* Statistics Section */}
        {(categoryStats.length > 0 || dateRangeStats) && (
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-indigo-500/20 mb-8">
            <h2 className="text-xl font-bold text-indigo-200 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-indigo-400" />
              Expense Statistics
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Stats */}
              {categoryStats.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-indigo-300 mb-3">Top Categories</h3>
                  <div className="space-y-3">
                    {categoryStats.slice(0, 3).map((stat, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-indigo-200">{stat.category}</span>
                        <span className="text-indigo-300 font-semibold">{formatCurrency(stat.totalAmount)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-indigo-500/30">
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-200">Total Expenses</span>
                      <span className="text-indigo-300 font-bold">
                        {formatCurrency(categoryStats.reduce((acc, curr) => acc + curr.totalAmount, 0))}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Date Range Stats */}
              {dateRangeStats && (
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-indigo-300 mb-3">
                    Date Range: {formatDate(filterDateRange.startDate)} to {formatDate(filterDateRange.endDate)}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-200">Total Expenses</span>
                      <span className="text-indigo-300 font-semibold">{formatCurrency(dateRangeStats.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-200">Total Items</span>
                      <span className="text-indigo-300 font-semibold">{dateRangeStats.totalItems}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-200">Average Per Day</span>
                      <span className="text-indigo-300 font-semibold">{formatCurrency(dateRangeStats.averagePerDay)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Expense Items List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-indigo-500/20">
          <div className="p-6 border-b border-indigo-500/20">
            <h2 className="text-xl font-bold text-indigo-200 flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-indigo-400" />
              Your Expenses
              {filteredBudgetItems.length > 0 && (
                <span className="ml-2 text-sm bg-indigo-500/30 px-2 py-1 rounded-full">
                  {filteredBudgetItems.length} items
                </span>
              )}
            </h2>
          </div>
          
          {filteredBudgetItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-indigo-400/40 mb-4" />
              <p className="text-indigo-300 text-lg font-medium">No expenses found</p>
              <p className="text-indigo-400/60 mt-2">
                {filterCategory || filterDateRange.startDate 
                  ? "Try changing your filters to see more results"
                  : "Add your first expense to get started"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left bg-indigo-900/40">
                    <th className="px-6 py-3 text-sm font-medium text-indigo-300 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-sm font-medium text-indigo-300 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-sm font-medium text-indigo-300 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-sm font-medium text-indigo-300 uppercase tracking-wider">Qty</th>
                    <th className="px-6 py-3 text-sm font-medium text-indigo-300 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-sm font-medium text-indigo-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-sm font-medium text-indigo-300 uppercase tracking-wider">Store</th>
                    <th className="px-6 py-3 text-sm font-medium text-indigo-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBudgetItems.map((item, idx) => (
                    <tr 
                      key={item._id || idx} 
                      className={`${idx % 2 === 0 ? 'bg-indigo-900/20' : 'bg-indigo-900/30'} border-t border-indigo-900/10`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-white">{item.itemName}</div>
                          <div className={`text-xs ${getPriorityColor(item.priority)}`}>
                            {item.priority} Priority
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-indigo-800/50 text-indigo-200 px-2 py-1 rounded text-xs">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-indigo-200">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4 text-indigo-200">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 font-medium text-white">
                        {formatCurrency(item.totalPrice)}
                      </td>
                      <td className="px-6 py-4 text-indigo-200">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3 w-3 mr-1 text-indigo-400" />
                          {formatDate(item.purchasedDate)}
                        </div>
                        <div className="flex items-center text-xs text-indigo-400 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {item.purchasedTime}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-indigo-200">
                          <Store className="h-3 w-3 mr-1 text-indigo-400" />
                          {item.store}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(item._id)}
                            className="text-indigo-300 hover:text-white transition-colors duration-200"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                            title="Delete"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetExpenseForm;