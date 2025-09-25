import React from 'react'

function ExpenseList({ expenses, onRemoveExpense }) {
  if (expenses.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center text-muted">
          <h6>No expenses added yet</h6>
          <p>Add your first expense above to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">📝 Expense History</h5>
      </div>
      <div className="card-body">
        <div className="list-group list-group-flush">
          {expenses.map(expense => (
            <div key={expense.id} className="list-group-item d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold">{expense.description}</div>
                <small className="text-muted">
                  Paid by <span className="badge bg-primary">{expense.paidBy}</span>
                  {' '}for{' '}
                  {expense.participants.map((participant, index) => (
                    <span key={participant}>
                      <span className="badge bg-light text-dark">{participant}</span>
                      {index < expense.participants.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </small>
                <div className="mt-1">
                  <small className="text-muted">
                    {new Date(expense.date).toLocaleDateString()} • 
                    ₹{(expense.amount / expense.participants.length).toFixed(2)} per person
                  </small>
                </div>
              </div>
              <div className="text-end">
                <span className="badge bg-success fs-6 mb-2">₹{expense.amount}</span>
                <br />
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => onRemoveExpense(expense.id)}
                  title="Delete expense"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExpenseList