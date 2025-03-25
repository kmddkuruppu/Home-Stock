import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Trash2, Edit2 } from 'lucide-react';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch expenses when the component mounts
    const fetchExpenses = async () => {
      try {
        const response = await fetch('http://localhost:8070/budget');
        if (!response.ok) {
          throw new Error('Failed to fetch expenses');
        }
        const data = await response.json();
        // Sort expenses by date in descending order and take the last 5
        const sortedExpenses = data.expenses
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        setExpenses(sortedExpenses);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Handle expense deletion
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8070/budget/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      // Remove the deleted expense from the state
      setExpenses(expenses.filter(expense => expense._id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense');
    }
  };

  // Rendering loading state
  if (isLoading) {
    return (
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '1.5rem', textAlign: 'center' }}>
        Loading expenses...
      </div>
    );
  }

  // Rendering error state
  if (error) {
    return (
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '1.5rem', color: 'red', textAlign: 'center' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '1.5rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '1.5rem' }}>
        Recent Expenses (Last 5)
      </h2>

      {expenses.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#6B7280' }}>
          No expenses found. Add some expenses to get started!
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#F9FAFB' }}>
                <tr>
                  {['Date', 'Category', 'Description', 'Amount', 'Actions'].map((header) => (
                    <th
                      key={header}
                      style={{ 
                        padding: '0.75rem 1.5rem', 
                        textAlign: header === 'Actions' ? 'right' : 'left', 
                        fontSize: '0.75rem', 
                        fontWeight: '500', 
                        color: '#6B7280', 
                        textTransform: 'uppercase' 
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id} style={{ borderTop: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6B7280' }}>
                      {format(new Date(expense.date), 'MMM d, yyyy')}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
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
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6B7280' }}>
                      {expense.description}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6B7280' }}>
                      Rs. {expense.amount.toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <button 
                        style={{ color: '#4F46E5', marginRight: '0.75rem', cursor: 'pointer' }}
                        title="Edit Expense"
                      >
                        <Edit2 style={{ height: '1rem', width: '1rem' }} />
                      </button>
                      <button 
                        style={{ color: '#DC2626', cursor: 'pointer' }} 
                        onClick={() => handleDelete(expense._id)}
                        title="Delete Expense"
                      >
                        <Trash2 style={{ height: '1rem', width: '1rem' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;