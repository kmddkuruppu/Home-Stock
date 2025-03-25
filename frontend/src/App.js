import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import components

import Navbar from './components/Navbar';

// Import pages
import Budget from './pages/Budget';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/budget" element={<Budget />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
