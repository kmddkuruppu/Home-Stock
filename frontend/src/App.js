import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Budget from './pages/Budget';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='budget' element={<Budget/>} />
          
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
