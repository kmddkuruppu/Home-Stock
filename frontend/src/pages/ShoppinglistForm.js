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

// Predefined items by category
const itemsByCategory = {
  'Groceries': {
    'Grains & Staples': ['Rice', 'Wheat flour', 'Semolina', 'Lentils', 'Chickpeas', 'Pasta', 'Noodles'],
    'Breakfast Items': ['Bread', 'Cereals', 'Oats', 'Jam', 'Peanut butter', 'Honey'],
    'Spices & Condiments': ['Salt', 'Pepper', 'Turmeric', 'Chili powder', 'Cumin', 'Mustard', 'Soy sauce', 'Vinegar'],
    'Canned & Jarred': ['Canned beans', 'Tomatoes', 'Tuna', 'Coconut milk', 'Pickles', 'Sauces'],
    'Oils & Fats': ['Vegetable oil', 'Coconut oil', 'Olive oil', 'Butter', 'Margarine', 'Ghee'],
    'Dairy': ['Milk', 'Cheese', 'Yogurt', 'Cream'],
    'Frozen Items': ['Frozen vegetables', 'Meat', 'Fish', 'Ice cream'],
    'Snacks': ['Chips', 'Biscuits', 'Nuts', 'Chocolates'],
    'Beverages': ['Tea', 'Coffee', 'Juice', 'Soft drinks', 'Bottled water']
  },
  'Household Essentials': [
    'Toilet paper', 'Tissues', 'Paper towels', 'Light bulbs', 'Batteries', 
    'Trash bags', 'Aluminum foil & plastic wrap', 'Storage containers', 'Ziplock bags', 
    'Matches/lighter', 'Air fresheners', 'Candles or emergency lights', 'Extension cords/power strips'
  ],
  'Cleaning Supplies': [
    'Laundry detergent', 'Fabric softener', 'Dishwashing liquid', 'Sponges & scrubbers', 
    'Floor cleaner', 'Glass cleaner', 'Bathroom cleaner', 'Disinfectant spray/wipes', 
    'Bleach', 'Mop & bucket', 'Broom & dustpan', 'Toilet brush & cleaner', 'Garbage bin liners'
  ],
  'Personal Care': [
    'Shampoo & conditioner', 'Soap/body wash', 'Toothpaste & toothbrush', 'Mouthwash', 
    'Shaving cream/razor', 'Deodorant', 'Face wash', 'Lotion/moisturizer', 
    'Feminine hygiene products', 'Cotton swabs & pads', 'Nail cutter', 'Hairbrush/comb', 
    'First aid kit (bandages, antiseptic)'
  ],
  'Other': [
    'Seasonal supplies (umbrellas, raincoats, mosquito repellent)', 'Sewing kit', 
    'Tool kit (hammer, screwdriver, pliers)', 'Stationery (pens, tape, scissors)', 
    'Light snacks for guests', 'Pet food (if applicable)', 'Emergency medicine (painkillers, antacids)', 
    'Backup mobile charger/power bank'
  ]
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
    subcategory: '',  // New field for groceries subcategories
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
  const [availableItems, setAvailableItems] = useState([]);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);

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

  // Update available items when category changes
  useEffect(() => {
    if (formData.category === 'Groceries') {
      // For groceries, we show subcategories
      setAvailableSubcategories(Object.keys(itemsByCategory['Groceries']));
      setAvailableItems([]);
      setFormData(prev => ({ ...prev, subcategory: '', itemName: '' }));
    } else if (formData.category) {
      // For other categories, we directly show items
      setAvailableSubcategories([]);
      setAvailableItems(itemsByCategory[formData.category] || []);
      setFormData(prev => ({ ...prev, subcategory: '', itemName: '' }));
    } else {
      setAvailableSubcategories([]);
      setAvailableItems([]);
    }
  }, [formData.category]);

  // Update available items when subcategory changes (for groceries only)
  useEffect(() => {
    if (formData.category === 'Groceries' && formData.subcategory) {
      setAvailableItems(itemsByCategory['Groceries'][formData.subcategory] || []);
      setFormData(prev => ({ ...prev, itemName: '' }));
    }
  }, [formData.subcategory]);

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
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
      isValid = false;
    }
    
    if (formData.category === 'Groceries' && !formData.subcategory) {
      newErrors.subcategory = 'Please select a subcategory';
      isValid = false;
    }
    
    if (!formData.itemName) {
      newErrors.itemName = 'Please select an item';
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
      const url = `http://localhost:8070/shoppinglist${isEditing && editId ? `/${editId}` : ''}`;
      const method = isEditing ? 'PUT' : 'POST';
      
      // Prepare the data to send
      const dataToSend = {
        ...formData,
        // For Groceries, include subcategory info in notes
        notes: formData.category === 'Groceries' 
          ? `${formData.subcategory}: ${formData.notes}`
          : formData.notes
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
          subcategory: '',
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
    // Parse subcategory from notes if available
    let subcategory = '';
    let notes = item.notes || '';
    
    if (item.category === 'Groceries' && notes) {
      const colonIndex = notes.indexOf(':');
      if (colonIndex > 0) {
        subcategory = notes.substring(0, colonIndex).trim();
        notes = notes.substring(colonIndex + 1).trim();
      }
    }
    
    setFormData({
      itemId: item.itemId,
      itemName: item.itemName,
      category: item.category,
      subcategory: subcategory,
      quantity: item.quantity,
      price: item.price || 0,
      priority: item.priority,
      notes: notes,
      expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
      purchasedDate: new Date(item.purchasedDate).toISOString().split('T')[0],
      purchasedTime: item.purchasedTime,
      store: item.store
    });
    
    // Update available items based on category/subcategory
    if (item.category === 'Groceries' && subcategory) {
      setAvailableSubcategories(Object.keys(itemsByCategory['Groceries']));
      setAvailableItems(itemsByCategory['Groceries'][subcategory] || []);
    } else if (item.category) {
      setAvailableItems(itemsByCategory[item.category] || []);
    }
    
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
      subcategory: '',
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
    setAvailableItems([]);
    setAvailableSubcategories([]);
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

              {/* Subcategory Select (only for Groceries) */}
              {formData.category === 'Groceries' && (
                <div>
                  <label className="block text-md font-medium text-indigo-200 mb-2">Sub-category*</label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className={`w-full p-3 bg-indigo-950/50 border ${errors.subcategory ? 'border-red-500' : 'border-indigo-500/50'} rounded-lg text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                  >
                    <option value="" className="bg-indigo-900">Select a subcategory</option>
                    {availableSubcategories.map((subcategory) => (
                      <option key={subcategory} value={subcategory} className="bg-indigo-900">{subcategory}</option>
                    ))}
                  </select>
                  {errors.subcategory && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.subcategory}
                    </p>
                  )}
                </div>
              )}

              {/* Item Name Select (now a dropdown of predefined items) */}
              <div>
                <label className="block text-md font-medium text-indigo-200 mb-2">Item Name*</label>
                <select
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  disabled={!formData.category || (formData.category === 'Groceries' && !formData.subcategory)}
                  className={`w-full p-3 bg-indigo-950/50 border ${errors.itemName ? 'border-red-500' : 'border-indigo-500/50'} rounded-lg text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 ${(!formData.category || (formData.category === 'Groceries' && !formData.subcategory)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="" className="bg-indigo-900">Select an item</option>
                  {availableItems.map((item) => (
                    <option key={item} value={item} className="bg-indigo-900">{item}</option>
                  ))}
                </select>
                {errors.itemName && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.itemName}
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
                    {isEditing ? (
                      <>
                        <Check className="mr-2 h-5 w-5" />
                        Update Item
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-5 w-5" />
                        Add Item
                      </>
                    )}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Shopping List Table */}
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-indigo-500/20">
          <h2 className="text-2xl font-bold text-indigo-200 mb-8 flex items-center">
            <List className="h-6 w-6 mr-2 text-indigo-400" />
            Your Shopping List
          </h2>

          {shoppingList.length === 0 ? (
            <div className="text-center py-10 text-indigo-300">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">Your shopping list is empty</p>
              <p className="mt-2">Add some items to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-indigo-500/30">
                    <th className="px-4 py-3 text-left text-sm font-medium text-indigo-300">Item</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-indigo-300">Category</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-indigo-300">Qty</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-indigo-300">Price</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-indigo-300">Priority</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-indigo-300">Store</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-indigo-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shoppingList.map((item) => (
                    <tr key={item._id} className="border-b border-indigo-500/10 hover:bg-indigo-900/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="font-medium text-white">{item.itemName}</div>
                        <div className="text-xs text-indigo-300 mt-1">{item.itemId}</div>
                      </td>
                      <td className="px-4 py-4 text-indigo-200">{item.category}</td>
                      <td className="px-4 py-4 text-center text-indigo-200">{item.quantity}</td>
                      <td className="px-4 py-4 text-center text-indigo-200">${item.price ? item.price.toFixed(2) : '0.00'}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                          <Tag className="w-3 h-3 mr-1" />
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-indigo-200">{item.store}</td>
                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1 bg-indigo-700/50 hover:bg-indigo-700 rounded text-indigo-200 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-1 bg-red-800/50 hover:bg-red-700 rounded text-red-200 hover:text-white transition-colors"
                            title="Delete"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-indigo-900/30">
                    <td colSpan="2" className="px-4 py-3 text-right font-medium text-indigo-200">Total Items:</td>
                    <td className="px-4 py-3 text-center font-medium text-white">
                      {shoppingList.reduce((total, item) => total + item.quantity, 0)}
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-white">
                      ${shoppingList.reduce((total, item) => total + (item.price * item.quantity || 0), 0).toFixed(2)}
                    </td>
                    <td colSpan="3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {shoppingList.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-indigo-200 mb-3 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-indigo-400" />
                Shopping Statistics
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-500/20">
                  <div className="text-sm text-indigo-300">Total Items</div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {shoppingList.reduce((total, item) => total + item.quantity, 0)}
                  </div>
                </div>
                
                <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-500/20">
                  <div className="text-sm text-indigo-300">Total Spending</div>
                  <div className="text-2xl font-bold text-white mt-1">
                    ${shoppingList.reduce((total, item) => total + (item.price * item.quantity || 0), 0).toFixed(2)}
                  </div>
                </div>
                
                <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-500/20">
                  <div className="text-sm text-indigo-300">Most Purchased Category</div>
                  <div className="text-xl font-bold text-white mt-1">
                    {
                      shoppingList.length > 0 ? 
                      Object.entries(
                        shoppingList.reduce((acc, item) => {
                          acc[item.category] = (acc[item.category] || 0) + item.quantity;
                          return acc;
                        }, {})
                      ).sort((a, b) => b[1] - a[1])[0][0]
                      : 'N/A'
                    }
                  </div>
                </div>
                
                <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-500/20">
                  <div className="text-sm text-indigo-300">Most Visited Store</div>
                  <div className="text-xl font-bold text-white mt-1">
                    {
                      shoppingList.length > 0 ? 
                      Object.entries(
                        shoppingList.reduce((acc, item) => {
                          acc[item.store] = (acc[item.store] || 0) + 1;
                          return acc;
                        }, {})
                      ).sort((a, b) => b[1] - a[1])[0][0]
                      : 'N/A'
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <footer className="mt-12 text-center text-indigo-400 text-sm">
        <p>Shopping List Manager &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default ShoppingListForm;