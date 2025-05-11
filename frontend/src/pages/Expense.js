import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ShoppingCart, Calendar, Plus, Settings, Download, Mail } from 'lucide-react';
import axios from 'axios';
import 'jspdf-autotable';
import logo from '../logo.png';

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
const BudgetAlert = ({ isOverBudget, percentUsed, isOverSpendingLimit, onSendEmail }) => {
  if (!isOverBudget && percentUsed < 80 && !isOverSpendingLimit) return null;
  
  // Show spending limit alert instead of budget alert if spending limit is exceeded
  if (isOverSpendingLimit) {
    return (
      <div className="flex items-center p-4 mt-4 mb-6 rounded-lg border bg-red-950/40 border-red-500 text-red-200">
        <AlertTriangle className="mr-3" />
        <div className="flex-grow">
          <h3 className="font-bold text-lg">Monthly Spending Limit Exceeded!</h3>
          <p>Your monthly spending has exceeded the Rs.50,000 limit. Please review your expenses.</p>
        </div>
        <button 
          onClick={onSendEmail}
          className="ml-4 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md flex items-center"
        >
          <Mail size={16} className="mr-2" />
          Send Alert
        </button>
      </div>
    );
  }
  
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
            ? `You've exceeded your monthly budget by ${percentUsed.toFixed(0) - 100}%.` 
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
          <div className="font-medium">Rs.{storeData.totalCost.toFixed(2)}</div>
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
      <div className="text-2xl font-bold text-white">Rs.{amount.toFixed(2)}</div>
    </div>
  );
};

