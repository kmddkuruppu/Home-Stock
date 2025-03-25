import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Budget from './pages/Budget';
import ExpenseForm from './components/ExpenseForm';
import Navbar from './components/Navbar';
import BudgetOverview from './components/BudgetOverview';
import UpdateExpenseForm from './components/UpdateExpenseForm';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          
          <Route path="/budget" element={<Budget />} />
          <Route path="/EXpenseForm" element={<ExpenseForm/>}/>
          <Route path="/Navbar" element={<Navbar/>}/>
          <Route path="/display" element={<BudgetOverview />} />
          <Route path="/updateExpense/:expenseId" element={<UpdateExpenseForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
