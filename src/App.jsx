import React, { useState, useEffect } from 'react'
import FriendsList from './components/FriendsList'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import BalanceSummary from './components/BalanceSummary'
import { calculateBalances, calculateSettlements } from './utils/calculations'

function App() {
  const [friends, setFriends] = useState(['Pranav', 'Sai', 'Gojo', 'Nikesh', 'Kanna'])
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      description: 'Lunch at Madhi',
      amount: 610,
      paidBy: 'Pranav',
      participants: ['Pranav', 'Sai', 'Gojo', 'Nikesh', 'Kanna'],
      date: new Date().toISOString(),
      category: {
        id: 'food',
        name: 'Food & Dining',
        icon: '🍽️'
      }
    },
    {
      id: 2,
      description: 'Movie - Leo',
      amount: 700,
      paidBy: 'Sai',
      participants: ['Pranav', 'Sai', 'Kanna', 'Nikesh', 'Gojo'],
      date: new Date().toISOString(),
      category: {
        id: 'entertainment',
        name: 'Entertainment',
        icon: '🎬'
      }
    },
    {
      id: 3,
      description: 'Weekend Trip to Anna Park!',
      amount: 520,
      paidBy: 'Gojo',
      participants: ['Pranav', 'Sai', 'Gojo', 'Kanna', 'Nikesh'],
      date: new Date().toISOString(),
      category: {
        id: 'travel',
        name: 'Travel',
        icon: '✈️'
      }
    },
    {
      id: 4,
      description: 'Shopping at Reliance Mall',
      amount: 240,
      paidBy: 'Nikesh',
      participants: ['Nikesh', 'Kanna', 'Gojo'],
      date: new Date().toISOString(),
      category: {
        id: 'shopping',
        name: 'Shopping',
        icon: '🛒'
      }
    },
    {
      id: 5,
      description: 'Tea and Puffs',
      amount: 170,
      paidBy: 'Kanna',
      participants: ['Pranav', 'Sai', 'Kanna', 'Nikesh'],
      date: new Date().toISOString(),
      category: {
        id: 'snacks',
        name: 'Snacks',
        icon: '🍽️'
      }
    },
    {
      id: 6,
      description: 'samosa at canteen',
      amount: 60,
      paidBy: 'Kanna',
      participants: ['Pranav', 'Sai', 'Gojo', 'Nikesh', 'Kanna'],
      date: new Date().toISOString(),
      category: {
        id: 'snacks',
        name: 'Snacks',
        icon: '🍽️'
      }
    }
  ])

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedFriends = localStorage.getItem('expense-splitter-friends')
    const savedExpenses = localStorage.getItem('expense-splitter-expenses')
    
    if (savedFriends) {
      setFriends(JSON.parse(savedFriends))
    }
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    }
  }, [])

  // Save to localStorage whenever friends or expenses change
  useEffect(() => {
    localStorage.setItem('expense-splitter-friends', JSON.stringify(friends))
  }, [friends])

  useEffect(() => {
    localStorage.setItem('expense-splitter-expenses', JSON.stringify(expenses))
  }, [expenses])

  const addFriend = (friendName) => {
    if (friendName && !friends.includes(friendName)) {
      setFriends([...friends, friendName])
    }
  }

  const removeFriend = (friendName) => {
    setFriends(friends.filter(friend => friend !== friendName))
    // Remove friend from existing expenses
    setExpenses(expenses.map(expense => ({
      ...expense,
      participants: expense.participants.filter(p => p !== friendName)
    })).filter(expense => expense.participants.length > 0))
  }

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now(),
      date: new Date().toISOString()
    }
    setExpenses([...expenses, newExpense])
  }

  const removeExpense = (expenseId) => {
    setExpenses(expenses.filter(expense => expense.id !== expenseId))
  }

  const resetAll = () => {
    setFriends([])
    setExpenses([])
    localStorage.removeItem('expense-splitter-friends')
    localStorage.removeItem('expense-splitter-expenses')
  }

  const balances = calculateBalances(expenses, friends)
  const settlements = calculateSettlements(balances)

  return (
    <div className="App">
      {/* Header Section */}
      <header className="app-header bg-primary text-white py-3 sticky-top">
        <div className="container">
          <div className="text-center">
            <h1 className="display-4 mb-2">💰 Expense Splitter</h1>
            <p className="lead mb-0">Track group expenses and settle up easily</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-3">
        <div className="container-fluid">
          <div className="row g-3">
            {/* Left Side - Friends List */}
            <div className="col-lg-6">
              <div className="card shadow-sm mb-3">
                <div className="card-body">
                  <FriendsList 
                    friends={friends}
                    onAddFriend={addFriend}
                    onRemoveFriend={removeFriend}
                    onResetFriends={resetAll}
                  />
                </div>
              </div>

              {/* Expense Form */}
              <div className="card shadow-sm">
                <div className="card-body">
                  <ExpenseForm 
                    friends={friends}
                    onAddExpense={addExpense}
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Balance Summary */}
            <div className="col-lg-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <BalanceSummary 
                    balances={balances}
                    settlements={settlements}
                    onReset={resetAll}
                    expenses={expenses}
                  />
                </div>
              </div>
            </div>

            {/* Full Width - Expense List */}
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <ExpenseList 
                    expenses={expenses}
                    onRemoveExpense={removeExpense}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App