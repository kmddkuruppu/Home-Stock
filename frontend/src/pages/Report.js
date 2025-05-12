import { useState, useEffect } from 'react';
import { ShoppingBag, Filter, Download, RefreshCcw, Plus, AlertTriangle, Tag, Calendar, Store, PenLine } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

// Custom card component with glass effect
const GlassCard = ({ children, className = "" }) => {
  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 ${className}`}>
      {children}
    </div>
  );
};

// Priority Badge component
const PriorityBadge = ({ priority }) => {
  const colorMap = {
    'Low': 'bg-blue-500/30 text-blue-200',
    'Medium': 'bg-yellow-500/30 text-yellow-200',
    'High': 'bg-red-500/30 text-red-200'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[priority] || 'bg-gray-500/30 text-gray-200'}`}>
      {priority}
    </span>
  );
};

// Shopping List Page
export default function ShoppingListPage() {
  // State for shopping items data
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalValue, setTotalValue] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // API URL
  const API_URL = 'http://localhost:8070/budget';
  
  // Categories colors
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];
  
  // Function to fetch shopping items from the API
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      
      // Fetch items from the actual API
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setItems(data);
      
      // Calculate total value
      const total = data.reduce((sum, item) => sum + item.totalPrice, 0);
      setTotalValue(total);
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(`Failed to fetch items: ${err.message}`);
      setIsLoading(false);
    }
  };
  
  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);
  
  // Process data for charts
  const categoryData = items.reduce((acc, item) => {
    const existingCategory = acc.find(cat => cat.name === item.category);
    if (existingCategory) {
      existingCategory.value += item.totalPrice;
    } else {
      acc.push({ name: item.category, value: item.totalPrice });
    }
    return acc;
  }, []);
  
  // Process data for store distribution
  const storeData = items.reduce((acc, item) => {
    const existingStore = acc.find(store => store.name === item.store);
    if (existingStore) {
      existingStore.value += item.totalPrice;
    } else {
      acc.push({ name: item.store, value: item.totalPrice });
    }
    return acc;
  }, []);
  
  // Function to filter items
  const filterItems = async (filter) => {
    setSelectedFilter(filter);
    setIsLoading(true);
    
    try {
      // Fetch all items from API
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filter items based on priority
      if (filter === 'all') {
        setItems(data);
        const total = data.reduce((sum, item) => sum + item.totalPrice, 0);
        setTotalValue(total);
      } else {
        const filteredItems = data.filter(item => item.priority === filter);
        setItems(filteredItems);
        const total = filteredItems.reduce((sum, item) => sum + item.totalPrice, 0);
        setTotalValue(total);
      }
    } catch (err) {
      console.error('Error filtering items:', err);
      setError(`Failed to filter items: ${err.message}`);
    }
    
    setIsLoading(false);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Handle refresh button
  const handleRefresh = () => {
    fetchItems();
  };
  
  // Export data as CSV
  const exportData = () => {
    if (items.length === 0) return;
    
    const headers = ['ID', 'Name', 'Category', 'Quantity', 'Price', 'Total', 'Priority', 'Store', 'Date'];
    const csvContent = [
      headers.join(','),
      ...items.map(item => 
        `"${item.itemId}","${item.itemName}","${item.category}",${item.quantity},${item.price},${item.totalPrice},"${item.priority}","${item.store}","${formatDate(item.purchasedDate)}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'budget_summary.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Handler for Add Item button (redirect to add item form page)
  const handleAddItem = () => {
    // In a real app, this would navigate to an add item form
    // For example: window.location.href = '/add-item';
    alert('Add Item feature will be implemented here');
  };
  
  // Calculate low stock items (items with quantity < 2)
  const lowStockItems = items.filter(item => item.quantity < 2).length;
  
  // Get high priority items count
  const highPriorityItems = items.filter(item => item.priority === 'High').length;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white relative">
      {/* Animated particles background */}
      <FloatingParticles />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-10 flex flex-col lg:flex-row justify-between items-center">
          <div className="flex items-center mb-6 lg:mb-0">
            <ShoppingBag className="text-purple-400 mr-3" size={32} />
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Budget Summary Dashboard
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button 
              className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
              onClick={handleRefresh}
            >
              <RefreshCcw size={16} className="mr-2" />
              <span>Refresh</span>
            </button>
            <button
              className="flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-all"
              onClick={handleAddItem}
            >
              <Plus size={16} className="mr-2" />
              <span>Add Item</span>
            </button>
            <button 
              className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
              onClick={exportData}
            >
              <Download size={16} className="mr-2" />
              <span>Export</span>
            </button>
          </div>
        </header>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <GlassCard className="flex flex-col">
            <div className="flex items-center mb-2">
              <ShoppingBag className="text-purple-400 mr-2" size={20} />
              <h3 className="text-lg font-medium text-gray-100">Total Value</h3>
            </div>
            <p className="text-3xl font-bold">LKR {totalValue.toFixed(2)}</p>
            <p className="text-sm text-gray-300 mt-2">{items.length} Items</p>
          </GlassCard>
          
          <GlassCard className="flex flex-col">
            <div className="flex items-center mb-2">
              <Tag className="text-green-400 mr-2" size={20} />
              <h3 className="text-lg font-medium text-gray-100">Top Category</h3>
            </div>
            {categoryData.length > 0 ? (
              <>
                <p className="text-3xl font-bold">{categoryData.sort((a, b) => b.value - a.value)[0]?.name || "None"}</p>
                <p className="text-sm text-gray-300 mt-2">
                  LKR {categoryData.sort((a, b) => b.value - a.value)[0]?.value.toFixed(2) || "0.00"}
                </p>
              </>
            ) : (
              <p className="text-gray-400">No data available</p>
            )}
          </GlassCard>
          
          <GlassCard className="flex flex-col">
            <div className="flex items-center mb-2">
              <AlertTriangle className="text-yellow-400 mr-2" size={20} />
              <h3 className="text-lg font-medium text-gray-100">Items Needing Attention</h3>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-3xl font-bold">{highPriorityItems}</p>
                <p className="text-sm text-gray-300 mt-2">High Priority</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{lowStockItems}</p>
                <p className="text-sm text-gray-300 mt-2">Low Stock</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="flex flex-col">
            <div className="flex items-center mb-2">
              <Filter className="text-blue-400 mr-2" size={20} />
              <h3 className="text-lg font-medium text-gray-100">Filter by Priority</h3>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button 
                className={`px-3 py-1 text-sm rounded-full ${selectedFilter === 'all' ? 'bg-purple-500' : 'bg-white/10 hover:bg-white/20'}`}
                onClick={() => filterItems('all')}
              >
                All
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-full ${selectedFilter === 'High' ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'}`}
                onClick={() => filterItems('High')}
              >
                High
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-full ${selectedFilter === 'Medium' ? 'bg-yellow-500' : 'bg-white/10 hover:bg-white/20'}`}
                onClick={() => filterItems('Medium')}
              >
                Medium
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-full ${selectedFilter === 'Low' ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'}`}
                onClick={() => filterItems('Low')}
              >
                Low
              </button>
            </div>
          </GlassCard>
        </div>
        
        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Pie Chart - Category Distribution */}
          <GlassCard className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-6">Spending by Category</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `LKR ${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No data available
              </div>
            )}
          </GlassCard>
          
          {/* Bar Chart - Store Distribution */}
          <GlassCard className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6">Spending by Store</h2>
            {storeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={storeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip 
                    formatter={(value) => `LKR ${value.toFixed(2)}`}
                    labelFormatter={(value) => `Store: ${value}`}
                    contentStyle={{ backgroundColor: "rgba(30, 27, 75, 0.9)", border: "1px solid rgba(255,255,255,0.2)" }}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Store" fill="#8884d8">
                    {storeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No data available
              </div>
            )}
          </GlassCard>
        </div>
        
        {/* Shopping Items Table */}
        <GlassCard>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Shopping Items</h2>
            <div className="flex gap-2">
              <button className="text-sm flex items-center text-purple-400 hover:text-purple-300 transition-colors">
                <PenLine size={14} className="mr-1" />
                Edit Selected
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 p-4 text-center">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-center py-3 px-4 font-medium text-gray-200">ID</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-200">Item Name</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-200">Category</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-200">Quantity</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-200">Price (LKR)</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-200">Total (LKR)</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-200">Priority</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-200">Store</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-200">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-center text-gray-300">{item.itemId}</td>
                      <td className="py-3 px-4 text-left">{item.itemName}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2 py-1 rounded-full text-xs bg-white/10">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">{item.quantity}</td>
                      <td className="py-3 px-4 text-right">{item.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-medium">{item.totalPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center">
                        <PriorityBadge priority={item.priority} />
                      </td>
                      <td className="py-3 px-4 text-left">
                        <div className="flex items-center justify-center">
                          <Store size={14} className="mr-1 text-gray-400" />
                          {item.store}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-300">{formatDate(item.purchasedDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {items.length === 0 && !isLoading && !error && (
            <div className="text-center py-8 text-gray-400">
              No items found
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}