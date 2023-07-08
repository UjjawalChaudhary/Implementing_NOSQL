const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const s3upload = require('../service/uploadtos3');
const Expense = require('../models/expenses');

function isStringInvalid(string) {
  if (string === undefined || string.length === 0) {
    return true;
  } else {
    return false;
  }
}

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('email', email);
    if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(400).json({ err: 'Bad parameters. Something is missing' });
    }
    console.log(req.body);
    const saltrounds = 10;
    const hash = await bcrypt.hash(password, saltrounds);
    const user = await User.create({ name, email, password: hash });
    console.log('result', user);
    res.status(201).json({ message: 'Successfully create new user' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const generateAccessToken = (id, name, ispremiumuser) => {
  return jwt.sign({ userId: id, name: name, ispremiumuser }, 'secretkey');
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(400).json({ message: 'Email id or password is missing', success: false });
    }
    console.log(password);
    const user = await User.findOne({ email });
    if (user) {
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        return res.status(200).json({ success: true, message: 'User logged in successfully', token: generateAccessToken(user.id, user.name, user.ispremiumuser) });
      } else {
        return res.status(400).json({ success: false, message: 'Password is incorrect' });
      }
    } else {
      return res.status(404).json({ success: false, message: 'User does not exist' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err, success: false });
  }
};

const download = async (req, res) => {
  if (req.user.ispremiumuser) {
    try {
      const expenses = await Expense.find({ userrrId: req.user.id });
      console.log(expenses);
      const stringifyExpense = JSON.stringify(expenses);
      const userId = req.user.id;
      const filename = `Expense${userId}/${new Date()}.txt`;
      const fileurl = await s3upload.uploadToS3(stringifyExpense, filename);
      await DownloadData.create({ fileurl, userrrId: req.user.id });
      res.json({ fileurl, status: '1' });
    } catch (err) {
      console.error(err);
      res.json({ fileurl: '', status: '0' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized', status: '0' });
  }
};

module.exports = {
  signup,
  login,
  generateAccessToken,
  download,
};