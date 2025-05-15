import { useState, useEffect } from "react";
import { 
  Package,
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
  AlertTriangle,
  Archive,
  Box
} from "lucide-react";
import SuccessAlert from "../components/Success"; // Using the same SuccessAlert component

const InventoryDashboard = () => {
  // State
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [formData, setFormData] = useState({
    itemName: "",
    category: "Raw Materials",
    subcategory: "",
    quantity: "1",
    unit: "pcs",
    unitCost: "0",
    location: "Warehouse A",
    minStockLevel: "5",
    supplier: "",
    expiryDate: "",
    notes: ""
  });

  // Success alert state
  const [showSuccess, setShowSuccess] = useState(false);
  const [successAction, setSuccessAction] = useState("");
  const [successItemName, setSuccessItemName] = useState("");

  // Fixed data from Mongoose schema
  const categoryOptions = ['Raw Materials', 'Finished Products', 'Packaging', 'Equipment', 'Office Supplies', 'Other'];
  const unitOptions = ['pcs', 'kg', 'g', 'l', 'ml', 'box', 'carton', 'pack', 'other'];
  const locationOptions = ['Warehouse A', 'Warehouse B', 'Production Floor', 'Store Room', 'Office', 'Other'];
  const statusOptions = ['In Stock', 'Low Stock', 'Out of Stock', 'On Order'];

  // Fetch inventory data from API
  const fetchInventory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8070/inventory/');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (Array.isArray(result)) {
        setInventory(result);
        setFilteredInventory(result);
      } else {
        throw new Error('Failed to fetch inventory data');
      }
    } catch (err) {
      console.error('Error fetching inventory data:', err);
      setError(err.message);
      setInventory([]);
      setFilteredInventory([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchInventory();
  }, []);

  // Filter inventory based on search term, category, location, and status
  useEffect(() => {
    let result = inventory;
    
    if (searchTerm) {
      result = result.filter(item => 
        item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subcategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    if (selectedLocation && selectedLocation !== "All") {
      result = result.filter(item => item.location === selectedLocation);
    }
    
    if (selectedStatus && selectedStatus !== "All") {
      result = result.filter(item => item.status === selectedStatus);
    }
    
    setFilteredInventory(result);
  }, [searchTerm, selectedCategory, selectedLocation, selectedStatus, inventory]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for numeric fields
    if (name === 'quantity' || name === 'unitCost' || name === 'minStockLevel') {
      // Update form data with the new values
      const updatedFormData = {
        ...formData,
        [name]: value
      };
      
      // Calculate totalValue if both quantity and unitCost are available
      if ((name === 'quantity' || name === 'unitCost') && 
          updatedFormData.quantity && updatedFormData.unitCost) {
        const qty = parseFloat(updatedFormData.quantity) || 0;
        const cost = parseFloat(updatedFormData.unitCost) || 0;
        updatedFormData.totalValue = (qty * cost).toString();
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

  // Generate a unique ID for new inventory items
  const generateItemId = () => {
    return 'inv_' + Date.now() + Math.floor(Math.random() * 1000);
  };

  // Open modal for adding new inventory item
  const openAddModal = () => {
    setCurrentItem(null);
    // Set default values from schema
    setFormData({
      itemName: "",
      category: "Raw Materials",
      subcategory: "",
      quantity: "1",
      unit: "pcs",
      unitCost: "0",
      location: "Warehouse A",
      minStockLevel: "5",
      supplier: "",
      expiryDate: "",
      notes: ""
    });
    setIsModalOpen(true);
  };

  // Open modal for editing inventory item
  const openEditModal = (item) => {
    setCurrentItem(item);
    setFormData({
      itemName: item.itemName || "",
      category: item.category || "Raw Materials",
      subcategory: item.subcategory || "",
      quantity: item.quantity?.toString() || "0",
      unit: item.unit || "pcs",
      unitCost: item.unitCost?.toString() || "0",
      totalValue: item.totalValue?.toString() || "0",
      location: item.location || "Warehouse A",
      minStockLevel: item.minStockLevel?.toString() || "5",
      status: item.status || "In Stock",
      supplier: item.supplier || "",
      expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split("T")[0] : "",
      notes: item.notes || ""
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

  // Handle form submission (add/update inventory item)
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      // Calculate totalValue
      const quantity = parseFloat(formData.quantity) || 0;
      const unitCost = parseFloat(formData.unitCost) || 0;
      const totalValue = quantity * unitCost;
      
      // Prepare submission data
      const submissionData = {
        ...formData,
        quantity: quantity,
        unitCost: unitCost,
        totalValue: totalValue
      };
      
      // Determine status based on quantity and minStockLevel
      const minStockLevel = parseFloat(formData.minStockLevel) || 0;
      
      if (quantity <= 0) {
        submissionData.status = 'Out of Stock';
      } else if (quantity < minStockLevel) {
        submissionData.status = 'Low Stock';
      } else {
        submissionData.status = 'In Stock';
      }
      
      // Add itemId for new items
      if (!currentItem) {
        submissionData.itemId = generateItemId();
      }
      
      let url = currentItem 
        ? `http://localhost:8070/inventory/${currentItem._id}`
        : 'http://localhost:8070/inventory/';
      let method = currentItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }
      
      // Show success alert
      triggerSuccessAlert(
        currentItem ? "updated" : "added",
        formData.itemName
      );
      
      // Refresh inventory after successful operation
      fetchInventory();
      setIsModalOpen(false);
      
    } catch (err) {
      console.error('Error saving inventory item:', err);
      alert(`Failed to save inventory item: ${err.message}`);
    }
  };

  // Handle inventory item deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this inventory item?")) {
      try {
        // Find the item being deleted to display in success message
        const itemToDelete = inventory.find(item => item._id === id);
        
        const response = await fetch(`http://localhost:8070/inventory/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }
        
        // Show success alert
        if (itemToDelete) {
          triggerSuccessAlert("deleted", itemToDelete.itemName);
        }
        
        // Refresh inventory after successful deletion
        fetchInventory();
        
      } catch (err) {
        console.error('Error deleting inventory item:', err);
        alert(`Failed to delete inventory item: ${err.message}`);
      }
    }
  };

  // Handle updating inventory quantity
  const handleQuantityAdjustment = async (id, type) => {
    try {
      // Find the current item
      const item = inventory.find(i => i._id === id);
      if (!item) return;

      // Prompt for adjustment quantity and reason
      const adjustment = parseInt(prompt(`Enter quantity to ${type === 'add' ? 'add to' : 'remove from'} inventory:`, "1"));
      if (isNaN(adjustment) || adjustment <= 0) return;
      
      const reason = prompt("Enter reason for adjustment:", type === 'add' ? "Restock" : "Consumption");
      if (reason === null) return;

      // Calculate the actual adjustment value (positive for add, negative for remove)
      const actualAdjustment = type === 'add' ? adjustment : -adjustment;
      
      // Make the API call to adjust quantity
      const response = await fetch(`http://localhost:8070/inventory/${id}/quantity`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adjustment: actualAdjustment,
          reason: reason
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }
      
      // Show success message
      triggerSuccessAlert(
        type === 'add' ? "restocked" : "updated",
        item.itemName
      );
      
      // Refresh data
      fetchInventory();
      
    } catch (err) {
      console.error('Error adjusting quantity:', err);
      alert(`Failed to adjust quantity: ${err.message}`);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate inventory statistics
  const calculateTotalValue = () => {
    return filteredInventory.reduce((total, item) => total + Number(item.totalValue || 0), 0).toFixed(2);
  };

  const getLowStockCount = () => {
    return inventory.filter(item => item.status === 'Low Stock').length;
  };

  const getOutOfStockCount = () => {
    return inventory.filter(item => item.status === 'Out of Stock').length;
  };

  const getExpiringCount = () => {
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);
    
    return inventory.filter(item => 
      item.expiryDate && 
      new Date(item.expiryDate) >= today && 
      new Date(item.expiryDate) <= thirtyDaysLater
    ).length;
  };

  // Get category statistics
  const getCategoryStats = () => {
    const stats = {};
    categoryOptions.forEach(cat => {
      stats[cat] = 0;
    });
    
    inventory.forEach(item => {
      if (stats[item.category] !== undefined) {
        stats[item.category] += Number(item.totalValue || 0);
      }
    });
    
    return stats;
  };

  const categoryStats = getCategoryStats();

  // Handle hiding success alert
  const handleHideSuccess = () => {
    setShowSuccess(false);
  };

  // Enhanced Inventory Item Component with improved buttons
  const InventoryItem = ({ item }) => {
    // Hover state for item
    const [isHovered, setIsHovered] = useState(false);

    // Get styling based on status
    const getStatusStyle = (status) => {
      switch(status) {
        case 'In Stock':
          return 'bg-green-500/20 text-green-400';
        case 'Low Stock':
          return 'bg-yellow-500/20 text-yellow-400';
        case 'Out of Stock':
          return 'bg-red-500/20 text-red-400';
        case 'On Order':
          return 'bg-blue-500/20 text-blue-400';
        default:
          return 'bg-gray-500/20 text-gray-400';
      }
    };

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
            <Package className="text-blue-400" size={18} />
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
              <span className={`px-2 py-0.5 text-xs rounded-full mr-2 ${getStatusStyle(item.status)}`}>
                {item.status}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
          <div className="flex items-center mr-4">
            <div className="mr-6 md:mr-8">
              <p className="text-xs text-gray-400">Quantity</p>
              <p className="text-gray-300">{item.quantity} {item.unit}</p>
            </div>
            <div className="mr-6 md:mr-8">
              <p className="text-xs text-gray-400">Location</p>
              <p className="text-gray-300">{item.location}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Value</p>
              <p className="font-medium text-white">Rs.{Number(item.totalValue).toFixed(2)}</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button 
              onClick={() => handleQuantityAdjustment(item._id, 'add')}
              className="group p-2 rounded-lg bg-green-500/20 hover:bg-green-600 text-green-400 hover:text-white transition-all duration-300 flex items-center"
            >
              <Plus size={16} className="mr-1" />
              <span className={`${isHovered ? 'opacity-100 max-w-24' : 'opacity-0 max-w-0'} overflow-hidden transition-all duration-300`}>
                Add
              </span>
            </button>
            
            <button 
              onClick={() => handleQuantityAdjustment(item._id, 'remove')}
              className="group p-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-600 text-yellow-400 hover:text-white transition-all duration-300 flex items-center"
            >
              <Archive size={16} className="mr-1" />
              <span className={`${isHovered ? 'opacity-100 max-w-24' : 'opacity-0 max-w-0'} overflow-hidden transition-all duration-300`}>
                Use
              </span>
            </button>
            
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
        successCourseName={successItemName} // Reusing the prop name from the original component
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
            INVENTORY
          </div>
          
          <div className="text-sm font-medium text-blue-400 mb-2 tracking-widest text-center">
            HOME STOCK PRO
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Inventory Management
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
                <h3 className="text-lg font-medium text-blue-400">Total Value</h3>
                <p className="text-3xl font-bold">Rs.{calculateTotalValue()}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <DollarSign className="text-blue-400" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-600/10 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-medium text-yellow-400">Low Stock</h3>
                <p className="text-3xl font-bold">{getLowStockCount()} items</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <AlertTriangle className="text-yellow-400" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-medium text-red-400">Out of Stock</h3>
                <p className="text-3xl font-bold">{getOutOfStockCount()} items</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <X className="text-red-400" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-medium text-purple-400">Expiring Soon</h3>
                <p className="text-3xl font-bold">{getExpiringCount()} items</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Calendar className="text-purple-400" size={20} />
              </div>
            </div>
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
                placeholder="Search inventory..." 
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
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <div className="relative inline-block">
                <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2 border border-gray-700">
                  <Tag size={16} className="text-gray-400" />
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
              
              {/* Location Filter */}
              <div className="relative inline-block">
                <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2 border border-gray-700">
                  <Box size={16} className="text-gray-400" />
                  <select 
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="bg-transparent text-gray-300 appearance-none focus:outline-none cursor-pointer pr-8"
                  >
                    <option value="All">All Locations</option>
                    {locationOptions.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="text-gray-400 absolute right-3" />
                </div>
              </div>
              
              {/* Status Filter */}
              <div className="relative inline-block">
                <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2 border border-gray-700">
                  <Filter size={16} className="text-gray-400" />
                  <select 
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-transparent text-gray-300 appearance-none focus:outline-none cursor-pointer pr-8"
                  >
                    <option value="All">All Status</option>
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="text-gray-400 absolute right-3" />
                </div>
              </div>
              
              <button 
                onClick={fetchInventory}
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

        {/* Inventory List */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-400 mb-4">Inventory Items</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center">
              <div className="text-red-400 mb-2">
                <AlertTriangle size={32} className="mx-auto mb-2" />
                <h3 className="text-lg font-medium">Error Loading Inventory</h3>
              </div>
              <p className="text-gray-300">{error}</p>
              <button
                onClick={fetchInventory}
                className="mt-4 px-4 py-2 bg-red-500/30 hover:bg-red-500/50 text-red-300 rounded-lg inline-flex items-center"
              >
                <RefreshCw size={16} className="mr-2" /> Try Again
              </button>
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
              <FileText size={48} className="mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">No Inventory Items Found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || selectedCategory !== "All" || selectedLocation !== "All" || selectedStatus !== "All"
                  ? "No items match your search criteria. Try adjusting your filters."
                  : "You haven't added any inventory items yet. Get started by adding your first item."}
              </p>
              <button
                onClick={openAddModal}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white"
              >
                <Plus size={16} className="mr-2" /> Add First Item
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-3 flex justify-between items-center">
                <p className="text-sm text-gray-400">
                  Showing {filteredInventory.length} of {inventory.length} items
                </p>
              </div>
              
              <div className="space-y-4">
                {filteredInventory.map(item => (
                  <InventoryItem key={item._id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                {currentItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Item Name */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Item Name*
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter item name"
                  />
                </div>
                
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Category*
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categoryOptions.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                {/* Subcategory */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter subcategory (optional)"
                  />
                </div>
                
                {/* Quantity and Unit */}
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Quantity*
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Unit*
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {unitOptions.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Unit Cost */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Unit Cost (Rs.)*
                  </label>
                  <input
                    type="number"
                    name="unitCost"
                    value={formData.unitCost}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Total Value (calculated) */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Total Value (Rs.)
                  </label>
                  <input
                    type="text"
                    value={
                      parseFloat(formData.quantity || 0) * 
                      parseFloat(formData.unitCost || 0)
                    }
                    readOnly
                    className="w-full bg-gray-700 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Location*
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {locationOptions.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                
                {/* Min Stock Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Min Stock Level*
                  </label>
                  <input
                    type="number"
                    name="minStockLevel"
                    value={formData.minStockLevel}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Supplier */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Supplier
                  </label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter supplier name (optional)"
                  />
                </div>
                
                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Notes */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional notes (optional)"
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                >
                  {currentItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryDashboard;