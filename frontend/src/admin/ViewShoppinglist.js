import { useState, useEffect } from "react";
import { 
  Wallet,
  DollarSign, 
  Tag, 
  Calendar, 
  Search,
  Filter,
  ChevronDown,
  Trash2,
  RefreshCw,
  Plus,
  Edit2,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  AlertTriangle,
  Clock
} from "lucide-react";
import SuccessAlert from "../components/Success"; // Import the SuccessAlert component

const ShoppingListDashboard = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1, 
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // State
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stats, setStats] = useState({
    totalItems: 0,
    totalSpending: 0,
    mostPurchasedCategory: '',
    mostVisitedStore: ''
  });
  const [formData, setFormData] = useState({
    itemName: "",
    category: "Groceries",
    subcategory: "",
    quantity: "1",
    price: "",
    totalPrice: "0",
    priority: "Medium",
    store: "Food City",
    purchasedDate: new Date().toISOString().split("T")[0],
    purchasedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    notes: "",
    expiryDate: ""
  });

  // Success alert state
  const [showSuccess, setShowSuccess] = useState(false);
  const [successAction, setSuccessAction] = useState("");
  const [successItemName, setSuccessItemName] = useState("");

  // Static data for form dropdowns
  const categoryOptions = [
    "Groceries", 
    "Household Essentials", 
    "Cleaning Supplies", 
    "Personal Care", 
    "Other"
  ];

  const storeOptions = [
    "Spar Supermarket", 
    "Kills", 
    "ARPICO Super Market", 
    "Fresh Market", 
    "Food City", 
    "Local Shop", 
    "Other"
  ];

  const priorityOptions = ["Low", "Medium", "High"];

  // Get subcategories from items
  const [subcategories, setSubcategories] = useState([]);

  // Update subcategories from items
  const updateSubcategories = (itemsData) => {
    if (!itemsData || itemsData.length === 0) return;
    const groceryItems = itemsData.filter(item => item.category === "Groceries" && item.subcategory);
    const uniqueSubcategories = [...new Set(groceryItems.map(item => item.subcategory))];
    setSubcategories(uniqueSubcategories);
  };

  // Fetch shopping list data from API
  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8070/shoppinglist/');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (Array.isArray(result)) {
        setItems(result);
        setFilteredItems(result);
        updateSubcategories(result);
        fetchStats();
      } else {
        throw new Error('Failed to fetch shopping list data');
      }
    } catch (err) {
      console.error('Error fetching shopping list data:', err);
      setError(err.message);
      setItems([]);
      setFilteredItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8070/shoppinglist/stats/summary');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const statsData = await response.json();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchItems();
  }, []);

  // Filter items based on search term and category
  useEffect(() => {
    let result = items;
    
    if (searchTerm) {
      result = result.filter(item => 
        item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subcategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.store?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    setFilteredItems(result);
  }, [searchTerm, selectedCategory, items]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'category' && value === 'Groceries') {
      // When category changes to Groceries, require subcategory
      setFormData({
        ...formData,
        [name]: value,
        subcategory: formData.subcategory || '' // Keep existing subcategory if exists
      });
    } else if (name === 'price' || name === 'quantity') {
      // Special handling for numeric fields
      const numValue = parseFloat(value) || 0;
      
      // Update form data with the new values
      const updatedFormData = {
        ...formData,
        [name]: value
      };
      
      // Calculate and update totalPrice
      if (name === 'price') {
        updatedFormData.totalPrice = numValue * parseFloat(formData.quantity);
      } else if (name === 'quantity') {
        updatedFormData.totalPrice = parseFloat(formData.price) * numValue;
      }
      
      setFormData(updatedFormData);
    } else {
      // For non-numeric fields, update normally
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Open modal for adding new item
  const openAddModal = () => {
    setCurrentItem(null);
    setFormData({
      itemName: "",
      category: "Groceries",
      subcategory: "",
      quantity: "1",
      price: "",
      priority: "Medium",
      store: "Food City",
      purchasedDate: new Date().toISOString().split("T")[0],
      purchasedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: "",
      expiryDate: ""
    });
    setIsModalOpen(true);
  };

  // Open modal for editing item
  const openEditModal = (item) => {
    setCurrentItem(item);
    
    // Format the date and time correctly
    const purchasedDate = new Date(item.purchasedDate).toISOString().split("T")[0];
    
    // Format expiry date if exists
    const expiryDate = item.expiryDate ? new Date(item.expiryDate).toISOString().split("T")[0] : "";
    
    setFormData({
      itemName: item.itemName,
      category: item.category,
      subcategory: item.subcategory || "",
      price: item.price,
      quantity: item.quantity,
      priority: item.priority || "Medium",
      store: item.store,
      purchasedDate: purchasedDate,
      purchasedTime: item.purchasedTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: item.notes || "",
      expiryDate: expiryDate
    });
    setIsModalOpen(true);
  };

  // Show success alert
  const triggerSuccessAlert = (action, name) => {
    setSuccessAction(action);
    setSuccessItemName(name);
    setShowSuccess(true);
    
    // Auto-hide the success alert after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  // Generate a unique ID for new items
  const generateItemId = () => {
    return 'item_' + Date.now() + Math.floor(Math.random() * 1000);
  };

  // Handle form submission (add/update item)
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      // Calculate totalPrice
      const price = parseFloat(formData.price);
      const quantity = parseInt(formData.quantity);
      const totalPrice = price * quantity;
      
      // Prepare submission data
      const submissionData = {
        ...formData,
        totalPrice: totalPrice
      };
      
      // Format the times correctly
      if (submissionData.purchasedTime && submissionData.purchasedTime.includes('AM') || submissionData.purchasedTime.includes('PM')) {
        // Convert 12-hour format to 24-hour format
        const timeComponents = submissionData.purchasedTime.match(/(\d+):(\d+)/) || [];
        if (timeComponents.length >= 3) {
          let hours = parseInt(timeComponents[1]);
          const minutes = timeComponents[2];
          const ampm = submissionData.purchasedTime.includes('PM') ? 'PM' : 'AM';
          
          if (ampm === 'PM' && hours < 12) hours += 12;
          if (ampm === 'AM' && hours === 12) hours = 0;
          
          submissionData.purchasedTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
        }
      }
      
      // Add itemId for new items
      if (!currentItem) {
        submissionData.itemId = generateItemId();
      }
      
      let url = currentItem 
        ? `http://localhost:8070/shoppinglist/${currentItem._id}`
        : 'http://localhost:8070/shoppinglist/';
      let method = currentItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // Show success alert
      triggerSuccessAlert(
        currentItem ? "updated" : "added",
        formData.itemName
      );
      
      // Refresh items after successful operation
      fetchItems();
      
    } catch (err) {
      console.error('Error saving item:', err);
      alert(`Failed to save item: ${err.message}`);
    } finally {
      setIsModalOpen(false);
    }
  };

  // Handle item deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        // Find the item being deleted to display in success message
        const itemToDelete = items.find(e => e._id === id);
        
        const response = await fetch(`http://localhost:8070/shoppinglist/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Show success alert
        if (itemToDelete) {
          triggerSuccessAlert("deleted", itemToDelete.itemName);
        }
        
        // Refresh items after successful deletion
        fetchItems();
        
      } catch (err) {
        console.error('Error deleting item:', err);
        alert(`Failed to delete item: ${err.message}`);
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if an item is expiring soon (within 3 days)
  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    return expiry <= threeDaysFromNow && expiry >= today;
  };

  // Check if an item is expired
  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    
    return expiry < today;
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High':
        return 'text-red-400 bg-red-500/20';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'Low':
        return 'text-green-400 bg-green-500/20';
      default:
        return 'text-blue-400 bg-blue-500/20';
    }
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Groceries':
        return <ShoppingBag size={18} />;
      case 'Household Essentials':
        return <Wallet size={18} />;
      case 'Cleaning Supplies':
        return <Tag size={18} />;
      case 'Personal Care':
        return <Calendar size={18} />;
      default:
        return <Tag size={18} />;
    }
  };

  // Calculate total spent by category
  const getTotalByCategory = () => {
    const totals = {};
    categoryOptions.forEach(category => {
      const categoryItems = items.filter(item => item.category === category);
      totals[category] = categoryItems.reduce((total, item) => total + Number(item.totalPrice || 0), 0);
    });
    return totals;
  };

  const categoryTotals = getTotalByCategory();

  // Handle hiding success alert
  const handleHideSuccess = () => {
    setShowSuccess(false);
  };

  // Enhanced Item Component with improved edit/delete buttons
  const ShoppingItem = ({ item, index }) => {
    // Hover state for item
    const [isHovered, setIsHovered] = useState(false);
    
    // Determine item status for styling
    const itemExpired = isExpired(item.expiryDate);
    const itemExpiringSoon = isExpiringSoon(item.expiryDate);
    
    let statusClass = '';
    if (itemExpired) {
      statusClass = 'border-red-700/50';
    } else if (itemExpiringSoon) {
      statusClass = 'border-yellow-700/50';
    } else {
      statusClass = 'border-gray-800';
    }

    return (
      <div 
        className={`flex flex-col md:flex-row md:items-center justify-between p-4 mb-3 rounded-xl transition-all duration-300 ${
          isHovered ? 'bg-gray-800/60' : 'bg-gray-900/80'
        } backdrop-blur-sm border ${statusClass}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center mb-3 md:mb-0">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/10 flex items-center justify-center mr-3">
            {getCategoryIcon(item.category)}
          </div>
          <div>
            <h3 className="font-medium text-gray-200">{item.itemName}</h3>
            <div className="flex items-center mt-1">
              <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400 mr-2">
                {item.category}
              </span>
              {item.subcategory && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-400 mr-2">
                  {item.subcategory}
                </span>
              )}
              <span className="text-sm text-gray-400 flex items-center">
                <Calendar size={12} className="mr-1" /> {formatDate(item.purchasedDate)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
          <div className="flex items-center mr-4">
            <div className="mr-6 md:mr-10">
              <p className="text-xs text-gray-400">Price</p>
              <p className="text-gray-300">Rs.{Number(item.price).toFixed(2)}</p>
            </div>
            <div className="mr-6 md:mr-10">
              <p className="text-xs text-gray-400">Qty</p>
              <p className="text-gray-300">{item.quantity}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Total</p>
              <p className="font-medium text-white">Rs.{Number(item.totalPrice).toFixed(2)}</p>
            </div>
            
            {/* Priority and Expiry info */}
            {item.priority && (
              <div className="ml-6 md:ml-10">
                <p className="text-xs text-gray-400">Priority</p>
                <p className={`text-sm px-2 py-0.5 rounded-full ${getPriorityColor(item.priority)}`}>
                  {item.priority}
                </p>
              </div>
            )}
            
            {item.expiryDate && (
              <div className="ml-6 md:ml-10">
                <p className="text-xs text-gray-400">Expires</p>
                <p className={`text-sm flex items-center ${itemExpired ? 'text-red-400' : itemExpiringSoon ? 'text-yellow-400' : 'text-gray-300'}`}>
                  {itemExpired && <AlertTriangle size={12} className="mr-1" />}
                  {itemExpiringSoon && <Clock size={12} className="mr-1" />}
                  {formatDate(item.expiryDate)}
                </p>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button 
              onClick={() => openEditModal(item)}
              className="group p-2 rounded-lg bg-blue-500/20 hover:bg-blue-600 text-blue-400 hover:text-white transition-all duration-300 flex items-center"
            >
              <Edit2 size={16} className="mr-1" />
              <span className={`${isHovered ? 'opacity-100 max-w-24' : 'opacity-0 max-w-0'} overflow-hidden transition-all duration-300`}>
                Edit
              </span>
            </button>
            
            <button 
              onClick={() => handleDelete(item._id)}
              className="group p-2 rounded-lg bg-red-500/20 hover:bg-red-600 text-red-400 hover:text-white transition-all duration-300 flex items-center"
            >
              <Trash2 size={16} className="mr-1" />
              <span className={`${isHovered ? 'opacity-100 max-w-24' : 'opacity-0 max-w-0'} overflow-hidden transition-all duration-300`}>
                Delete
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Using the imported SuccessAlert component */}
      <SuccessAlert 
        showSuccess={showSuccess}
        successAction={successAction}
        successCourseName={successItemName}
        onHide={handleHideSuccess}
      />
      
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
          <div className="absolute top-0 right-0 text-blue-500/10 text-9xl font-bold select-none z-0">
            SHOP
          </div>
          
          <div className="text-sm font-medium text-blue-400 mb-2 tracking-widest text-center">
            HOME STOCK PRO
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Shopping List Dashboard
          </h1>
          
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-medium text-blue-400">Total Items</h3>
                <p className="text-3xl font-bold">{stats.totalItems || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <ShoppingBag className="text-blue-400" size={20} />
              </div>
            </div>
            <p className="text-sm text-gray-400">Total spending: Rs.{stats.totalSpending?.toFixed(2) || "0.00"}</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-600/10 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-medium text-blue-400">Most Purchased</h3>
                <p className="text-2xl font-bold">{stats.mostPurchasedCategory || "None"}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Tag className="text-blue-400" size={18} />
              </div>
            </div>
            <p className="text-sm text-gray-400">Top category by quantity</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-600/10 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-medium text-blue-400">Most Visited</h3>
                <p className="text-2xl font-bold">{stats.mostVisitedStore || "None"}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <DollarSign className="text-blue-400" size={18} />
              </div>
            </div>
            <p className="text-sm text-gray-400">Top store by visits</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-600/10 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-medium text-blue-400">Expiring Soon</h3>
                <p className="text-2xl font-bold">
                  {items.filter(item => isExpiringSoon(item.expiryDate)).length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Clock className="text-yellow-400" size={18} />
              </div>
            </div>
            <p className="text-sm text-gray-400">Items expiring in 3 days</p>
          </div>
        </div>

        {/* Controls Interface */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Toolbar */}
          <div className="bg-gray-800/50 p-4 border-b border-gray-800 flex flex-col md:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search shopping list..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800/80 text-white border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            {/* Filters & Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative inline-block">
                <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-4 py-2 border border-gray-700">
                  <Filter size={16} className="text-gray-400" />
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-transparent text-gray-300 appearance-none focus:outline-none cursor-pointer pr-8"
                  >
                    <option value="All">All Categories</option>
                    {categoryOptions.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="text-gray-400 absolute right-3" />
                </div>
              </div>
              
              <button 
                onClick={fetchItems}
                className="bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg p-2 border border-gray-700"
              >
                <RefreshCw size={20} className={`text-gray-300 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              
              <button 
                onClick={openAddModal}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg px-4 py-2 text-white font-medium shadow-lg shadow-blue-500/20"
              >
                <Plus size={18} />
                <span>Add Item</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Shopping List with Prominent Edit/Delete Buttons */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-400 mb-4">Your Shopping List</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl">
              <RefreshCw size={32} className="text-blue-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl">
              <X size={32} className="mx-auto mb-4" />
              <p>Error loading shopping list: {error}</p>
              <button 
                onClick={fetchItems}
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium"
              >
                Try Again
              </button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl">
              <FileText size={32} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-300">No items found</p>
              <p className="text-gray-400 text-sm mt-2">
                {searchTerm || selectedCategory !== "All" 
                  ? "Try adjusting your search or filters" 
                  : "Add your first shopping item"}
              </p>
              <button 
                onClick={openAddModal}
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium flex items-center gap-2 mx-auto"
              >
                <Plus size={18} />
                <span>Add New Item</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item, index) => (
                <ShoppingItem key={item._id || index} item={item} index={index} />
              ))}
              
              {/* Pagination Component (Simplified) */}
              <div className="flex justify-between items-center pt-6">
                <p className="text-sm text-gray-400">
                  Showing {filteredItems.length} of {items.length} items
                </p>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-lg border border-gray-700 hover:bg-gray-800">
                    <ChevronLeft size={16} className="text-gray-400" />
                  </button>
                  <div className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400">
                    1
                  </div>
                  <button className="p-2 rounded-lg border border-gray-700 hover:bg-gray-800">
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Category Spending Breakdown */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-xl mb-8">
          <h2 className="text-xl font-semibold text-blue-400 mb-4">Spending by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categoryOptions.map((category) => (
              <div key={category} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                      {getCategoryIcon(category)}
                    </div>
                    <h3 className="font-medium text-gray-200">{category}</h3>
                  </div>
                  <span className="font-semibold">Rs.{categoryTotals[category].toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, (categoryTotals[category] / stats.totalSpending) * 100 || 0)}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div 
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-blue-400">
                {currentItem ? "Edit Item" : "Add New Item"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-full"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item name */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  placeholder="Enter item name"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              {/* Two-column layout for category and subcategory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white appearance-none"
                      required
                    >
                      {categoryOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Subcategory {formData.category === 'Groceries' && <span className="text-red-400">*</span>}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      placeholder="e.g., Dairy, Fruits, Vegetables"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                      required={formData.category === 'Groceries'}
                      list="subcategory-options"
                    />
                    <datalist id="subcategory-options">
                      {subcategories.map(sub => (
                        <option key={sub} value={sub} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>

              {/* Two-column layout for price and quantity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    step="0.01"
                    min="0"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity"
                    min="1"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
              </div>

              {/* Two-column layout for store and priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Store
                  </label>
                  <div className="relative">
                    <select
                      name="store"
                      value={formData.store}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white appearance-none"
                      required
                    >
                      {storeOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Priority
                  </label>
                  <div className="relative">
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white appearance-none"
                    >
                      {priorityOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Two-column layout for purchased date and expiry date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Purchased Date
                  </label>
                  <input
                    type="date"
                    name="purchasedDate"
                    value={formData.purchasedDate}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any additional notes here..."
                  rows="3"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>

              {/* Total Price Preview */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-400 font-medium">Total Price:</span>
                  <span className="text-xl font-bold text-white">
                    Rs.{(parseFloat(formData.price) * parseInt(formData.quantity)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium"
                >
                  {currentItem ? "Update Item" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 py-6">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Home Stock Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ShoppingListDashboard;