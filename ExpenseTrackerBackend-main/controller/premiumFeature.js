const User = require('../models/users');
const Expense = require('../models/expenses');
const sequelize = require('../util/database');

const leadership = async (req, res) => {
  try {
    const userLeaderboard = await User.findAll({
      attributes: [
        'id',
        'name',
        [sequelize.fn('sum', sequelize.col('exps.expenseamount')), 'total']
      ],
      include: [
        {
          model: Expense,
          attributes: []
        }
      ],
      group: ['userrr.id'],
      order: [['total', 'desc']]
    });
    res.status(200).json(userLeaderboard);
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: 'Something went wrong', error: err });
  }
};

module.exports = {
  leadership
};
