var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')


router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/mailcheck',userController.mailcheck);
router.post('/mailtokencheck',userController.mailtokencheck);

module.exports = router;
