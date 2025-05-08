// src/pages/Budgeting.jsx
import React from 'react';
import BudgetOverview from '../components/BudgetOverview';
import ExpenseList from '../components/ExpenseList';

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-float"
          style={{
            width: `${Math.random() * 200 + 50}px`,
            height: `${Math.random() * 200 + 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 20 + 20}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  );
};

export default function Budgeting() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white relative overflow-hidden">
      <FloatingParticles />
      <div className="relative z-10 py-10">
        <header className="mb-8 px-4 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-100">Home Stock Budget Tracker</h1>
        </header>
        <main className="px-4 max-w-7xl mx-auto">
          <BudgetOverview />
          <div className="mt-8">
            <ExpenseList />
          </div>
        </main>
      </div>
    </div>
  );
}
