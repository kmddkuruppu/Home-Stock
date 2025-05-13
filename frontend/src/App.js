import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
//import admin
import ViewBudget from './admin/ViewBudget';
import ViewMsg from './admin/ViewMsg'
import Admin from './admin/Admin';
import ViewShoppinglist from './admin/ViewShoppinglist';

// Import components
import Navbar from './components/Navbar';
import ExpenseList from './components/ExpenseList';
import BudgetOverview from './components/BudgetOverview';
import Slidebar from './components/Slidebar';
import Footer from './components/Footer';

// Import pages
import Welcome from './pages/Welcome';
import Account from './pages/Account';
import UpdateAcc from './pages/UpdateAcc';
import Payments from './pages/Payments';
import TransMoney from './pages/TransMoney';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import About from './pages/About'
import Contact from './pages/Contact'
import Features from './pages/Features'
import Report from './pages/Report';
import ShoppinglistForm from './pages/ShoppinglistForm';
import Shoppinglist from './pages/Shoppinglist';
import Expense from './pages/Expense';
import AddExpenses from './pages/AddExpenses';

function Layout() {
  const location = useLocation();
  
  // Define routes where navbar and footer should be hidden
  const hiddenNavbarRoutes = [
    '/', 
    '/login', 
    '/signup',
    '/admin',
    '/viewbudget',
    '/viewMsg'
  ];
  
  // Check if current path should hide navbar and footer
  const shouldHideNavbar = hiddenNavbarRoutes.some(route => 
    location.pathname.toLowerCase() === route.toLowerCase()
  );

  return (
    <div className="App">
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        {/* user pages */}
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenseList" element={<ExpenseList />} />
        <Route path="/budgetOverview" element={<BudgetOverview />} />
        <Route path="/slidebar" element={<Slidebar />} />
        <Route path="/account" element={<Account />} />
        <Route path="/updateAcc" element={<UpdateAcc />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/transMoney" element={<TransMoney />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/features" element={<Features />} />
        <Route path='/report' element={<Report />} />
        <Route path='/shoppinglistForm' element={<ShoppinglistForm />} />
        <Route path='/shoppinglist' element={<Shoppinglist />} />
        <Route path='/expense' element={<Expense />} />
        <Route path='/addExpenses' element={<AddExpenses />} />


        {/* admin pages  */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/viewBudget" element={<ViewBudget />} />
        <Route path='/viewMsg' element={<ViewMsg />} />
        <Route path='/viewShoppinglist' element={<ViewShoppinglist />} />
      </Routes>
      {!shouldHideNavbar && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;