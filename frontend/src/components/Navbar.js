import React from 'react';

const Navbar = () => {
  return (
    <nav style={{ background: '#2563EB', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Expense Tracker</div>
      <div>
        <a href="/" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Home</a>
        <a href="/budgeting" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Expenses</a>
        <a href="/about" style={{ color: 'white', textDecoration: 'none' }}>About</a>
      </div>
    </nav>
  );
};

export default Navbar;