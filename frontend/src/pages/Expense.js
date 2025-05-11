import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, CheckCircle, ShoppingCart, Calendar, Plus, Settings } from 'lucide-react';

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

// Budget alert component
const BudgetAlert = ({ isOverBudget, percentUsed }) => {
  if (!isOverBudget && percentUsed < 80) return null;
  
  return (
    <div className={`flex items-center p-4 mt-4 mb-6 rounded-lg border ${
      isOverBudget 
        ? 'bg-red-950/40 border-red-500 text-red-200' 
        : 'bg-yellow-950/40 border-yellow-500 text-yellow-200'
    }`}>
      <AlertTriangle className="mr-3" />
      <div>
        <h3 className="font-bold text-lg">
          {isOverBudget ? 'Budget Exceeded!' : 'Approaching Budget Limit'}
        </h3>
        <p>
          {isOverBudget 
            ? `You've exceeded your monthly budget by ${percentUsed.toFixed(0)}%.` 
            : `You've used ${percentUsed.toFixed(0)}% of your monthly budget.`}
        </p>
      </div>
    </div>
  );
};

// Store recommendation card
const StoreRecommendation = ({ storeData }) => {
  if (!storeData) return null;
  
  return (
    <div className="bg-indigo-950/30 backdrop-blur-sm rounded-lg p-5 border border-indigo-500/30 shadow-lg">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <ShoppingCart className="mr-2" size={20} />
        Recommended Store
      </h3>
      <div className="text-2xl font-bold text-indigo-300 mb-2">{storeData.store}</div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-400">Estimated Cost:</span>
          <div className="font-medium">${storeData.totalCost.toFixed(2)}</div>
        </div>
        <div>
          <span className="text-gray-400">Coverage:</span>
          <div className="font-medium">{storeData.coveragePercent.toFixed(0)}%</div>
        </div>
      </div>
      {storeData.itemsMissing.length > 0 && (
        <div className="mt-3 text-sm">
          <span className="text-yellow-300 font-medium">{storeData.itemsMissing.length} items not available</span>
        </div>
      )}
    </div>
  );
};

