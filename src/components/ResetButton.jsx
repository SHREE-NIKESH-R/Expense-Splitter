import React, { useState } from 'react'

function ResetButton({ onReset, className = '' }) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleReset = () => {
    onReset()
    setShowConfirm(false)
  }

  if (showConfirm) {
    return (
      <div className="position-relative">
        <div className="position-absolute end-0 top-100 mt-2 p-2 bg-white border rounded shadow-sm" style={{ zIndex: 1000, minWidth: '200px' }}>
          <p className="text-danger mb-2 small">Are you sure? This cannot be undone.</p>
          <div className="d-flex gap-2 justify-content-end">
            <button 
              className="btn btn-danger btn-sm"
              onClick={handleReset}
            >
              Reset
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
        <button 
          className="btn btn-outline-danger btn-sm active"
          onClick={() => setShowConfirm(false)}
          style={{
            borderRadius: '20px',
          }}
        >
          🔄 Reset
        </button>
      </div>
    )
  }

  return (
    <button 
      className={`btn btn-danger btn-sm ${className}`}
      onClick={() => setShowConfirm(true)}
      title="Reset all data"
      style={{
        borderRadius: '20px',
      }}
    >
      🔄 Reset All
    </button>
  )
}

export default ResetButton