// Add Expense
function addNewExpense(e) {
    e.preventDefault();
  
    const expenseDetails = {
      expenseamount: document.getElementById('expenseamount').value,
      description: document.getElementById('description').value,
      category: document.getElementById('category').value,
    };
  
    const token = localStorage.getItem('token');
    axios
      .post('http://localhost:3000/expense/addexpense', expenseDetails, {
        headers: { Authorization: token },
      })
      .then((response) => {
        const expense = response.data.expense;
        addNewExpenseToUI(expense);
      })
      .catch((err) => {
        showError(err);
      });
  }
  
  // Get Expenses
  async function getExpenses() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/expense/getexpenses', {
        headers: { Authorization: token },
      });
      const expenses = response.data.expenses;
      expenses.forEach((expense) => {
        addNewExpenseToUI(expense);
      });
    } catch (err) {
      showError(err);
    }
  }
  
  // Delete Expense
  async function deleteExpense(event, expenseId) {
    event.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/expense/deleteexpense/${expenseId}`, {
        headers: { Authorization: token },
      });
      removeExpenseFromUI(expenseId);
    } catch (err) {
      showError(err);
    }
  }
  
  // Add new expense to UI
  function addNewExpenseToUI(expense) {
    const parentElement = document.getElementById('listOfExpenses');
    const expenseElemId = `expense-${expense._id}`;
    parentElement.innerHTML += `
      <li id=${expenseElemId}>
        ${expense.expenseamount} - ${expense.category} - ${expense.description}
        <button onclick='deleteExpense(event, "${expense._id}")'>Delete Expense</button>
      </li>`;
  }
  
  // Remove expense from UI
  function removeExpenseFromUI(expenseId) {
    const expenseElemId = `expense-${expenseId}`;
    const expenseElem = document.getElementById(expenseElemId);
    if (expenseElem) {
      expenseElem.remove();
    }
  }
  
  // Event listeners
  document.getElementById('addExpenseForm').addEventListener('submit', addNewExpense);
  window.addEventListener('DOMContentLoaded', getExpenses);
  