// Budget card component 
const BudgetCard = ({ title, amount, icon: Icon, bgClass }) => {
  return (
    <div className={`rounded-lg p-5 ${bgClass} border border-indigo-500/30 backdrop-blur-sm shadow-lg`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-300 font-medium">{title}</h3>
        <span className="p-2 bg-white/10 rounded-full">
          <Icon size={16} />
        </span>
      </div>
      <div className="text-2xl font-bold text-white">${amount.toFixed(2)}</div>
    </div>
  );
};

// Budget dashboard main component
export default function BudgetDashboard() {
  // State for data
  const [currentMonth, setCurrentMonth] = useState('may');
  const [currentYear, setCurrentYear] = useState(2025);
  const [budgetData, setBudgetData] = useState({
    totalBudget: 1200,
    totalSpent: 950,
    remaining: 250,
    isOverBudget: false,
    percentUsed: 79.16,
    categoryBreakdown: {
      'Groceries': 420,
      'Dining': 180,
      'Household': 150,
      'Personal Care': 120,
      'Other': 80
    }
  });
  
  const [monthlyExpenses, setMonthlyExpenses] = useState([
    { month: 'Jan', spent: 980, budget: 1100 },
    { month: 'Feb', spent: 1050, budget: 1100 },
    { month: 'Mar', spent: 920, budget: 1100 },
    { month: 'Apr', spent: 1150, budget: 1200 },
    { month: 'May', spent: 950, budget: 1200 }
  ]);
  
  const [suggestedBudget, setSuggestedBudget] = useState({
    month: 'june',
    year: 2025,
    suggestedBudget: 1230,
    categorySuggestions: {
      'Groceries': 430,
      'Dining': 190,
      'Household': 160, 
      'Personal Care': 120,
      'Other': 90
    },
    basedOn: {
      months: 3,
      averageSpending: 1006.67
    }
  });
  
  const [storeRecommendation, setStoreRecommendation] = useState({
    store: "SaveMart",
    totalCost: 218.50,
    itemsFound: 16,
    itemsMissing: ["Organic Kale", "Almond Milk"],
    coveragePercent: 88.9,
    itemsTotal: 18
  });
  
  // Format category breakdown for pie chart
  const categoryPieData = Object.entries(budgetData.categoryBreakdown).map(([name, value]) => ({
    name, value
  }));
  
  // COLORS for pie chart
  const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#f472b6'];
  
  // Simulate fetching budget data based on selected month/year
  useEffect(() => {
    // In a real application, you would fetch data from your API here
    console.log(`Fetching budget data for ${currentMonth} ${currentYear}`);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      // This is where you'd make actual API calls to your Express backend
      // axios.get(`/api/budgets/check-budget/${currentMonth}/${currentYear}`)
      //   .then(response => setBudgetData(response.data))
      //   .catch(error => console.error('Error fetching budget data:', error));
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentMonth, currentYear]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white relative">
      {/* Animated particles background */}
      <FloatingParticles />
      
      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
              Budget Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Track, analyze, and optimize your spending</p>
          </div>
          
          {/* Month selector */}
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="mr-2"><Calendar size={18} /></span>
            <select 
              className="bg-indigo-900/50 border border-indigo-700 rounded-md py-1 px-2 text-white"
              value={`${currentMonth}-${currentYear}`}
              onChange={(e) => {
                const [month, year] = e.target.value.split('-');
                setCurrentMonth(month);
                setCurrentYear(parseInt(year));
              }}
            >
              <option value="january-2025">January 2025</option>
              <option value="february-2025">February 2025</option>
              <option value="march-2025">March 2025</option>
              <option value="april-2025">April 2025</option>
              <option value="may-2025">May 2025</option>
              <option value="june-2025">June 2025</option>
            </select>
            
            <button className="ml-3 p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
              <Plus size={18} />
            </button>
            <button className="ml-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              <Settings size={18} />
            </button>
          </div>
        </div>
        
        {/* Budget alert (if over budget or approaching limit) */}
        <BudgetAlert 
          isOverBudget={budgetData.isOverBudget} 
          percentUsed={budgetData.percentUsed} 
        />
        
        {/* Budget summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <BudgetCard 
            title="Total Budget" 
            amount={budgetData.totalBudget} 
            icon={DollarSign}
            bgClass="bg-indigo-900/30" 
          />
          <BudgetCard 
            title="Total Spent" 
            amount={budgetData.totalSpent} 
            icon={ShoppingCart}
            bgClass="bg-purple-900/30" 
          />
          <BudgetCard 
            title="Remaining" 
            amount={budgetData.remaining} 
            icon={budgetData.remaining >= 0 ? CheckCircle : AlertTriangle}
            bgClass={budgetData.remaining >= 0 ? "bg-emerald-900/30" : "bg-rose-900/30"} 
          />
        </div>
        
        {/* Main dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Spending by category */}
          <div className="lg:col-span-2">
            <div className="bg-indigo-950/30 backdrop-blur-sm border border-indigo-500/30 rounded-lg p-5 shadow-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryPieData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
                    <YAxis tick={{ fill: '#9ca3af' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Bar dataKey="value" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Spending trends */}
            <div className="bg-indigo-950/30 backdrop-blur-sm border border-indigo-500/30 rounded-lg p-5 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Monthly Spending Trends</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyExpenses}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} />
                    <YAxis tick={{ fill: '#9ca3af' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="budget" stroke="#6366f1" strokeWidth={2} />
                    <Line type="monotone" dataKey="spent" stroke="#a855f7" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Right column: Category Breakdown + Suggestions */}
          <div className="space-y-6">
            {/* Category breakdown pie chart */}
            <div className="bg-indigo-950/30 backdrop-blur-sm border border-indigo-500/30 rounded-lg p-5 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`$${value}`, 'Amount']}
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Store recommendation */}
            <StoreRecommendation storeData={storeRecommendation} />
            
            {/* Next month's budget suggestion */}
            <div className="bg-indigo-950/30 backdrop-blur-sm rounded-lg p-5 border border-indigo-500/30 shadow-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <TrendingUp className="mr-2" size={20} />
                Suggested Budget for {suggestedBudget.month.charAt(0).toUpperCase() + suggestedBudget.month.slice(1)}
              </h3>
              <div className="text-2xl font-bold text-indigo-300 mb-3">${suggestedBudget.suggestedBudget}</div>
              <p className="text-sm text-gray-400 mb-4">
                Based on your spending in the last {suggestedBudget.basedOn.months} months
              </p>
              
              <div className="space-y-2">
                {Object.entries(suggestedBudget.categorySuggestions).map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">{category}</span>
                    <span className="font-medium">${amount}</span>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition-colors font-medium">
                Apply Suggested Budget
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}