// Generate PDF function
const generateBudgetPDF = (budgetData, categoryBreakdown, monthlyExpenses, currentMonth, currentYear) => {
  try {
    // Import jsPDF and autoTable
    import('jspdf').then(({ default: jsPDF }) => {
      import('jspdf-autotable').then(({ default: autoTable }) => {
        // Create new PDF document
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        // Add header
        doc.addImage(logo, 'PNG', 14, 20, 20, 20);
        doc.setFontSize(17);
        doc.text('WELCOME TO', 40, 27);
        doc.setFontSize(24);
        doc.text('HOME STOCK PRO', 40, 38);
        doc.setFontSize(20);
        doc.text('Budget Management Report', 14, 50);
        
        // Add date and time
        const date = new Date();
        doc.setFontSize(12);
        doc.text(`Generated on: ${date.toLocaleString()}`, 14, 60);
        
        // Add contact information
        const contactInfo = `Contact: +94 77 123 4567\nEmail: homestockpro@gmail.com\nAddress: 45 Main Avenue, Colombo\nSri Lanka`;
        doc.setFontSize(11);
        doc.text(contactInfo, 195, 75, { align: 'right' });
        
        // Add financial summary
        doc.setFontSize(14);
        doc.text('Financial Summary', 14, 75);
        doc.setFontSize(11);
        doc.text(`Month: ${currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)} ${currentYear}`, 14, 82);
        doc.text(`Total Budget: Rs. ${budgetData.totalBudget.toFixed(2)}`, 14, 88);
        doc.text(`Total Spent: Rs. ${budgetData.totalSpent.toFixed(2)}`, 14, 94);
        doc.text(`Account Balance: Rs. ${budgetData.accountBalance.toFixed(2)}`, 14, 100);
        doc.text(`Budget Used: ${budgetData.percentUsed.toFixed(1)}%`, 14, 106);
        
        // Status text
        let statusText;
        let statusColor;
        
        if (budgetData.isOverSpendingLimit) {
          statusText = "CRITICAL: Spending Limit Exceeded!";
          statusColor = [255, 0, 0];
        } else if (budgetData.isOverBudget) {
          statusText = "WARNING: Budget Exceeded!";
          statusColor = [255, 165, 0];
        } else if (budgetData.percentUsed > 80) {
          statusText = "CAUTION: Approaching Budget Limit";
          statusColor = [255, 215, 0];
        } else {
          statusText = "GOOD: Within Budget";
          statusColor = [0, 128, 0];
        }
        
        doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.setFontSize(12);
        doc.text(statusText, 14, 115);
        doc.setTextColor(0, 0, 0); // Reset to black
        
        // Add category breakdown table
        const categoryData = Object.entries(categoryBreakdown).map(([category, amount]) => [
          category,
          amount.toFixed(2),
          ((amount / budgetData.totalSpent) * 100).toFixed(1) + '%'
        ]);
        
        if (categoryData.length > 0) {
          doc.setFontSize(14);
          doc.text('Expense Breakdown by Category', 14, 125);
          
          // Using autoTable correctly
          autoTable(doc, {
            startY: 130,
            head: [['Category', 'Amount (Rs.)', 'Percentage']],
            body: categoryData,
            theme: 'grid',
            headStyles: { 
              fillColor: [28, 102, 130], // Using theme from the second example
              textColor: [255, 255, 255],
              fontStyle: 'bold'
            },
            alternateRowStyles: { fillColor: [239, 239, 239] }, // Using theme from the second example
            styles: { 
              fontSize: 10, 
              cellPadding: 3,
              textColor: [0, 0, 0]
            },
            columnStyles: {
              1: { halign: 'right' },
              2: { halign: 'right' }
            }
          });
        }
        
        // Add monthly trends
        doc.addPage();
        doc.setFontSize(16);
        doc.text('Monthly Spending Trends', 14, 20);
        
        if (monthlyExpenses.length > 0) {
          // Using autoTable for monthly trends too
          const monthlyData = monthlyExpenses.map(item => [
            item.month,
            item.spent.toFixed(2),
            item.budget.toFixed(2),
            ((item.spent / item.budget) * 100).toFixed(1) + '%'
          ]);
          
          autoTable(doc, {
            startY: 30,
            head: [['Month', 'Amount Spent (Rs.)', 'Budget (Rs.)', 'Budget Used']],
            body: monthlyData,
            theme: 'grid',
            headStyles: { 
              fillColor: [28, 102, 130],
              textColor: [255, 255, 255],
              fontStyle: 'bold'
            },
            alternateRowStyles: { fillColor: [239, 239, 239] },
            styles: { 
              fontSize: 10, 
              cellPadding: 3,
              textColor: [0, 0, 0]
            },
            columnStyles: {
              1: { halign: 'right' },
              2: { halign: 'right' },
              3: { halign: 'right' }
            }
          });
        }
        
        // Add notes section and financial tips
        const currentY = 120;
        
        doc.setFontSize(14);
        doc.text('Financial Tips', 14, currentY);
        
        const tips = [
          "Review your highest spending categories and find opportunities to cut costs.",
          "Set up automatic savings transfers to build your emergency fund.",
          "Use cash for discretionary spending to better control your budget.",
          "Consider using the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
          "Track all expenses regularly to stay on top of your financial situation."
        ];
        
        let yPosition = currentY + 10;
        doc.setFontSize(10);
        
        tips.forEach((tip, index) => {
          doc.text(`${index + 1}. ${tip}`, 14, yPosition);
          yPosition += 7;
        });
        
        // Add footer
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(10);
        doc.text('Generated by Home Stock Pro Budget Management System', 105, pageHeight - 10, { align: 'center' });
        
        // Save the PDF
        doc.save(`Budget_Report_${currentMonth}_${currentYear}.pdf`);
      }).catch(error => {
        console.error("Error loading jsPDF-AutoTable:", error);
        alert("Failed to load PDF generation components. Please try again.");
      });
    }).catch(error => {
      console.error("Error loading jsPDF:", error);
      alert("Failed to load PDF generation components. Please try again.");
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF report. Please try again.");
  }
};

// Budget dashboard main component
export default function BudgetDashboard() {
  // State for date filters
  const [currentMonth, setCurrentMonth] = useState(new Date().toLocaleString('default', { month: 'long' }).toLowerCase());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  
  // State for fetched data
  const [budgetData, setBudgetData] = useState({
    totalBudget: 50000, // Setting budget to Rs.50,000
    totalSpent: 0,
    accountBalance: 0, // Changed "remaining" to "accountBalance" for clarity
    isOverBudget: false,
    percentUsed: 0,
    categoryBreakdown: {},
    isOverSpendingLimit: false
  });
  
  // Format category breakdown for pie chart
  const [categoryPieData, setCategoryPieData] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [suggestedBudget, setSuggestedBudget] = useState(null);
  const [storeRecommendation, setStoreRecommendation] = useState(null);
  
  // Get the first day of month
  const getFirstDayOfMonth = (month, year) => {
    const monthIndex = new Date(`${month} 1, 2000`).getMonth();
    return new Date(year, monthIndex, 1);
  };
  
  // Get the last day of month
  const getLastDayOfMonth = (month, year) => {
    const monthIndex = new Date(`${month} 1, 2000`).getMonth();
    return new Date(year, monthIndex + 1, 0);
  };
  
  // Fetch account balance
  const fetchAccountBalance = async () => {
    try {
      // Using fixed accountId from the EBookAccountInterface component
      const accountId = '67e6c37158784ed46b22d597';
      const response = await axios.get(`http://localhost:8070/account/get/${accountId}`);
      return response.data.account.balance || 0;
    } catch (error) {
      console.error('Error fetching account balance:', error);
      return 0;
    }
  };
  
  // Fetch budget data from API
  const fetchBudgetData = async () => {
    setIsLoading(true);
    try {
      const startDate = getFirstDayOfMonth(currentMonth, currentYear);
      const endDate = getLastDayOfMonth(currentMonth, currentYear);
      
      // Fetch account balance first
      const accountBalance = await fetchAccountBalance();
      
      // Fetch total spending for the current month
      const spendingResponse = await axios.get(`http://localhost:8070/budget/stats/daterange`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      
      // Fetch category breakdown
      const categoryResponse = await axios.get('http://localhost:8070/budget/stats/categories');
      
      // Calculate category breakdown for current month
      const thisMonthCategories = await axios.get('http://localhost:8070/budget', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      
      // Process category data
      const categoryBreakdown = {};
      const monthItems = thisMonthCategories.data.filter(item => {
        const purchaseDate = new Date(item.purchasedDate);
        return purchaseDate >= startDate && purchaseDate <= endDate;
      });
      
      monthItems.forEach(item => {
        if (!categoryBreakdown[item.category]) {
          categoryBreakdown[item.category] = 0;
        }
        categoryBreakdown[item.category] += item.totalPrice;
      });
      
      // Set budget to Rs.50,000
      const totalBudget = 50000;
      const totalSpent = spendingResponse.data.totalSpent || 0;
      const percentUsed = (totalSpent / totalBudget) * 100;
      const isOverBudget = totalSpent > totalBudget;
      const isOverSpendingLimit = totalSpent > 50000; // Check if spending exceeds 50,000
      
      // Update budget data state
      setBudgetData({
        totalBudget,
        totalSpent,
        accountBalance, // Set directly from fetched account balance
        isOverBudget,
        percentUsed,
        categoryBreakdown,
        isOverSpendingLimit
      });
      
      // Fetch monthly spending trends for the past six months
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentYear, new Date(`${currentMonth} 1, 2000`).getMonth() - i, 1);
        const monthName = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        
        const monthStart = new Date(year, date.getMonth(), 1);
        const monthEnd = new Date(year, date.getMonth() + 1, 0);
        
        try {
          const response = await axios.get(`http://localhost:8070/budget/stats/daterange`, {
            params: {
              startDate: monthStart.toISOString(),
              endDate: monthEnd.toISOString()
            }
          });
          
          monthlyData.push({
            month: monthName,
            spent: response.data.totalSpent || 0,
            budget: totalBudget // Using the same budget for all months for simplicity
          });
        } catch (error) {
          console.error(`Error fetching data for ${monthName} ${year}:`, error);
          monthlyData.push({
            month: monthName,
            spent: 0,
            budget: totalBudget
          });
        }
      }
      
      setMonthlyExpenses(monthlyData);
      
      // Calculate suggested budget based on spending trends
      const avgSpending = monthlyData.reduce((sum, month) => sum + month.spent, 0) / monthlyData.length;
      const nextMonth = new Date(currentYear, new Date(`${currentMonth} 1, 2000`).getMonth() + 1, 1);
      const nextMonthName = nextMonth.toLocaleString('default', { month: 'long' }).toLowerCase();
      
      // Create suggested budget with 5% buffer
      const suggestedTotal = Math.ceil(avgSpending * 1.05);
      
      // Distribute suggested budget across categories based on current spending patterns
      const totalCategorySpending = Object.values(categoryBreakdown).reduce((sum, amount) => sum + amount, 0);
      const categorySuggestions = {};
      
      Object.entries(categoryBreakdown).forEach(([category, amount]) => {
        const percentage = amount / totalCategorySpending;
        categorySuggestions[category] = Math.ceil(suggestedTotal * percentage);
      });
      
      setSuggestedBudget({
        month: nextMonthName,
        year: nextMonth.getFullYear(),
        suggestedBudget: suggestedTotal,
        categorySuggestions,
        basedOn: {
          months: monthlyData.length,
          averageSpending: avgSpending
        }
      });
      
      // Find recommended store based on purchase history
      const allItems = await axios.get('http://localhost:8070/budget');
      const stores = {};
      
      allItems.data.forEach(item => {
        if (!stores[item.store]) {
          stores[item.store] = {
            totalSpent: 0,
            count: 0,
            items: []
          };
        }
        stores[item.store].totalSpent += item.totalPrice;
        stores[item.store].count += 1;
        if (!stores[item.store].items.includes(item.itemName)) {
          stores[item.store].items.push(item.itemName);
        }
      });
      
      // Find store with most purchases
      let bestStore = null;
      let maxCount = 0;
      
      Object.entries(stores).forEach(([store, data]) => {
        if (data.count > maxCount && store !== 'Unknown') {
          maxCount = data.count;
          bestStore = store;
        }
      });
      
      if (bestStore) {
        // Simple recommendation algorithm - in a real app this would be more sophisticated
        const commonItems = ["Milk", "Bread", "Eggs", "Cheese", "Pasta", "Rice"];
        const available = commonItems.filter(() => Math.random() > 0.2); // Simulate items availability
        const missing = commonItems.filter(item => !available.includes(item));
        
        setStoreRecommendation({
          store: bestStore,
          totalCost: (stores[bestStore].totalSpent / stores[bestStore].count) * available.length,
          itemsFound: available.length,
          itemsMissing: missing,
          coveragePercent: (available.length / commonItems.length) * 100,
          itemsTotal: commonItems.length
        });
      }
    } catch (error) {
      console.error('Error fetching budget data:', error);
      alert("Failed to load budget data. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Update pie chart data when category breakdown changes
    const pieData = Object.entries(budgetData.categoryBreakdown).map(([name, value]) => ({
      name, value
    }));
    setCategoryPieData(pieData);
  }, [budgetData.categoryBreakdown]);
  
  // COLORS for pie chart
  const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#f472b6'];
  
  // Fetch data when component mounts or when month/year changes
  useEffect(() => {
    fetchBudgetData();
  }, [currentMonth, currentYear]);
  
  // Handle month change
  const handleMonthYearChange = (e) => {
    const [month, year] = e.target.value.split('-');
    setCurrentMonth(month);
    setCurrentYear(parseInt(year));
  };
  
  // Convert month name to number
  const getMonthOptions = () => {
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june', 
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    
    const options = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Add options for previous year
    months.forEach(month => {
      options.push({
        value: `${month}-${currentYear - 1}`,
        label: `${month.charAt(0).toUpperCase() + month.slice(1)} ${currentYear - 1}`
      });
    });
    
    // Add options for current year
    months.forEach(month => {
      options.push({
        value: `${month}-${currentYear}`,
        label: `${month.charAt(0).toUpperCase() + month.slice(1)} ${currentYear}`
      });
    });
    
    return options;
  };
  
  // Handle PDF download
  const handleDownloadPDF = () => {
    generateBudgetPDF(
      budgetData, 
      budgetData.categoryBreakdown, 
      monthlyExpenses,
      currentMonth,
      currentYear
    );
  };
  
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
          
          {/* Month selector and action buttons */}
          <div className="mt-4 md:mt-0 flex flex-wrap items-center">
            <span className="mr-2"><Calendar size={18} /></span>
            <select 
              className="bg-indigo-900/50 border border-indigo-700 rounded-md py-1 px-2 text-white mr-3"
              value={`${currentMonth}-${currentYear}`}
              onChange={handleMonthYearChange}
            >
              {getMonthOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <button 
              onClick={handleDownloadPDF}
              className="ml-2 p-2 bg-indigo-600 hover:bg-indigo-700 rounded-md flex items-center"
            >
              <Download size={16} className="mr-2" />
              Download PDF
            </button>
            
            <button 
              className="ml-2 p-2 bg-purple-600 hover:bg-purple-700 rounded-md flex items-center"
              onClick={() => {}}
            >
              <Settings size={16} className="mr-2" />
              Settings
            </button>
          </div>
        </div>
        
        {/* Budget alert */}
        <BudgetAlert 
          isOverBudget={budgetData.isOverBudget}
          percentUsed={budgetData.percentUsed}
          isOverSpendingLimit={budgetData.isOverSpendingLimit}
        />
        
        {/* Budget summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <BudgetCard 
            title="Monthly Budget" 
            amount={budgetData.totalBudget} 
            icon={Calendar} 
            bgClass="bg-indigo-950/30"
          />
          <BudgetCard 
            title="Total Spent" 
            amount={budgetData.totalSpent} 
            icon={ShoppingCart} 
            bgClass="bg-indigo-900/30"
          />
          <BudgetCard 
            title="Account Balance" 
            amount={budgetData.accountBalance} 
            icon={CheckCircle} 
            bgClass="bg-purple-900/30"
          />
          <BudgetCard 
            title={budgetData.isOverBudget ? "Over Budget" : "Remaining Budget"} 
            amount={budgetData.isOverBudget ? budgetData.totalSpent - budgetData.totalBudget : budgetData.totalBudget - budgetData.totalSpent}
            icon={budgetData.isOverBudget ? TrendingUp : TrendingDown} 
bgClass={budgetData.isOverBudget ? "bg-red-900/30" : "bg-green-900/30"}
/>
</div>

{/* Main dashboard grid */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
  {/* Left column - Category breakdown */}
  <div className="lg:col-span-2">
    <div className="bg-indigo-950/30 backdrop-blur-sm rounded-lg p-5 border border-indigo-500/30 shadow-lg h-full">
      <h2 className="text-xl font-semibold mb-4">Expense Categories</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : categoryPieData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryPieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {categoryPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `Rs.${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex justify-center items-center h-64 text-gray-400">
          No expense data available for this period
        </div>
      )}
      
      {/* Category breakdown table */}
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Category Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-indigo-500/30">
                <th className="pb-2">Category</th>
                <th className="pb-2 text-right">Amount</th>
                <th className="pb-2 text-right">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(budgetData.categoryBreakdown).map(([category, amount], index) => (
                <tr key={index} className="border-b border-indigo-500/20">
                  <td className="py-2 flex items-center">
                    <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    {category}
                  </td>
                  <td className="py-2 text-right">Rs.{amount.toFixed(2)}</td>
                  <td className="py-2 text-right">
                    {((amount / budgetData.totalSpent) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  
  {/* Right column - Store recommendation & budget progress */}
  <div className="flex flex-col gap-6">
    {/* Budget progress card */}
    <div className="bg-indigo-950/30 backdrop-blur-sm rounded-lg p-5 border border-indigo-500/30 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Budget Progress</h2>
      <div className="mb-2 flex justify-between">
        <span>Rs.{budgetData.totalSpent.toFixed(2)}</span>
        <span>Rs.{budgetData.totalBudget.toFixed(2)}</span>
      </div>
      <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${budgetData.isOverBudget ? 'bg-red-500' : budgetData.percentUsed > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
          style={{ width: `${Math.min(budgetData.percentUsed, 100)}%` }}
        ></div>
      </div>
      <div className="mt-2 text-sm text-right">
        {budgetData.percentUsed.toFixed(1)}% used
      </div>
      
      {/* Budget status section */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Status</h3>
        <div className={`flex items-center p-3 rounded ${
          budgetData.isOverBudget ? 'bg-red-900/40' : budgetData.percentUsed > 80 ? 'bg-yellow-900/40' : 'bg-green-900/40'
        }`}>
          {budgetData.isOverBudget ? (
            <TrendingUp className="mr-2 text-red-400" />
          ) : budgetData.percentUsed > 80 ? (
            <AlertTriangle className="mr-2 text-yellow-400" />
          ) : (
            <CheckCircle className="mr-2 text-green-400" />
          )}
          <span>
            {budgetData.isOverBudget 
              ? `Over budget by Rs.${(budgetData.totalSpent - budgetData.totalBudget).toFixed(2)}` 
              : budgetData.percentUsed > 80 
                ? `Approaching budget limit` 
                : `Within budget`
            }
          </span>
        </div>
      </div>
    </div>
    
    {/* Store recommendation */}
    <StoreRecommendation storeData={storeRecommendation} />
    
    {/* Add new expense button */}
    <button 
      className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg flex items-center justify-center"
      onClick={() => {}}
    >
      <Plus size={20} className="mr-2" />
      Add New Expense
    </button>
  </div>
</div>

{/* Monthly trends chart */}
<div className="mb-8">
  <div className="bg-indigo-950/30 backdrop-blur-sm rounded-lg p-5 border border-indigo-500/30 shadow-lg">
    <h2 className="text-xl font-semibold mb-4">Monthly Spending Trends</h2>
    {isLoading ? (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    ) : monthlyExpenses.length > 0 ? (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyExpenses} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
          <XAxis dataKey="month" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip 
            formatter={(value) => `Rs.${value.toFixed(2)}`}
            contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="spent" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
            name="Amount Spent"
          />
          <Line 
            type="monotone" 
            dataKey="budget" 
            stroke="#82ca9d" 
            strokeDasharray="5 5" 
            name="Budget"
          />
        </LineChart>
      </ResponsiveContainer>
    ) : (
      <div className="flex justify-center items-center h-64 text-gray-400">
        No monthly data available
      </div>
    )}
  </div>
</div>

{/* Suggested budget for next month */}
{suggestedBudget && (
  <div className="mb-8">
    <div className="bg-indigo-950/30 backdrop-blur-sm rounded-lg p-5 border border-indigo-500/30 shadow-lg">
      <h2 className="text-xl font-semibold mb-2">
        Suggested Budget for {suggestedBudget.month.charAt(0).toUpperCase() + suggestedBudget.month.slice(1)} {suggestedBudget.year}
      </h2>
      <p className="text-gray-400 mb-4">
        Based on your spending patterns over the past {suggestedBudget.basedOn.months} months
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Total Suggested Budget</h3>
          <div className="text-3xl font-bold text-indigo-300">
            Rs.{suggestedBudget.suggestedBudget.toFixed(2)}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Average monthly spending: Rs.{suggestedBudget.basedOn.averageSpending.toFixed(2)}
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Category Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(suggestedBudget.categorySuggestions).map(([category, amount], index) => (
              <div key={index} className="flex justify-between">
                <span>{category}</span>
                <span>Rs.{amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <button 
        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center"
        onClick={() => {}}
      >
        <Plus size={16} className="mr-2" />
        Apply Suggested Budget
      </button>
    </div>
  </div>
)}

{/* Footer */}
<footer className="mt-12 text-center text-gray-500 text-sm">
  <p>© 2025 Home Stock Pro Budget Management System</p>
  <p className="mt-1">Need help? Contact support@homestockpro.com</p>
</footer>
</div>
</div>
);
}