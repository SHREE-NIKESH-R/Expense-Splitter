// ===== UPDATED: src/components/ExpenseForm.jsx =====
import React, { useState } from 'react'

// Predefined categories with emojis
const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: '🍽️' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'movie', name: 'Movie', icon: '🎬' },
  { id: 'shopping', name: 'Shopping', icon: '🛒' },
  { id: 'snacks', name: 'Snacks', icon: '🍽️' },
]

function ExpenseForm({ friends, onAddExpense }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(friends[0] || '')
  const [participants, setParticipants] = useState(friends)
  const [category, setCategory] = useState('food') // Default to food category

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!description || !amount || !paidBy || participants.length === 0) {
      alert('Please fill all fields and select at least one participant')
      return
    }

    if (parseFloat(amount) <= 0) {
      alert('Amount must be greater than 0')
      return
    }

    const selectedCategory = EXPENSE_CATEGORIES.find(cat => cat.id === category)
    
    const expense = {
      description: description.trim(),
      amount: parseFloat(amount),
      paidBy,
      participants: [...participants],
      category: {
        id: category,
        name: selectedCategory.name,
        icon: selectedCategory.icon
      }
    }

    onAddExpense(expense)
    
    // Reset form
    setDescription('')
    setAmount('')
    setPaidBy(friends[0] || '')
    setParticipants(friends)
    setCategory('food')
  }

  const handleParticipantChange = (friend, isChecked) => {
    if (isChecked) {
      setParticipants([...participants, friend])
    } else {
      setParticipants(participants.filter(p => p !== friend))
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">➕ Add New Expense</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-8 mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Dinner at restaurant"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          {/* NEW: Category Selection */}
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select 
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {EXPENSE_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Who paid?</label>
              <select 
                className="form-select"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                required
              >
                {friends.map(friend => (
                  <option key={friend} value={friend}>{friend}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Who participated?</label>
              <div className="row">
                {friends.map(friend => (
                  <div key={friend} className="col-6 mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`participant-${friend}`}
                        checked={participants.includes(friend)}
                        onChange={(e) => handleParticipantChange(friend, e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor={`participant-${friend}`}>
                        {friend}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-custom-secondary btn-lg w-100">
            Add Expense
          </button>
        </form>
      </div>
    </div>
  )
}

export default ExpenseForm