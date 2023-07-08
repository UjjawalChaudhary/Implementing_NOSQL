const express = require('express');
const router = express.Router();
const userController = require('../controller/user');
const userAuthentication = require('../middleware/auth');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/download', userAuthentication.authenticate, userController.download);

module.exports = router;