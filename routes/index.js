var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/aa', function(req, res, next) {
  console.log('123123123123');
  res.cookie('isVisit', 'asdasdasd', {maxAge: 60 * 1000});
  res.json({
    name: 1,
  });
});

module.exports = router;
