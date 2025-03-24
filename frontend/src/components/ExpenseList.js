import React from 'react';
import { format } from 'date-fns';
import { Trash2, Edit2 } from 'lucide-react';

const mockExpenses = [
  {
    id: 1,
    amount: 45.99,
    category: 'Groceries',
    description: 'Weekly groceries',
    date: '2024-03-15'
  },
  {
    id: 2,
    amount: 25.50,
    category: 'Household Essentials',
    description: 'Cleaning supplies',
    date: '2024-03-14'
  },
  {
    id: 3,
    amount: 15.99,
    category: 'Personal Care',
    description: 'Toiletries',
    date: '2024-03-13'
  }
];

const ExpenseList = () => {
  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '1.5rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '1.5rem' }}>Recent Expenses</h2>

      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#F9FAFB' }}>
              <tr>
                {['Date', 'Category', 'Description', 'Amount', 'Actions'].map((header) => (
                  <th
                    key={header}
                    style={{ padding: '0.75rem 1.5rem', textAlign: header === 'Actions' ? 'right' : 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6B7280', textTransform: 'uppercase' }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {mockExpenses.map((expense) => (
                <tr key={expense.id} style={{ borderTop: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6B7280' }}>
                    {format(new Date(expense.date), 'MMM d, yyyy')}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                    <span style={{ padding: '0.25rem 0.5rem', display: 'inline-flex', fontSize: '0.75rem', fontWeight: '600', borderRadius: '9999px', backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
                      {expense.category}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6B7280' }}>
                    {expense.description}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6B7280' }}>
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button style={{ color: '#4F46E5', marginRight: '0.75rem', cursor: 'pointer' }}>
                      <Edit2 style={{ height: '1rem', width: '1rem' }} />
                    </button>
                    <button style={{ color: '#DC2626', cursor: 'pointer' }}>
                      <Trash2 style={{ height: '1rem', width: '1rem' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;
