const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  expenseamount: { type: Number },
  description: { type: String },
  category: { type: String },
  userrrId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Expense', expenseSchema);