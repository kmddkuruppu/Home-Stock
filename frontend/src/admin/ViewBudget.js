import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  ChevronRight
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
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0]
  });

  // Success alert state
  const [showSuccess, setShowSuccess] = useState(false);
  const [successAction, setSuccessAction] = useState("");
  const [successCourseName, setSuccessCourseName] = useState("");

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
      
      if (result.expenses) {
        setExpenses(result.expenses);
        setFilteredExpenses(result.expenses);
        updateCategories(result.expenses);
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
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.amount?.toString().includes(searchTerm)
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
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open modal for adding new expense
  const openAddModal = () => {
    setCurrentExpense(null);
    setFormData({
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0]
    });
    setIsModalOpen(true);
  };

  // Open modal for editing expense
  const openEditModal = (expense) => {
    setCurrentExpense(expense);
    setFormData({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: new Date(expense.date).toISOString().split("T")[0]
    });
    setIsModalOpen(true);
  };

  // Show success alert
  const triggerSuccessAlert = (action, name) => {
    setSuccessAction(action);
    setSuccessCourseName(name);
    setShowSuccess(true);
    
    // Auto-hide the success alert after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  // Handle form submission (add/update expense)
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      let url = currentExpense 
        ? `http://localhost:8070/budget/update/${currentExpense._id}`
        : 'http://localhost:8070/budget/add';
      let method = currentExpense ? 'PUT' : 'POST';
      let body = formData;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // Show success alert
      triggerSuccessAlert(
        currentExpense ? "updated" : "added",
        formData.description
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
        
        const response = await fetch(`http://localhost:8070/budget/delete/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Show success alert
        if (expenseToDelete) {
          triggerSuccessAlert("deleted", expenseToDelete.description);
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

  // Format time
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // Calculate total expenses
  const calculateTotal = () => {
    return filteredExpenses.reduce((total, expense) => total + Number(expense.amount || 0), 0).toFixed(2);
  };

  // Get category statistics
  const getCategoryStats = () => {
    const stats = {};
    expenses.forEach(expense => {
      if (!stats[expense.category]) {
        stats[expense.category] = 0;
      }
      stats[expense.category] += Number(expense.amount || 0);
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

  // Handle hiding success alert
  const handleHideSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Success alert component */}
      <SuccessAlert 
        showSuccess={showSuccess}
        successAction={successAction}
        successCourseName={successCourseName}
        onHide={handleHideSuccess}
      />
      
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-0 right-0 text-blue-500/10 text-9xl font-bold select-none z-0"
          >
            BUDGET
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-sm font-medium text-blue-400 mb-2 tracking-widest text-center"
          >
            HOME STOCK PRO
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          >
            Budget Dashboard
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-xl"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-medium text-blue-400">Total Budget</h3>
                <p className="text-3xl font-bold">Rs.{calculateTotal()}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <DollarSign className="text-blue-400" size={20} />
              </div>
            </div>
          </motion.div>
          
          {Object.entries(categoryStats).slice(0, 3).map(([category, amount], idx) => (
            <motion.div 
              key={category}
              whileHover={{ y: -5 }}
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
            </motion.div>
          ))}
        </div>

        {/* Controls and Table Interface */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
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
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openAddModal}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg px-4 py-2 text-white font-medium shadow-lg shadow-blue-500/20"
              >
                <Plus size={18} />
                <span>Add Expense</span>
              </motion.button>
            </div>
          </div>
          
          {/* Expenses Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw size={32} className="text-blue-400 animate-spin" />
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-400">
                <X size={32} className="mx-auto mb-2 opacity-70" />
                <p>Error loading budget data: {error}</p>
                <button 
                  onClick={fetchExpenses}
                  className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredExpenses.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                          <FileText size={32} className="mx-auto mb-2 opacity-40" />
                          <p>No expenses found</p>
                        </td>
                      </tr>
                    ) : (
                      filteredExpenses.map((expense, idx) => (
                        <motion.tr 
                          key={expense._id} 
                          variants={fadeIn}
                          custom={idx}
                          className="hover:bg-gray-800/30"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/10 flex items-center justify-center mr-3">
                                <FileText className="text-blue-400" size={16} />
                              </div>
                              <span className="font-medium text-gray-200">{expense.description}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                              {expense.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-200">
                            Rs.{Number(expense.amount).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                            <div className="flex flex-col">
                              <span className="flex items-center text-sm">
                                <Calendar size={14} className="mr-1" /> {formatDate(expense.date)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                onClick={() => openEditModal(expense)}
                                className="p-1.5 rounded-full bg-blue-500/20 hover:bg-blue-600 text-blue-400 hover:text-white transition duration-300"
                              >
                                <Edit2 size={16} />
                              </motion.button>
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                onClick={() => handleDelete(expense._id)}
                                className="p-1.5 rounded-full bg-red-500/20 hover:bg-red-600 text-red-400 hover:text-white transition duration-300"
                              >
                                <Trash2 size={16} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </motion.div>
            )}
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-800">
            <div className="text-sm text-gray-400">
              Showing <span className="font-medium text-blue-400">{filteredExpenses.length}</span> expenses
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50">
                <ChevronLeft size={16} />
              </button>
              <button className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Category Distribution */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-blue-400 mb-4">Category Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(categoryStats).map(([category, amount], idx) => (
              <motion.div 
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx, duration: 0.5 }}
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
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-blue-500/10"
          >
            <h2 className="text-2xl font-bold text-blue-400 mb-6">
              {currentExpense ? "Edit Expense" : "Add New Expense"}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Amount (LKR)</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.length > 0 ? (
                      categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))
                    ) : (
                      // Default options if no categories are available from database
                      ["Food", "Transport", "Entertainment", "Housing", "Utilities", "Other"].map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))
                    )}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium shadow-lg shadow-blue-500/20 hover:opacity-90 transition-opacity"
                >
                  {currentExpense ? "Update" : "Add"} Expense
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BudgetDashboard;