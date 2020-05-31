var express = require('express');
var router = express.Router();
const postController = require('../controllers/postController')
const check = require('../controllers/check')


router.use(check);
router.post('/', postController.save);
router.get('/', postController.getAll)
module.exports = router;
