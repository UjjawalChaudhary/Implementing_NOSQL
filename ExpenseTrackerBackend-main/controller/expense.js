
const Expense = require('../models/expenses');

const addexpense = (req, res) => {
  const { expenseamount, description, category } = req.body;

  if (expenseamount === undefined || expenseamount.length === 0) {
    return res.status(400).json({ success: false, message: 'Parameters missing' });
  }

  const userrrId = req.user.id;

  Expense.create({ expenseamount, description, category, userrrId })
    .then(expense => {
      return res.status(201).json({ expense, success: true });
    })
    .catch(err => {
      return res.status(500).json({ success: false, error: err });
    });
};

const getexpenses = (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 2;
  const page = req.query.page ? parseInt(req.query.page) : 1;

  Expense.find({ userrrId: req.user.id })
    .skip((page - 1) * limit)
    .limit(limit)
    .then(expenses => {
      Expense.countDocuments({ userrrId: req.user.id })
        .then(count => {
          const pages = Math.ceil(count / limit);
          res.json({ expenses, pages });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

const deleteexpense = (req, res) => {
  const expenseid = req.params.expenseid;
  if (expenseid === undefined || expenseid.length === 0) {
    return res.status(400).json({ success: false });
  }

  Expense.deleteOne({ _id: expenseid, userrrId: req.user.id })
    .then(result => {
      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: 'Expense does not belong to the user' });
      }
      return res.status(200).json({ success: true, message: 'Deleted successfully' });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ success: false, message: 'Failed' });
    });
};

module.exports = {
  deleteexpense,
  getexpenses,
  addexpense
};