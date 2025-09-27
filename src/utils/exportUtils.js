// Export utilities for CSV and PDF generation
export const exportToCSV = (expenses) => {
    // CSV Headers
    const headers = [
        'Date',
        'Description',
        'Category',
        'Amount',
        'Paid By',
        'Participants',
        'Split Type',
        'Per Person Amount'
    ]

    // Convert expenses to CSV rows
    const rows = expenses.map(expense => [
        new Date(expense.date).toLocaleDateString(),
        expense.description,
        expense.category ? `${expense.category.icon} ${expense.category.name}` : 'Other',
        `₹${expense.amount.toFixed(2)}`,
        expense.paidBy,
        expense.participants.join(', '),
        expense.splitType?.name || 'Equal Split',
        expense.splitType?.type === 'equal'
            ? `₹${(expense.amount / expense.participants.length).toFixed(2)}`
            : 'Custom'
    ])

    // Add summary row
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    rows.push(['', '', '', '', '', '', '', ''])
    rows.push(['TOTAL', '', '', `₹${totalAmount.toFixed(2)}`, '', '', '', ''])

    // Combine headers and rows
    const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `expense-report-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
}

export const exportToPDF = async(expenses, friends, balances, settlements) => {
        try {
            // Create PDF content as HTML string
            const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0)
            const currentDate = new Date().toLocaleDateString()

            const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Expense Report</title>
      <style>
        @media print {
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .summary { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; page-break-inside: avoid; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #3AAFA9; color: white; }
          .balance-positive { color: #2B7A78; font-weight: bold; }
          .balance-negative { color: #dc3545; font-weight: bold; }
          .settlement { background: #e3f2fd; padding: 10px; margin: 5px 0; border-radius: 4px; }
          @page { size: auto; margin: 20mm; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>💰 Expense Report</h1>
        <p>Generated on: ${currentDate}</p>
        <p>Group Members: ${friends.join(', ')}</p>
      </div>

      <div class="summary">
        <h3>📊 Summary</h3>
        <p><strong>Total Expenses:</strong> ${expenses.length}</p>
        <p><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</p>
        <p><strong>Average per Person:</strong> ₹${(totalAmount / friends.length).toFixed(2)}</p>
      </div>

      <h3>📝 Expense Details</h3>
      <table>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Paid By</th>
          <th>Participants</th>
          <th>Split Type</th>
        </tr>
        ${expenses.map(expense => `
          <tr>
            <td>${new Date(expense.date).toLocaleDateString()}</td>
            <td>${expense.description}</td>
            <td>${expense.category ? `${expense.category.icon} ${expense.category.name}` : 'Other'}</td>
            <td>₹${expense.amount.toFixed(2)}</td>
            <td>${expense.paidBy}</td>
            <td>${expense.participants.join(', ')}</td>
            <td>${expense.splitType?.name || 'Equal Split'}</td>
          </tr>
        `).join('')}
      </table>

      <h3>💳 Balance Summary</h3>
      <table>
        <tr><th>Person</th><th>Balance</th></tr>
        ${Object.entries(balances).map(([person, balance]) => `
          <tr>
            <td>${person}</td>
            <td class="${balance >= 0 ? 'balance-positive' : 'balance-negative'}">
              ${balance >= 0 ? '+' : ''}₹${balance.toFixed(2)}
            </td>
          </tr>
        `).join('')}
      </table>

      ${settlements.length > 0 ? `
        <h3>💸 Settlement Plan</h3>
        ${settlements.map(settlement => `
          <div class="settlement">
            <strong>${settlement.from}</strong> owes <strong>${settlement.to}</strong> 
            <strong>₹${settlement.amount.toFixed(2)}</strong>
          </div>
        `).join('')}
      ` : ''}
    </body>
    </html>
  `

        // Open in new window and trigger print dialog for PDF
        const newWindow = window.open('', '_blank')
        if (!newWindow) {
            throw new Error('Pop-up blocked. Please allow pop-ups for this site to generate PDF.')
        }
        newWindow.document.write(htmlContent)
        newWindow.document.close()
        
        // Wait for content to load
        setTimeout(() => {
            newWindow.print()
            // Close the window after printing (or when print dialog is closed)
            newWindow.onafterprint = () => {
                newWindow.close()
            }
        }, 250)
    } catch (error) {
        console.error('Error generating PDF:', error)
        alert('There was an error generating the PDF. Please try again.')
    }
}