var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LDJ HOME', ssibal : "뭣이..중헌디?"});
});

module.exports = router;
