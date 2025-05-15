import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, AlertCircle, Calendar, Clock, Edit } from 'lucide-react';

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
  'Personal Care',
  'Other'
];

const stores = [
  'Spar Supermarket',
  'Keells',
  'ARPICO Super Market',
  'Fresh Market',
  'Food City',
  'Local Shop',
  'Other'
];

const priorities = ['Low', 'Medium', 'High'];

const BudgetExpenseForm = () => {
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };
  
  const getCurrentTime = () => {
    return new Date().toTimeString().slice(0, 5); // HH:MM format
  };
  
  const today = getCurrentDate();
  const now = getCurrentTime();

  // Calculate the date 5 days ago for purchase date validation (modified from 30 days)
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  const minPurchaseDate = fiveDaysAgo.toISOString().split('T')[0];

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
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [maxPurchaseTime, setMaxPurchaseTime] = useState(now);

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

  // Track purchase date changes to limit time selection when today is selected
  useEffect(() => {
    if (formData.purchasedDate === today) {
      // If today is selected, time can only be current time or earlier
      setMaxPurchaseTime(now);
      
      // Ensure the time is not later than current time
      if (formData.purchasedTime > now) {
        setFormData(prev => ({ ...prev, purchasedTime: now }));
      }
    } else {
      // For past dates, allow any time
      setMaxPurchaseTime("23:59");
    }
  }, [formData.purchasedDate, today, now]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    if (!formData.itemName) {
      newErrors.itemName = 'Item name is required';
      isValid = false;
    } else if (/\d/.test(formData.itemName)) {
      newErrors.itemName = 'Item name cannot contain numbers';
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
      
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5); // Modified from 30 days to 5 days
      fiveDaysAgo.setHours(0, 0, 0, 0);
      
      if (purchaseDate > currentDate) {
        newErrors.purchasedDate = 'Purchase date cannot be in the future';
        isValid = false;
      } else if (purchaseDate < fiveDaysAgo) {
        newErrors.purchasedDate = 'Purchase date cannot be more than 5 days in the past';
        isValid = false;
      }
      
      // Validate purchase time if purchase date is today
      if (purchaseDate.toISOString().split('T')[0] === today) {
        const currentTime = now;
        if (formData.purchasedTime > currentTime) {
          newErrors.purchasedTime = 'Purchase time cannot be in the future';
          isValid = false;
        }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for itemName to prevent numbers
    if (name === 'itemName') {
      // Check if new character is a number
      const lastChar = value.slice(-1);
      if (/\d/.test(lastChar) && value.length > formData.itemName.length) {
        // Don't update if the new character is a number
        return;
      }
      
      // Clear the error when user starts typing again
      if (errors.itemName) {
        setErrors({ ...errors, itemName: '' });
      }
    }
    
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

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
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
                <label className="block text-md font-medium text-indigo-200 mb-2">Item Name* (no numbers allowed)</label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  className={`w-full p-3 bg-indigo-950/50 border ${errors.itemName ? 'border-red-500' : 'border-indigo-500/50'} rounded-lg text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                  placeholder="Enter item name (letters only)"
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
                  min={minPurchaseDate} // Only allow dates within 5 days before today
                  max={today} // Cannot be in the future
                  className={`w-full p-3 bg-indigo-950/50 border ${errors.purchasedDate ? 'border-red-500' : 'border-indigo-500/50'} rounded-lg text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                />
                {errors.purchasedDate && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.purchasedDate}
                  </p>
                )}
                <p className="text-xs text-indigo-400 mt-1">Only dates between today and 5 days ago</p>
              </div>

              {/* Purchase Time Input */}
              <div>
                <label className="block text-md font-medium text-indigo-200 mb-2">Purchase Time*</label>
                <input
                  type="time"
                  name="purchasedTime"
                  value={formData.purchasedTime}
                  onChange={handleChange}
                  max={formData.purchasedDate === today ? maxPurchaseTime : undefined}
                  className={`w-full p-3 bg-indigo-950/50 border ${errors.purchasedTime ? 'border-red-500' : 'border-indigo-500/50'} rounded-lg text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                />
                {errors.purchasedTime && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.purchasedTime}
                  </p>
                )}
                {formData.purchasedDate === today && (
                  <p className="text-xs text-indigo-400 mt-1">Time must be current time or earlier</p>
                )}
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
      </div>
    </div>
  );
};

export default BudgetExpenseForm;