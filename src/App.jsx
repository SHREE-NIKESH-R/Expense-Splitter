import React, { useState, useEffect } from 'react'
import FriendsList from './components/FriendsList'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import BalanceSummary from './components/BalanceSummary'
import ResetButton from './components/ResetButton'
import { calculateBalances, calculateSettlements } from './utils/calculations'

function App() {
  const [friends, setFriends] = useState(['Pranav', 'Sai', 'Gojo', 'Nikesh', 'Kanna'])
  const [expenses, setExpenses] = useState([
    // {
    //   id: 1,
    //   description: 'Lunch at Madhi',
    //   amount: 610,
    //   paidBy: 'Pranav',
    //   participants: ['Pranav', 'Sai', 'Gojo', 'Nikesh', 'Kanna'],
    //   date: new Date().toISOString()
    // },
    // {
    //   id: 2,
    //   description: 'Snacks at Chennai Cakes',
    //   amount: 350,
    //   paidBy: 'Sai',
    //   participants: ['Pranav', 'Sai', 'Kanna', 'Nikesh', 'Gojo'],
    //   date: new Date().toISOString()
    // }
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
      <header className="app-header bg-primary text-white py-4 mb-4">
        <div className="container">
          <div className="text-center">
            <h1 className="display-4 mb-2">💰 Expense Splitter</h1>
            <p className="lead mb-0">Track group expenses and settle up easily</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-fluid">
        <div className="row g-4">
          
          {/* Sidebar - Friends & Controls */}
          <aside className="col-lg-3 col-md-4">
            <div className="sticky-top" style={{top: '1rem'}}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <FriendsList 
                    friends={friends}
                    onAddFriend={addFriend}
                    onRemoveFriend={removeFriend}
                  />
                </div>
              </div>
              
              <div className="card shadow-sm mt-3">
                <div className="card-body text-center">
                  <ResetButton onReset={resetAll} />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="col-lg-9 col-md-8">
            <div className="row g-4">
              
              {/* Expense Form */}
              <div className="col-6">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <ExpenseForm 
                      friends={friends}
                      onAddExpense={addExpense}
                    />
                  </div>
                </div>
              </div>

              {/* Balance Summary */}
              <div className="col-6">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <BalanceSummary 
                      balances={balances}
                      settlements={settlements}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Expense List */}
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
      </main>
    </div>
  );
}

export default App