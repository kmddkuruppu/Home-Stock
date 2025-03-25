import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
        color: '#6B7280'
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
        color: 'red',
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
      padding: '1.5rem' 
    }}>
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        color: '#1F2937', 
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        Recent Expenses
      </h2>

      {expenses.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: '#6B7280',
          padding: '1rem',
          backgroundColor: '#F9FAFB',
          borderRadius: '0.5rem'
        }}>
          No expenses found
        </div>
      ) : (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '0.5rem', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
          overflow: 'hidden' 
        }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse' 
          }}>
            <thead style={{ backgroundColor: '#F9FAFB' }}>
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
                      color: '#6B7280', 
                      textTransform: 'uppercase',
                      width: header.width
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
                    borderTop: '1px solid #E5E7EB',
                    transition: 'background-color 0.2s',
                    ':hover': { backgroundColor: '#F3F4F6' }
                  }}
                >
                  <td style={{ 
                    padding: '1rem 1.5rem', 
                    whiteSpace: 'nowrap', 
                    fontSize: '0.875rem', 
                    color: '#6B7280',
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
                      backgroundColor: '#DBEAFE', 
                      color: '#1E40AF' 
                    }}>
                      {expense.category}
                    </span>
                  </td>
                  <td style={{ 
                    padding: '1rem 1.5rem', 
                    whiteSpace: 'nowrap', 
                    fontSize: '0.875rem', 
                    color: '#6B7280',
                    textAlign: 'left'
                  }}>
                    {expense.description}
                  </td>
                  <td style={{ 
                    padding: '1rem 1.5rem', 
                    whiteSpace: 'nowrap', 
                    fontSize: '0.875rem', 
                    color: '#6B7280',
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
    </div>
  );
};

export default ExpenseList;