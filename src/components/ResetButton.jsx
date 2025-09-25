import React, { useState } from 'react'

function ResetButton({ onReset }) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleReset = () => {
    onReset()
    setShowConfirm(false)
  }

  if (showConfirm) {
    return (
      <div className="card border-danger">
        <div className="card-body text-center">
          <h6 className="card-title text-danger">Confirm Reset</h6>
          <p className="card-text">This will delete all expenses and reset friends list. This cannot be undone.</p>
          <div className="d-flex gap-2 justify-content-center">
            <button 
              className="btn btn-danger"
              onClick={handleReset}
            >
              Yes, Reset All
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-body text-center">
        <h6 className="card-title">🔄 Reset Data</h6>
        <p className="card-text small text-muted">Clear all expenses and reset</p>
        <button 
          className="btn btn-outline-danger btn-sm"
          onClick={() => setShowConfirm(true)}
        >
          Reset All Data
        </button>
      </div>
    </div>
  )
}

export default ResetButton