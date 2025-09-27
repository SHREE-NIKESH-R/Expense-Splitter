import React, { useState } from 'react'
import ResetButton from './ResetButton'

function BalanceSummary({ balances, settlements, onReset, expenses = [] }) {
  const [showCategoryBreakdown, setShowCategoryBreakdown] = useState(false)
  
  const hasBalances = Object.keys(balances).length > 0
  const hasSettlements = settlements.length > 0

  // Calculate category-wise spending
  const categoryTotals = expenses.reduce((acc, expense) => {
    if (expense.category) {
      const categoryId = expense.category.id
      if (!acc[categoryId]) {
        acc[categoryId] = {
          name: expense.category.name,
          icon: expense.category.icon,
          total: 0,
          count: 0
        }
      }
      acc[categoryId].total += expense.amount
      acc[categoryId].count += 1
    }
    return acc
  }, {})

  return (
    <div className="card mb-4">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">💳 Balance Summary</h5>
          <div className="d-flex gap-2">
            {Object.keys(categoryTotals).length > 0 && (
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={() => setShowCategoryBreakdown(!showCategoryBreakdown)}
              >
                {showCategoryBreakdown ? '📊 Hide' : '📊 Categories'}
              </button>
            )}
            <ResetButton onReset={onReset} className="reset-button-cool" />
          </div>
        </div>
      </div>
      <div className="card-body">
        {!hasBalances ? (
          <p className="text-muted text-center">No expenses to calculate balances</p>
        ) : (
          <>
            {/* NEW: Category Breakdown */}
            {showCategoryBreakdown && Object.keys(categoryTotals).length > 0 && (
              <div className="mb-4 p-3 bg-light rounded">
                <h6 className="mb-3">📊 Spending by Category:</h6>
                <div className="row">
                  {Object.entries(categoryTotals).map(([categoryId, data]) => (
                    <div key={categoryId} className="col-md-6 mb-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-white text-dark border px-3 py-2">
                          {data.icon} {data.name}
                        </span>
                        <div className="text-end">
                          <strong>₹{data.total.toFixed(2)}</strong>
                          <br />
                          <small className="text-muted">{data.count} expense{data.count > 1 ? 's' : ''}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Individual Balances */}
            <div className="row mb-4">
              <div className="col">
                <h6 className="mb-3">Individual Balances:</h6>
                <div className="row">
                  {Object.entries(balances).map(([person, balance]) => (
                    <div key={person} className="col-md-6 mb-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge badge-custom-light fs-6 px-3 py-2">
                          {person}
                        </span>
                        <span className={balance >= 0 ? 'balance-positive' : 'balance-negative'}>
                          {balance >= 0 ? '+' : ''}₹{balance.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Settlements */}
            {hasSettlements && (
              <div className="border-top pt-3">
                <h6 className="mb-3">💸 Settlement Plan:</h6>
                {settlements.map((settlement, index) => (
                  <div key={index} className="alert alert-info d-flex align-items-center">
                    <div className="me-3">
                      <i className="bi bi-arrow-right-circle-fill fs-4"></i>
                    </div>
                    <div>
                      <strong>{settlement.from}</strong> owes <strong>{settlement.to}</strong>
                      <span className="ms-2 badge badge-custom-primary fs-6">₹{settlement.amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                <small className="text-muted">
                  💡 Complete these payments to settle all balances
                </small>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default BalanceSummary