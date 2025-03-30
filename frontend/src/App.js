import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import Navbar from './components/Navbar';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import BudgetOverview from './components/BudgetOverview';
import Slidebar from './components/Slidebar';
import UpdateExpenseForm from './components/UpdateExpenseForm';

// Import pages
import Budget from './pages/Budget';
import Account from './pages/Account';
import UpdateAcc from './pages/UpdateAcc';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Payments from './pages/Payments'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/budget" element={<Budget />} />
          <Route path="/expenseForm" element={<ExpenseForm />} />
          <Route path="/expenseList" element={<ExpenseList />} />
          <Route path="/budgetOverview" element={<BudgetOverview />} />
          <Route path="/slidebar" element={<Slidebar />} />
          <Route path="/updateExpenseForm" element={<UpdateExpenseForm />} />
          <Route path="/account" element={<Account />} />
          <Route path="/updateAcc" element={<UpdateAcc />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/home" element={<Home />} />
          <Route path="/payments" element={<Payments />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
