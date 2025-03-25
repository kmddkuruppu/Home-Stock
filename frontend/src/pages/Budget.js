import React from 'react';
import BudgetOverview from './components/BudgetOverview';

import ExpenseList from './components/ExpenseList';


export default function Budgeting() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ padding: '2.5rem 0' }}>
        <header style={{ marginBottom: '2rem' }}>
          <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
              HomeStock Budget Tracker
            </h1>
          </div>
        </header>
        <main>
          <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
            <BudgetOverview />
            <div style={{ marginTop: '2rem' }}>
              
            </div>
            <div style={{ marginTop: '2rem' }}>
              <ExpenseList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
