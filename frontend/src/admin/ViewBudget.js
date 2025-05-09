import { useState, useEffect } from "react";
import { Trash2, Edit2, Plus, Filter, Search, X, ChevronLeft, ChevronRight, DollarSign, Calendar, Tag, FileText } from "lucide-react";

// Main Dashboard Component
export default function BudgetDashboard() {
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

  // Mock categories for demonstration
  const categories = ["Food", "Transport", "Entertainment", "Housing", "Utilities", "Other"];

  // Mock data for demo purposes
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      const mockData = [
        {
          _id: "1",
          amount: 125.50,
          category: "Food",
          description: "Weekly grocery shopping",
          date: "2025-05-07T00:00:00.000Z"
        },
        {
          _id: "2",
          amount: 45.00,
          category: "Transport",
          description: "Uber ride",
          date: "2025-05-08T00:00:00.000Z"
        },
        {
          _id: "3",
          amount: 89.99,
          category: "Entertainment",
          description: "Concert tickets",
          date: "2025-05-06T00:00:00.000Z"
        },
        {
          _id: "4",
          amount: 850.00,
          category: "Housing",
          description: "Monthly rent",
          date: "2025-05-01T00:00:00.000Z"
        },
        {
          _id: "5",
          amount: 120.00,
          category: "Utilities",
          description: "Electricity bill",
          date: "2025-05-05T00:00:00.000Z"
        }
      ];
      setExpenses(mockData);
      setFilteredExpenses(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter expenses based on search term and category
  useEffect(() => {
    let result = expenses;
    
    if (searchTerm) {
      result = result.filter(expense => 
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.amount.toString().includes(searchTerm)
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

  // Handle form submission
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    // Simulating API call for add/update
    if (currentExpense) {
      // Update existing expense
      const updatedExpenses = expenses.map(exp => 
        exp._id === currentExpense._id ? { ...exp, ...formData } : exp
      );
      setExpenses(updatedExpenses);
    } else {
      // Add new expense
      const newExpense = {
        _id: Math.random().toString(36).substr(2, 9),
        ...formData,
        date: new Date(formData.date).toISOString()
      };
      setExpenses([...expenses, newExpense]);
    }
    
    setIsModalOpen(false);
  };

  // Handle expense deletion
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      // Simulating API call for delete
      const updatedExpenses = expenses.filter(exp => exp._id !== id);
      setExpenses(updatedExpenses);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate total expenses
  const calculateTotal = () => {
    return filteredExpenses.reduce((total, expense) => total + Number(expense.amount), 0).toFixed(2);
  };

  // Get category statistics
  const getCategoryStats = () => {
    const stats = {};
    expenses.forEach(expense => {
      if (!stats[expense.category]) {
        stats[expense.category] = 0;
      }
      stats[expense.category] += Number(expense.amount);
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="py-6 px-6 bg-gray-800 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-400">Budget Admin Dashboard</h1>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-300"
          >
            <Plus size={18} />
            <span>Add Expense</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Filter & Search Bar */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200"
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

        {/* Expenses Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-400">Loading expenses...</td>
                  </tr>
                ) : filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-400">No expenses found</td>
                  </tr>
                ) : (
                  filteredExpenses.map((expense) => (
                    <tr key={expense._id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                            <FileText className="text-indigo-400" size={16} />
                          </div>
                          <span className="font-medium text-gray-200">{expense.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-400">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-200">
                        ${Number(expense.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => openEditModal(expense)}
                            className="p-1 rounded-full bg-gray-700 hover:bg-blue-600 text-gray-400 hover:text-white transition duration-300"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(expense._id)}
                            className="p-1 rounded-full bg-gray-700 hover:bg-red-600 text-gray-400 hover:text-white transition duration-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-700">
            <div className="text-sm text-gray-400">
             Showing <span className="font-medium text-gray-200">{filteredExpenses.length}</span> expenses
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-gray-700 text-gray-400 hover:bg-gray-600 disabled:opacity-50">
                <ChevronLeft size={16} />
              </button>
              <button className="p-2 rounded-lg bg-gray-700 text-gray-400 hover:bg-gray-600 disabled:opacity-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 appearance-none"
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400" size={18} />
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total</p>
              <p className="text-xl font-bold text-white">${calculateTotal()}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <DollarSign className="text-indigo-400" size={20} />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(categoryStats).slice(0, 4).map(([category, amount]) => (
            <div key={category} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-gray-400 text-sm">{category}</p>
                  <p className="text-lg font-semibold text-white">${amount.toFixed(2)}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Tag className="text-indigo-400" size={16} />
                </div>
              </div>
              <div className="w-full bg-gray-700 h-1 rounded-full">
                <div 
                  className="bg-indigo-500 h-1 rounded-full" 
                  style={{ width: `${Math.min(100, (amount / calculateTotal()) * 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}