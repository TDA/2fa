var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();
var users = {
  store: [],
  addUser: function(uname, pass) {
    var user = {};
    user.uname = uname;
    user.pass = pass;
    this.store.push(user);
  },
  setTwoFA: function(key, data) {
    this.store[key] = data;
  },
  getUser: function(uname) {
    for(var i = 0; i < this.store.length; i++){
      console.log(this.store[i].uname, " is a user", this.store.length);
      if(this.store[i].uname.toString() == uname.toString())
        return this.store[i];
      //return {uname: '', pass:''};
    }
  }
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/users', users);


app.post('/signup', function(req, res, next){
  var uname = req.body.uname;
  var pass = req.body.pass;
  var twoFa = req.body.twoFa;
  var twoFaConfirmation;
  users.addUser(uname, pass);
  users.addUser('s', pass);
  users.addUser('f', pass);
  users.addUser('o', pass);
  console.log(users.store, "here");
  var user = users.getUser(uname);
  if (twoFa === 'on'){
    twoFaConfirmation = 'YES';
    res.render('qrcode', {uname: user.uname, pass: user.pass, twoFa: twoFaConfirmation});
  }
  else{
    twoFaConfirmation = 'NO';
    res.render('signup-success', {title:'Signup Success', uname: user.uname, pass: user.pass, twoFa: twoFaConfirmation});
  }


});

app.get('/signup', function(req, res, next){
  res.writeHead(200, {'content-type': 'text/html'});
  res.end("Sorry this document cant be GET'ed");
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
