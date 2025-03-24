import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

//import components
import ExpenseForm from './components/ExpenseForm';
import Navbar from './components/Navbar';
import BudgetOverview from './components/BudgetOverview';
import UpdateExpenseForm from './components/UpdateExpenseForm';

//import pages
import Budgeting from './pages/Budgeting'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          
          <Route path="/budgeting" element={<Budgeting />} />
          <Route path="/EXpenseForm" element={<ExpenseForm/>}/>
          <Route path="/Navbar" element={<Navbar/>}/>
          <Route path="/display" element={<BudgetOverview />} />
          <Route path="/update/:expenseId" element={<UpdateExpenseForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
