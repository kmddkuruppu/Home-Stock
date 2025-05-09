import React, { useState, useEffect } from 'react';
import { Plus, ShoppingBag, AlertCircle, Calendar, Tag, Clock, Trash, Edit, List, Check } from 'lucide-react';

// Animated background particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {Array.from({ length: 12 }).map((_, i) => (
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

const ShoppingListForm = () => {
  const categories = [
    'Groceries',
    'Household Essentials',
    'Cleaning Supplies',
    'Personal Care',
    'Other'
  ];

  const stores = [
    'Spar Supermarket',
    'Kills',
    'ARPICO Super Market',
    'Fresh Market',
    'Food City',
    'Local Shop',
    'Other'
  ];

  const priorities = ['Low', 'Medium', 'High'];
  
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toTimeString().slice(0, 5); // HH:MM format

  // Calculate the date 5 days ago for purchase date validation
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  const minPurchaseDate = fiveDaysAgo.toISOString().split('T')[0];

  const generateItemId = () => {
    return `ITEM-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
  };
  
  const [formData, setFormData] = useState({
    itemId: generateItemId(),
    itemName: '',
    category: '',
    quantity: 1,
    price: 0,
    priority: 'Medium',
    notes: '',
    expiryDate: '',
    purchasedDate: today,
    purchasedTime: now,
    store: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shoppingList, setShoppingList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch existing items when component mounts
  useEffect(() => {
    fetchShoppingList();
  }, []);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const fetchShoppingList = async () => {
    try {
      const response = await fetch('http://localhost:8070/shoppinglist');
      if (response.ok) {
        const data = await response.json();
        setShoppingList(data);
      } else {
        console.error('Failed to fetch shopping list');
      }
    } catch (error) {
      console.error('Error fetching shopping list:', error);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    // Validate item name (no numbers or operators)
    if (!formData.itemName) {
      newErrors.itemName = 'Please enter an item name';
      isValid = false;
    } else if (/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.itemName)) {
      newErrors.itemName = 'Item name cannot contain numbers or operators';
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
    
    // Validate price
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
      isValid = false;
    }
    
    // Validate expiry date (cannot be before today)
    if (formData.expiryDate) {
      const expiryDate = new Date(formData.expiryDate);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
      
      if (expiryDate < currentDate) {
        newErrors.expiryDate = 'Expiry date cannot be before the current date';
        isValid = false;
      }
    }
    
    // Validate purchase date (within 5 days before today or today)
    if (formData.purchasedDate) {
      const purchaseDate = new Date(formData.purchasedDate);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
      
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
      fiveDaysAgo.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
      
      if (purchaseDate > currentDate) {
        newErrors.purchasedDate = 'Purchase date cannot be in the future';
        isValid = false;
      } else if (purchaseDate < fiveDaysAgo) {
        newErrors.purchasedDate = 'Purchase date cannot be more than 5 days in the past';
        isValid = false;
      }
    }
    
    if (!formData.store) {
      newErrors.store = 'Please enter a store name';
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
      const url = `http://localhost:8070/shoppinglist${isEditing && editId ? `/${editId}` : ''}`;
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        // Reset form
        setFormData({
          itemId: generateItemId(),
          itemName: '',
          category: '',
          quantity: 1,
          price: 0,
          priority: 'Medium',
          notes: '',
          expiryDate: '',
          purchasedDate: today,
          purchasedTime: now,
          store: ''
        });
        
        setShowSuccess(true);
        fetchShoppingList(); // Refresh the list
        
        if (isEditing) {
          setIsEditing(false);
          setEditId(null);
        }
      } else {
        console.error('Error saving item:', await response.text());
      }
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`http://localhost:8070/shoppinglist/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          fetchShoppingList(); // Refresh the list
        } else {
          console.error('Error deleting item');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleEdit = (item) => {
    setFormData({
      itemId: item.itemId,
      itemName: item.itemName,
      category: item.category,
      quantity: item.quantity,
      price: item.price || 0,
      priority: item.priority,
      notes: item.notes || '',
      expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
      purchasedDate: new Date(item.purchasedDate).toISOString().split('T')[0],
      purchasedTime: item.purchasedTime,
      store: item.store
    });
    setIsEditing(true);
    setEditId(item._id);
    
    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special validation for item name - prevent numbers and operators input
    if (name === 'itemName') {
      // Only allow letters, spaces and basic punctuation
      if (!/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value) || value === '') {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const resetForm = () => {
    setFormData({
      itemId: generateItemId(),
      itemName: '',
      category: '',
      quantity: 1,
      price: 0,
      priority: 'Medium',
      notes: '',
      expiryDate: '',
      purchasedDate: today,
      purchasedTime: now,
      store: ''
    });
    setErrors({});
    setIsEditing(false);
    setEditId(null);
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
        <div className="fixed top-4 right-4 bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          {isEditing ? 'Item updated successfully!' : 'Item added successfully!'}
        </div>
      )}
      
      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
            <ShoppingBag className="inline-block mr-2 h-8 w-8" /> 
            Shopping List Manager
          </h1>
          <p className="mt-3 text-lg text-indigo-200">
            Track and manage your shopping items
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-indigo-500/20 mb-8">
          <h2 className="text-2xl font-bold text-indigo-200 mb-8 flex items-center">
            {isEditing ? (
              <>
                <Edit className="h-6 w-6 mr-2 text-indigo-400" />
                Edit Shopping Item
              </>
            ) : (
              <>
                <Plus className="h-6 w-6 mr-2 text-indigo-400" />
                Add New Shopping Item
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
                  className={`w-full p-3 bg-indigo-950/50 border ${errors.itemName ? 'border-red-500' : 'border-indigo-500/50'} rounded-lg text-lg text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
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

              {/* Expiry Date Input */}
              <div>
                <label className="block text-md font-medium text-indigo-200 mb-2">Expiry Date (optional)</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  min={today} // Prevent selection of dates before today
                  className={`w-full p-3 bg-indigo-950/50 border ${errors.expiryDate ? 'border-red-500' : 'border-indigo-500/50'} rounded-lg text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                />
                {errors.expiryDate && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.expiryDate}
                  </p>
                )}
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
                <p className="text-xs text-indigo-400 mt-1">Only dates within 5 days before today or today</p>
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
            </div>

            {/* Notes Textarea */}
            <div>
              <label className="block text-md font-medium text-indigo-200 mb-2">Notes (optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 bg-indigo-950/50 border border-indigo-500/50 rounded-lg text-lg text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Any additional information about this item"
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex-1 flex justify-center items-center py-4 px-6 rounded-lg text-lg font-medium transition-all duration-300 ${isSubmitting ? 'bg-indigo-700 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'} focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-lg`}
              >
                {isSubmitting ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                ) : isEditing ? (
                  <Edit className="h-5 w-5 mr-2" />
                ) : (
                  <Plus className="h-5 w-5 mr-2" />
                )}
                {isSubmitting ? 'Processing...' : isEditing ? 'Update Item' : 'Add Item'}
              </button>
              
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 flex justify-center items-center py-4 px-6 rounded-lg text-lg font-medium bg-gray-600 hover:bg-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingListForm;