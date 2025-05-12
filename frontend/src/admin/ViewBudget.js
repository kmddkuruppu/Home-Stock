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
  ShoppingBag
} from "lucide-react";
import SuccessAlert from "../components/Success"; // Import the SuccessAlert component

const BudgetDashboard = () => {
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
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    price: "",
    quantity: "1",
    store: "Unknown",
    purchasedDate: new Date().toISOString().split("T")[0],
    purchasedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    notes: "",
    paymentMethod: "Cash",
    status: "Completed"
  });

  // Success alert state
  const [showSuccess, setShowSuccess] = useState(false);
  const [successAction, setSuccessAction] = useState("");
  const [successItemName, setSuccessItemName] = useState("");

  // Get available categories from database
  const [categories, setCategories] = useState([]);

  // Fetch categories from expenses
  const updateCategories = (expensesData) => {
    if (!expensesData || expensesData.length === 0) return;
    const uniqueCategories = [...new Set(expensesData.map(expense => expense.category))];
    setCategories(uniqueCategories);
  };

  // Fetch budget data from API
  const fetchExpenses = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8070/budget/');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (Array.isArray(result)) {
        setExpenses(result);
        setFilteredExpenses(result);
        updateCategories(result);
      } else {
        throw new Error('Failed to fetch budget data');
      }
    } catch (err) {
      console.error('Error fetching budget data:', err);
      setError(err.message);
      setExpenses([]);
      setFilteredExpenses([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Filter expenses based on search term and category
  useEffect(() => {
    let result = expenses;
    
    if (searchTerm) {
      result = result.filter(expense => 
        expense.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.store?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.totalPrice?.toString().includes(searchTerm)
      );
    }
    
    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter(expense => expense.category === selectedCategory);
    }
    
    setFilteredExpenses(result);
  }, [searchTerm, selectedCategory, expenses]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for numeric fields
    if (name === 'price' || name === 'quantity') {
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

  // Open modal for adding new expense
  const openAddModal = () => {
    setCurrentExpense(null);
    setFormData({
      itemName: "",
      category: "",
      price: "",
      quantity: "1",
      store: "Unknown",
      purchasedDate: new Date().toISOString().split("T")[0],
      purchasedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: "",
      paymentMethod: "Cash",
      status: "Completed"
    });
    setIsModalOpen(true);
  };

  // Open modal for editing expense
  const openEditModal = (expense) => {
    setCurrentExpense(expense);
    setFormData({
      itemName: expense.itemName,
      category: expense.category,
      price: expense.price,
      quantity: expense.quantity,
      store: expense.store || "Unknown",
      purchasedDate: new Date(expense.purchasedDate).toISOString().split("T")[0],
      purchasedTime: expense.purchasedTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: expense.notes || "",
      paymentMethod: expense.paymentMethod || "Cash",
      status: expense.status || "Completed"
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

  // Generate a unique ID for new expenses
  const generateItemId = () => {
    return 'item_' + Date.now() + Math.floor(Math.random() * 1000);
  };

  // Handle form submission (add/update expense)
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
      
      // Add itemId for new expenses
      if (!currentExpense) {
        submissionData.itemId = generateItemId();
      }
      
      let url = currentExpense 
        ? `http://localhost:8070/budget/${currentExpense._id}`
        : 'http://localhost:8070/budget/';
      let method = currentExpense ? 'PUT' : 'POST';
      
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
        currentExpense ? "updated" : "added",
        formData.itemName
      );
      
      // Refresh expenses after successful operation
      fetchExpenses();
      
    } catch (err) {
      console.error('Error saving expense:', err);
      alert(`Failed to save expense: ${err.message}`);
    } finally {
      setIsModalOpen(false);
    }
  };

  // Handle expense deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        // Find the expense being deleted to display in success message
        const expenseToDelete = expenses.find(e => e._id === id);
        
        const response = await fetch(`http://localhost:8070/budget/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Show success alert
        if (expenseToDelete) {
          triggerSuccessAlert("deleted", expenseToDelete.itemName);
        }
        
        // Refresh expenses after successful deletion
        fetchExpenses();
        
      } catch (err) {
        console.error('Error deleting expense:', err);
        alert(`Failed to delete expense: ${err.message}`);
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate total expenses
  const calculateTotal = () => {
    return filteredExpenses.reduce((total, expense) => total + Number(expense.totalPrice || 0), 0).toFixed(2);
  };

  // Get category statistics
  const getCategoryStats = () => {
    const stats = {};
    expenses.forEach(expense => {
      if (!stats[expense.category]) {
        stats[expense.category] = 0;
      }
      stats[expense.category] += Number(expense.totalPrice || 0);
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

  // Handle hiding success alert
  const handleHideSuccess = () => {
    setShowSuccess(false);
  };

  // Enhanced Expense Item Component with improved edit/delete buttons
  const ExpenseItem = ({ expense, index }) => {
    // Hover state for item
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div 
        className={`flex flex-col md:flex-row md:items-center justify-between p-4 mb-3 rounded-xl transition-all duration-300 ${
          isHovered ? 'bg-gray-800/60' : 'bg-gray-900/80'
        } backdrop-blur-sm border border-gray-800`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center mb-3 md:mb-0">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/10 flex items-center justify-center mr-3">
            <ShoppingBag className="text-blue-400" size={18} />
          </div>
          <div>
            <h3 className="font-medium text-gray-200">{expense.itemName}</h3>
            <div className="flex items-center mt-1">
              <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400 mr-2">
                {expense.category}
              </span>
              <span className="text-sm text-gray-400 flex items-center">
                <Calendar size={12} className="mr-1" /> {formatDate(expense.purchasedDate)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
          <div className="flex items-center mr-4">
            <div className="mr-6 md:mr-10">
              <p className="text-xs text-gray-400">Price</p>
              <p className="text-gray-300">Rs.{Number(expense.price).toFixed(2)}</p>
            </div>
            <div className="mr-6 md:mr-10">
              <p className="text-xs text-gray-400">Qty</p>
              <p className="text-gray-300">{expense.quantity}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Total</p>
              <p className="font-medium text-white">Rs.{Number(expense.totalPrice).toFixed(2)}</p>
            </div>
          </div>
          
          {/* Improved Action Buttons - More prominent */}
          <div className="flex space-x-2">
            <button 
              onClick={() => openEditModal(expense)}
              className="group p-2 rounded-lg bg-blue-500/20 hover:bg-blue-600 text-blue-400 hover:text-white transition-all duration-300 flex items-center"
            >
              <Edit2 size={16} className="mr-1" />
              <span className={`${isHovered ? 'opacity-100 max-w-24' : 'opacity-0 max-w-0'} overflow-hidden transition-all duration-300`}>
                Edit
              </span>
            </button>
            
            <button 
              onClick={() => handleDelete(expense._id)}
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
            BUDGET
          </div>
          
          <div className="text-sm font-medium text-blue-400 mb-2 tracking-widest text-center">
            HOME STOCK PRO
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Budget Dashboard
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
                <h3 className="text-lg font-medium text-blue-400">Total Budget</h3>
                <p className="text-3xl font-bold">Rs.{calculateTotal()}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <DollarSign className="text-blue-400" size={20} />
              </div>
            </div>
          </div>
          
          {Object.entries(categoryStats).slice(0, 3).map(([category, amount], idx) => (
            <div 
              key={category}
              className="bg-gradient-to-br from-purple-500/20 to-blue-600/10 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-xl"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-medium text-blue-400">{category}</h3>
                  <p className="text-2xl font-bold">Rs.{amount.toFixed(2)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Tag className="text-blue-400" size={18} />
                </div>
              </div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full mt-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(100, (amount / (calculateTotal() || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
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
                placeholder="Search expenses..." 
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
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="text-gray-400 absolute right-3" />
                </div>
              </div>
              
              <button 
                onClick={fetchExpenses}
                className="bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg p-2 border border-gray-700"
              >
                <RefreshCw size={20} className={`text-gray-300 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              
              <button 
                onClick={openAddModal}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg px-4 py-2 text-white font-medium shadow-lg shadow-blue-500/20"
              >
                <Plus size={18} />
                <span>Add Expense</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Expenses List with Prominent Edit/Delete Buttons */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-400 mb-4">Your Expenses</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl">
              <RefreshCw size={32} className="text-blue-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl">
              <X size={32} className="mx-auto mb-2 opacity-70" />
              <p>Error loading budget data: {error}</p>
              <button 
                onClick={fetchExpenses}
                className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300"
              >
                Try Again
              </button>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="p-12 text-center text-gray-400 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl">
              <FileText size={48} className="mx-auto mb-4 opacity-40" />
              <p className="text-lg">No expenses found</p>
              <button 
                onClick={openAddModal}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium"
              >
                Add Your First Expense
              </button>
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredExpenses.map((expense, idx) => (
                <ExpenseItem key={expense._id} expense={expense} index={idx} />
              ))}
            </div>
          )}
        </div>
        
        {/* Category Distribution */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-blue-400 mb-4">Category Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(categoryStats).map(([category, amount], idx) => (
              <div 
                key={category}
                className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-5 shadow-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-200">{category}</h3>
                    <p className="text-2xl font-bold text-blue-400">Rs.{amount.toFixed(2)}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/10 flex items-center justify-center">
                    <Tag className="text-blue-400" size={18} />
                  </div>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full mt-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (amount / (calculateTotal() || 1)) * 100)}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-right text-sm text-gray-400">
                  {Math.round((amount / (calculateTotal() || 1)) * 100)}% of total
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-blue-500/10">
            <h2 className="text-2xl font-bold text-blue-400 mb-6">
              {currentExpense ? "Edit Expense" : "Add New Expense"}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Item Name</label>
                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Price (LKR)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    list="categories"
                    required
                    />
                  <datalist id="categories">
                    {categories.map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Store</label>
                  <input
                    type="text"
                    name="store"
                    value={formData.store}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      name="purchasedDate"
                      value={formData.purchasedDate}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Time</label>
                    <input
                      type="time"
                      name="purchasedTime"
                      value={formData.purchasedTime}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Mobile Payment">Mobile Payment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
                    placeholder="Optional notes about this expense"
                  />
                </div>
                
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg focus:outline-none transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 focus:outline-none shadow-md shadow-blue-500/20"
                  >
                    {currentExpense ? "Update Expense" : "Add Expense"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-12 text-center border-t border-gray-800">
        <div className="mb-4">
          <h3 className="text-blue-400 font-medium text-lg">Home Stock Pro</h3>
          <p className="text-gray-400 text-sm">Smart budget management for your household</p>
        </div>
        <div className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Home Stock Pro. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default BudgetDashboard;