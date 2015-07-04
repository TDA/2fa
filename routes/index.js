var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mozilla - 2 Factor Authentication', para: 'Firefox Accounts' });
});


router.get('/index', function(req, res, next) {
  fs.readFile('./views/index.html', function(err, content) {
    if(err){
      res.writeHead(500);
      res.end('damn');
    }
    else{
      res.writeHead(200, {'content-type': 'text/html'});
      res.end(content, { title: 'Express'});
    }
  });
});

module.exports = router;
