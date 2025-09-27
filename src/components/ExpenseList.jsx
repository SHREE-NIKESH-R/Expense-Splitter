import React, { useState } from 'react'

function ExpenseList({ expenses, onRemoveExpense, onResetExpenses }) {
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [filterCategory, setFilterCategory] = useState('all')

  const handleReset = () => {
    onResetExpenses()
    setShowResetConfirm(false)
  }

  // Get unique categories from expenses
  const availableCategories = [...new Set(expenses.map(exp => exp.category?.id).filter(Boolean))]
  
  // Filter expenses by category
  const filteredExpenses = filterCategory === 'all' 
    ? expenses 
    : expenses.filter(exp => exp.category?.id === filterCategory)

  if (expenses.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">📝 Expense History (0)</h5>
        </div>
        <div className="card-body text-center text-muted">
          <h6>No expenses added yet</h6>
          <p>Add your first expense to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">📝 Expense History ({filteredExpenses.length})</h5>
          <div className="d-flex gap-2 align-items-center">
            {/* NEW: Category Filter */}
            {availableCategories.length > 0 && (
              <select 
                className="form-select form-select-sm"
                style={{width: 'auto'}}
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {availableCategories.map(categoryId => {
                  const expense = expenses.find(exp => exp.category?.id === categoryId)
                  return (
                    <option key={categoryId} value={categoryId}>
                      {expense?.category?.icon} {expense?.category?.name}
                    </option>
                  )
                })}
              </select>
            )}
            
            {!showResetConfirm ? (
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={() => setShowResetConfirm(true)}
                title="Clear all expenses"
              >
                🗑️ Clear All
              </button>
            ) : (
              <div className="d-flex gap-1">
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={handleReset}
                >
                  Confirm
                </button>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="card-body">
        {showResetConfirm && (
          <div className="alert alert-warning mb-3">
            <small><strong>Warning:</strong> This will delete all expense records!</small>
          </div>
        )}
        
        <div className="list-group list-group-flush">
          {filteredExpenses.map(expense => (
            <div key={expense.id} className="list-group-item d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="d-flex align-items-center mb-1">
                  {/* NEW: Category icon and name */}
                  {expense.category && (
                    <span className="badge bg-light text-dark me-2">
                      {expense.category.icon} {expense.category.name}
                    </span>
                  )}
                </div>
                <div className="fw-bold">{expense.description}</div>
                <small className="text-muted">
                  Paid by <span className="badge badge-custom-primary">{expense.paidBy}</span>
                  {' '}for{' '}
                  {expense.participants.map((participant, index) => (
                    <span key={participant}>
                      <span className="badge badge-custom-light">{participant}</span>
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
                <span className="badge badge-custom-primary fs-6 mb-2">₹{expense.amount}</span>
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

        <div className="mt-3 text-center">
          <small className="text-muted">
            {filterCategory === 'all' 
              ? `Total: ₹${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)} across ${expenses.length} expenses`
              : `Filtered: ₹${filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)} across ${filteredExpenses.length} expenses`
            }
          </small>
        </div>
      </div>
    </div>
  )
}

export default ExpenseList