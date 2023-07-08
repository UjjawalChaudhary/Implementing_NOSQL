const express = require('express');
const router = express.Router();
const expenseController = require('../controller/expense');
const userAuthentication = require('../middleware/auth');

router.post('/addexpense', userAuthentication.authenticate, expenseController.addexpense);
router.get('/getexpenses', userAuthentication.authenticate, expenseController.getexpenses);
router.delete('/deleteexpense/:expenseid', userAuthentication.authenticate, expenseController.deleteexpense);

module.exports = router;