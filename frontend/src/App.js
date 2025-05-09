import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

//import admin
import ViewBudget from './admin/ViewBudget';
import ViewMsg from './admin/ViewMsg'
import Admin from './admin/Admin';

// Import components
import Navbar from './components/Navbar';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import BudgetOverview from './components/BudgetOverview';
import Slidebar from './components/Slidebar';
import UpdateExpenseForm from './components/UpdateExpenseForm';
import Footer from './components/Footer';

// Import pages
import Welcome from './pages/Welcome';
import Budget from './pages/Budget';
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
import Overview from './pages/Overview'
import Features from './pages/Features'
import Report from './pages/Report';
import ShoppinglistForm from './pages/ShoppinglistForm';
import Shoppinglist from './pages/Shoppinglist';

function Layout() {
  const location = useLocation();
  const hideNavbarAndFooter = ['/', '/login', '/signup'].includes(location.pathname);

  return (
    <div className="App">
      {!hideNavbarAndFooter && <Navbar />}
      <Routes>
        {/* user pages */}
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/expenseForm" element={<ExpenseForm />} />
        <Route path="/expenseList" element={<ExpenseList />} />
        <Route path="/budgetOverview" element={<BudgetOverview />} />
        <Route path="/slidebar" element={<Slidebar />} />
        <Route path="/updateExpenseForm" element={<UpdateExpenseForm />} />
        <Route path="/account" element={<Account />} />
        <Route path="/updateAcc" element={<UpdateAcc />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/transMoney" element={<TransMoney />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/features" element={<Features />} />
        <Route path='/report' element={<Report />} />
        <Route path='/shoppinglistForm' element={<ShoppinglistForm />} />
        <Route path='/shoppinglist' element={<Shoppinglist />} />

        {/* admin pages  */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/viewBudget" element={<ViewBudget />} />
        <Route path='/viewMsg' element={<ViewMsg />} />
      </Routes>
      {!hideNavbarAndFooter && <Footer />}
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
