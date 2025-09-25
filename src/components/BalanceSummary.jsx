import React from 'react'

function BalanceSummary({ balances, settlements }) {
  const hasBalances = Object.keys(balances).length > 0
  const hasSettlements = settlements.length > 0

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="card-title mb-0">💳 Balance Summary</h5>
      </div>
      <div className="card-body">
        {!hasBalances ? (
          <p className="text-muted text-center">No expenses to calculate balances</p>
        ) : (
          <>
            {/* Individual Balances */}
            <div className="row mb-4">
              <div className="col">
                <h6 className="mb-3">Individual Balances:</h6>
                <div className="row">
                  {Object.entries(balances).map(([person, balance]) => (
                    <div key={person} className="col-md-6 mb-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-light text-dark fs-6 px-3 py-2">
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
                      <span className="ms-2 badge bg-primary fs-6">₹{settlement.amount.toFixed(2)}</span>
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