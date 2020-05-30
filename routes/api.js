var express = require('express');
var router = express.Router();
const controller = require('../auth/controller')

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/check', controller.check);
router.post('/insert', controller.insert);

module.exports = router;
