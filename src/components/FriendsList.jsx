import React, { useState } from 'react'

function FriendsList({ friends, onAddFriend, onRemoveFriend }) {
  const [newFriend, setNewFriend] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newFriend.trim()) {
      onAddFriend(newFriend.trim())
      setNewFriend('')
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">👥 Friends Group</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Add friend name"
              value={newFriend}
              onChange={(e) => setNewFriend(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Add
            </button>
          </div>
        </form>

        <div className="friends-list">
          <div className="row g-2">
            {friends.map((friend, index) => (
              <div key={index} className="col-6">
                <div className="d-flex justify-content-between align-items-center p-2 bg-white rounded">
                  <span className="badge bg-light text-dark fs-6 px-3 py-2">
                    {friend}
                  </span>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => onRemoveFriend(friend)}
                    disabled={friends.length <= 2}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {friends.length <= 2 && (
          <small className="text-muted">
            Need at least 2 friends to split expenses
          </small>
        )}
      </div>
    </div>
  )
}

export default FriendsList
