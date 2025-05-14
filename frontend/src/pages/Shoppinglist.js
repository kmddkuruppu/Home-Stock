import { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, Clock, Store, Clipboard, Tag, Archive, DollarSign, ShoppingCart, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Animated background particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {Array.from({ length: 12 }).map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
          style={{
            width: `${Math.random() * 200 + 50}px`,
            height: `${Math.random() * 200 + 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.4
          }}
        />
      ))}
    </div>
  );
};

// Priority Badge Component
const PriorityBadge = ({ priority }) => {
  const colorMap = {
    'Low': 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    'Medium': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    'High': 'bg-red-500/20 text-red-300 border-red-500/50'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colorMap[priority]}`}>
      {priority}
    </span>
  );
};

// Category Chip Component
const CategoryChip = ({ category }) => {
  return (
    <div className="flex items-center bg-purple-900/40 rounded-full px-3 py-1 text-xs text-purple-200">
      <Tag size={12} className="mr-1" />
      {category}
    </div>
  );
};

// Format date function
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Format currency function
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2
  }).format(amount);
};

// Item Card Component
const ItemCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState(null);
  
  // Function to handle purchase action
  const handlePurchase = async () => {
    try {
      setPurchasing(true);
      setPurchaseStatus(null);
      
      // Prepare budget data from the item
      const budgetData = {
        itemName: item.itemName,
        itemId: item.itemId,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.totalPrice || (item.price * item.quantity),
        purchasedDate: item.purchasedDate || new Date().toISOString().split('T')[0],
        purchasedTime: item.purchasedTime || new Date().toLocaleTimeString(),
        store: item.store || "Unknown",
        notes: item.notes || "",
        priority: item.priority
      };
      
      // Send data to budget endpoint
      const response = await fetch('http://localhost:8070/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add item to budget');
      }
      
      setPurchaseStatus('success');
    } catch (error) {
      console.error('Error adding to budget:', error);
      setPurchaseStatus('error');
    } finally {
      setPurchasing(false);
      // Reset status after 3 seconds
      setTimeout(() => {
        setPurchaseStatus(null);
      }, 3000);
    }
  };
  
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 shadow-lg hover:shadow-purple-500/10">
      <div 
        className="p-4 cursor-pointer flex justify-between items-start"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white">{item.itemName}</h3>
            <p className="text-gray-400 text-sm">ID: {item.itemId}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <PriorityBadge priority={item.priority} />
          <div className="mt-2 text-right">
            <div className="flex items-center space-x-1 text-green-300 mb-1">
              <span className="font-medium">{formatCurrency(item.price)}</span>
            </div>
            <span className="text-white text-sm">{item.quantity} units</span>
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-purple-500/20">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Calendar size={16} className="text-purple-400" />
              <span>Purchased: {formatDate(item.purchasedDate)}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Clock size={16} className="text-purple-400" />
              <span>Time: {item.purchasedTime}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Store size={16} className="text-purple-400" />
              <span>Store: {item.store}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Calendar size={16} className="text-purple-400" />
              <span>Expires: {item.expiryDate ? formatDate(item.expiryDate) : 'N/A'}</span>
            </div>
          </div>
          
          {/* Price Information Section */}
          <div className="mt-3 p-3 bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-300">
                <DollarSign size={16} className="text-green-400" />
                <span className="text-sm font-medium">Price:</span>
              </div>
              <span className="text-sm font-bold text-green-300">{formatCurrency(item.price)}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center space-x-2 text-gray-300">
                <DollarSign size={16} className="text-green-400" />
                <span className="text-sm font-medium">Total ({item.quantity} units):</span>
              </div>
              <span className="text-sm font-bold text-green-300">{formatCurrency(item.totalPrice)}</span>
            </div>
          </div>
          
          {item.notes && (
            <div className="mt-3 p-3 bg-purple-900/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-1 text-gray-300">
                <Clipboard size={16} className="text-purple-400" />
                <span className="text-sm font-medium">Notes:</span>
              </div>
              <p className="text-sm text-gray-300">{item.notes}</p>
            </div>
          )}
          
          <div className="mt-3 flex justify-between items-center">
            <CategoryChip category={item.category} />
            
            {/* Purchase Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the expanded toggle
                handlePurchase();
              }}
              disabled={purchasing}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                purchaseStatus === 'success' 
                  ? 'bg-green-600/80 hover:bg-green-600' 
                  : purchaseStatus === 'error'
                  ? 'bg-red-600/80 hover:bg-red-600'
                  : 'bg-purple-600/80 hover:bg-purple-600'
              }`}
            >
              {purchasing ? (
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : purchaseStatus === 'success' ? (
                <span>✓</span>
              ) : purchaseStatus === 'error' ? (
                <span>✗</span>
              ) : (
                <ShoppingCart size={16} />
              )}
              <span className="text-sm font-medium">
                {purchasing 
                  ? 'Processing...' 
                  : purchaseStatus === 'success'
                  ? 'Added to Budget'
                  : purchaseStatus === 'error'
                  ? 'Failed'
                  : 'Add to Budget'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Filter Component
const FilterBar = ({ categories, onCategoryChange, onSortChange, onSearchChange }) => {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 mb-6 border border-purple-500/20">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-xs text-gray-400 mb-1">Search Items</label>
          <input 
            type="text" 
            className="w-full bg-gray-900/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            placeholder="Search by name or ID..."
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-48">
          <label className="block text-xs text-gray-400 mb-1">Category</label>
          <select 
            className="w-full bg-gray-900/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="w-full md:w-48">
          <label className="block text-xs text-gray-400 mb-1">Sort By</label>
          <select 
            className="w-full bg-gray-900/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="itemName">Name (A-Z)</option>
            <option value="-itemName">Name (Z-A)</option>
            <option value="-priority">Priority (High-Low)</option>
            <option value="priority">Priority (Low-High)</option>
            <option value="-price">Price (High-Low)</option>
            <option value="price">Price (Low-High)</option>
            <option value="-totalPrice">Total Cost (High-Low)</option>
            <option value="totalPrice">Total Cost (Low-High)</option>
            <option value="-purchasedDate">Newest First</option>
            <option value="purchasedDate">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Summary Component
const PriceSummary = ({ items }) => {
  const totalCost = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const itemCount = items.length;
  
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 mb-6 border border-green-500/20">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-green-500/20 text-green-300">
            <DollarSign size={24} />
          </div>
          <div>
            <h3 className="font-medium text-gray-300">Total Shopping Cost</h3>
            <p className="text-2xl font-bold text-green-300">{formatCurrency(totalCost)}</p>
          </div>
        </div>
        <div className="mt-3 md:mt-0 text-right">
          <p className="text-sm text-gray-400">Average cost per item</p>
          <p className="text-lg font-semibold text-green-300">
            {itemCount > 0 ? formatCurrency(totalCost / itemCount) : formatCurrency(0)}
          </p>
        </div>
      </div>
    </div>
  );
};

// Add Button Component
const AddButton = () => {
  const navigate = useNavigate();
  
  return (
    <button 
      onClick={() => navigate('/shoppinglistform')}
      className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 z-50"
    >
      <Plus size={24} className="text-white" />
      <div className="absolute w-full h-full rounded-full bg-white/20 animate-ping opacity-75 duration-1000"></div>
    </button>
  );
};

// Main Component
export default function ShoppingListPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('itemName');
  
  // Fetch data from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:8070/shoppinglist');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        
        // Ensure totalPrice is calculated if not present
        const processedData = data.map(item => ({
          ...item,
          totalPrice: item.totalPrice || (item.price * item.quantity)
        }));
        
        setItems(processedData);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(processedData.map(item => item.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchItems();
  }, []);
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...items];
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.itemName.toLowerCase().includes(term) || 
        item.itemId.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    const sortField = sortOption.startsWith('-') ? sortOption.substring(1) : sortOption;
    const sortDirection = sortOption.startsWith('-') ? -1 : 1;
    
    result.sort((a, b) => {
      // Special handling for priority
      if (sortField === 'priority') {
        const priorityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
        return (priorityOrder[a[sortField]] - priorityOrder[b[sortField]]) * sortDirection;
      }
      
      // Regular string, number or date comparison
      if (a[sortField] < b[sortField]) return -1 * sortDirection;
      if (a[sortField] > b[sortField]) return 1 * sortDirection;
      return 0;
    });
    
    setFilteredItems(result);
  }, [items, selectedCategory, searchTerm, sortOption]);
  
  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-purple-500 border-r-purple-500 border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xl font-medium">Loading your shopping list...</p>
        </div>
      </div>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white flex items-center justify-center">
        <div className="text-center p-8 bg-white/5 backdrop-blur-md rounded-xl border border-red-500/30 max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-bold text-red-300 mb-2">Something went wrong</h2>
          <p className="text-gray-300">{error}</p>
          <p className="mt-4 text-sm text-gray-400">Please check your connection to the server and try again.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white relative">
      {/* Animated particles background */}
      <FloatingParticles />
      
      {/* Add Button */}
      <AddButton />
      
      {/* Content with higher z-index */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Shopping List
              </h1>
              <p className="text-gray-400 mt-2">
                <span className="font-medium">{filteredItems.length}</span> items in your list
              </p>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-purple-500/20">
              <Archive size={24} className="text-purple-400" />
            </div>
          </div>
        </header>
        
        {/* Price Summary */}
        <PriceSummary items={filteredItems} />
        
        {/* Filters */}
        <FilterBar 
          categories={categories}
          onCategoryChange={setSelectedCategory}
          onSortChange={setSortOption}
          onSearchChange={setSearchTerm}
        />
        
        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag size={32} className="text-indigo-300" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No items found</h3>
            <p className="text-gray-400 max-w-md">
              {items.length > 0 
                ? "Try adjusting your filters to see more items."
                : "Your shopping list is empty. Add items to get started."}
            </p>
          </div>
        )}
        
        {/* Item grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}