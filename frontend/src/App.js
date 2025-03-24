import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import ExpenseForm from './components/ExpenseForm';
import Navbar from './components/Navbar';
import BudgetOverview from './components/BudgetOverview';
import UpdateExpenseForm from './components/UpdateExpenseForm';

// Import pages
import Budgeting from './pages/Budgeting';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/budgeting" element={<Budgeting />} />
          <Route path="/expense-form" element={<ExpenseForm />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/display" element={<BudgetOverview />} />
          <Route path="/update/:expenseId" element={<UpdateExpenseForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
