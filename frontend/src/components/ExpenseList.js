import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('http://localhost:8070/budget');
        if (!response.ok) {
          throw new Error('Failed to fetch expenses');
        }
        const data = await response.json();
        
        const sortedExpenses = data.expenses
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        
        setExpenses(sortedExpenses);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <div style={{ 
        maxWidth: '72rem', 
        margin: '0 auto', 
        padding: '1.5rem', 
        textAlign: 'center',
        color: '#9CA3AF' // Changed to dark theme text color
      }}>
        Loading expenses...
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div style={{ 
        maxWidth: '72rem', 
        margin: '0 auto', 
        padding: '1.5rem', 
        color: '#F87171', // Changed to red-400 for dark theme
        textAlign: 'center'
      }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '72rem', 
      margin: '0 auto', 
      padding: '1.5rem',
      backgroundColor: '#111827' // Added dark background
    }}>
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        color: '#F3F4F6', // Changed to light text
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        Recent Expenses
      </h2>

      {expenses.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: '#9CA3AF', // Changed to dark theme text color
          padding: '1rem',
          backgroundColor: '#1F2937', // Darker background
          borderRadius: '0.5rem',
          border: '1px solid #374151' // Added border
        }}>
          No expenses found
        </div>
      ) : (
        <div style={{ 
          backgroundColor: '#1F2937', // Dark background
          borderRadius: '0.5rem', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)', // Darker shadow
          overflow: 'hidden',
          border: '1px solid #374151' // Added border
        }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse' 
          }}>
            <thead style={{ backgroundColor: '#111827' }}> {/* Dark header */}
              <tr>
                {[
                  { label: 'Date', align: 'left', width: '20%' },
                  { label: 'Category', align: 'left', width: '20%' },
                  { label: 'Description', align: 'left', width: '40%' },
                  { label: 'Amount', align: 'right', width: '20%' }
                ].map((header) => (
                  <th
                    key={header.label}
                    style={{ 
                      padding: '0.75rem 1.5rem', 
                      textAlign: header.align, 
                      fontSize: '0.75rem', 
                      fontWeight: '500', 
                      color: '#9CA3AF', // Light text
                      textTransform: 'uppercase',
                      width: header.width,
                      borderBottom: '1px solid #374151' // Added border
                    }}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense) => (
                <tr 
                  key={expense._id} 
                  style={{ 
                    borderTop: '1px solid #374151', // Darker border
                    transition: 'background-color 0.2s',
                    ':hover': { backgroundColor: '#1E3A8A' } // Darker hover
                  }}
                >
                  <td style={{ 
                    padding: '1rem 1.5rem', 
                    whiteSpace: 'nowrap', 
                    fontSize: '0.875rem', 
                    color: '#D1D5DB', // Light text
                    textAlign: 'left'
                  }}>
                    {format(new Date(expense.date), 'MMM d, yyyy')}
                  </td>
                  <td style={{ 
                    padding: '1rem 1.5rem', 
                    whiteSpace: 'nowrap',
                    textAlign: 'left'
                  }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      display: 'inline-flex', 
                      fontSize: '0.75rem', 
                      fontWeight: '600', 
                      borderRadius: '9999px', 
                      backgroundColor: '#1E40AF', // Darker blue
                      color: '#EFF6FF' // Light text
                    }}>
                      {expense.category}
                    </span>
                  </td>
                  <td style={{ 
                    padding: '1rem 1.5rem', 
                    whiteSpace: 'nowrap', 
                    fontSize: '0.875rem', 
                    color: '#D1D5DB', // Light text
                    textAlign: 'left'
                  }}>
                    {expense.description}
                  </td>
                  <td style={{ 
                    padding: '1rem 1.5rem', 
                    whiteSpace: 'nowrap', 
                    fontSize: '0.875rem', 
                    color: '#D1D5DB', // Light text
                    textAlign: 'right'
                  }}>
                    LKR {expense.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

<div className="mt-8 flex justify-end">
        <button
           onClick={() => navigate('/overview')}
           className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition"
          >
          <Calendar className="mr-2" size={20} />
          View Monthly Budget Overview
        </button>
      </div>
    </div>
  );
};

export default ExpenseList;