import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

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
import Admin from './pages/Admin';
import Payments from './pages/Payments'
import TransMoney from './pages/TransMoney';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path='/welcome' element={<Welcome />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/expenseForm" element={<ExpenseForm />} />
          <Route path="/expenseList" element={<ExpenseList />} />
          <Route path="/budgetOverview" element={<BudgetOverview />} />
          <Route path="/slidebar" element={<Slidebar />} />
          <Route path="/updateExpenseForm" element={<UpdateExpenseForm />} />
          <Route path="/account" element={<Account />} />
          <Route path="/updateAcc" element={<UpdateAcc />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/transMoney" element={<TransMoney />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}


export default App;
