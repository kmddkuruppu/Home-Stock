import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import ExpenseForm from './components/ExpenseForm';
import Navbar from './components/Navbar';
import BudgetOverview from './components/BudgetOverview';
import UpdateExpenseForm from './components/UpdateExpenseForm';

// Import pages
import Budget from './pages/Budget';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/budget" element={<Budget />} />
          <Route path="/expense-form" element={<ExpenseForm />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/budget-overview" element={<BudgetOverview />} />
          <Route path="/update/:expenseId" element={<UpdateExpenseForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
