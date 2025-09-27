// Calculate individual balances for each person
export function calculateBalances(expenses, friends) {
    const balances = {}

    // Initialize balances
    friends.forEach(friend => {
        balances[friend] = 0
    })

    expenses.forEach(expense => {
        const { amount, paidBy, participants, splitType } = expense

        // Person who paid gets credited
        balances[paidBy] += amount

        // Debit participants based on split type
        if (splitType && splitType.splits) {
            // Use custom splits (percentage or custom amounts)
            Object.entries(splitType.splits).forEach(([participant, splitAmount]) => {
                if (Object.prototype.hasOwnProperty.call(balances, participant)) {
                    balances[participant] -= splitAmount
                }
            })
        } else {
            // Default to equal split for backward compatibility
            const perPersonAmount = amount / participants.length
            participants.forEach(participant => {
                if (Object.prototype.hasOwnProperty.call(balances, participant)) {
                    balances[participant] -= perPersonAmount
                }
            })
        }
    })

    return balances
}

// Calculate optimal settlements to minimize transactions
export function calculateSettlements(balances) {
    const settlements = []
    const creditors = [] // People who are owed money (positive balance)
    const debtors = [] // People who owe money (negative balance)

    // Separate creditors and debtors
    Object.entries(balances).forEach(([person, balance]) => {
        if (balance > 0.01) { // Small threshold to handle floating point precision
            creditors.push({ person, amount: balance })
        } else if (balance < -0.01) {
            debtors.push({ person, amount: Math.abs(balance) })
        }
    })

    // Sort by amount (largest first) for optimal settlements
    creditors.sort((a, b) => b.amount - a.amount)
    debtors.sort((a, b) => b.amount - a.amount)

    // Match debtors with creditors
    let i = 0,
        j = 0
    while (i < creditors.length && j < debtors.length) {
        const creditor = creditors[i]
        const debtor = debtors[j]

        const settlementAmount = Math.min(creditor.amount, debtor.amount)

        if (settlementAmount > 0.01) { // Only add meaningful settlements
            settlements.push({
                from: debtor.person,
                to: creditor.person,
                amount: settlementAmount
            })
        }

        creditor.amount -= settlementAmount
        debtor.amount -= settlementAmount

        if (creditor.amount < 0.01) i++
            if (debtor.amount < 0.01) j++
    }

    return settlements
}