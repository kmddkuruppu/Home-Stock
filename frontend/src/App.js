import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Budget from './pages/Budget';
// import ExpenseForm from './components/ExpenseForm';
// import BudgetOverview from './components/BudgetOverview';
// import UpdateExpenseForm from './components/UpdateExpenseForm';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/budget" element={<Budget />} />
          {/* <Route path="/expense-form" element={<ExpenseForm />} />
          <Route path="/display" element={<BudgetOverview />} />
          <Route path="/updateExpense/:expenseId" element={<UpdateExpenseForm />} /> */}
        </Routes>
      </div>
    </Router>
  );
}


export default App;
