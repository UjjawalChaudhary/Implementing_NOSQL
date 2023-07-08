const jwt = require('jsonwebtoken');
const User = require('../models/users');

const authenticate = (req, res, next) => {
  try {
    const token = req.header('Authorization');
    console.log(token);
    const user = jwt.verify(token, 'secretkey');
    console.log('userID >>>> ', user.userId);
    User.findOne({ _id: user.userId })
      .then(user => {
        if (user) {
          req.user = user;
          next();
        } else {
          return res.status(401).json({ success: false, message: 'User not found' });
        }
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

module.exports = {
  authenticate
};
