var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// This is the required library for the QRcode
var qrCode = require('qrcode-npm');
var totp = require('./totp');
var gen_otp = require('./gen_otp');
var routes = require('./routes/index');


var app = express();
var users = {
  store: [],
  addSecret: function(uname, secret) {
    var user = this.getUser(uname);
    user.secret = secret;
  },
  addUser: function(uname, pass) {
    var user = {};
    user.uname = uname;
    user.pass = pass;
    user.secret = null;
    this.store.push(user);
  },
  getUser: function(uname) {
    for(var i = 0; i < this.store.length; i++){
      if(this.store[i].uname.toString() == uname.toString())
        return this.store[i];
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

app.post('/signup', function(req, res){
  // Get user details
  var uname = req.body.uname;
  var pass = req.body.pass;
  var twoFa = req.body.twoFa;
  var twoFaConfirmation;
  //These would be part of a DB call
  users.addUser(uname, pass);

  var user = users.getUser(uname);

  // If user checked the 2fa on, try to set it up
  if (twoFa === 'on'){
    // TOTP generation, with the callback
    totp(function (err, otp) {
      twoFaConfirmation = 'YES';
      //Another db call here to store secret, could be merged with the old one, or maybe not.
      users.addSecret(uname, otp.secret);

      //Generate the QR, with the secret
      var qr = qrCode.qrcode(10, 'M');
      qr.addData(otp.totpURL);
      qr.make();
      var imgData = qr.createImgTag(4);    // creates an <img> tag as text
      res.render('qrcode', {uname: user.uname, pass: user.pass, secret: user.secret, twoFa: twoFaConfirmation, imgData: imgData});
    });
  }
  else{
    twoFaConfirmation = 'NO';
    res.render('signup-success', {title:'Signup Success', uname: user.uname, pass: user.pass, twoFa: twoFaConfirmation, msg: ''});
  }
});

app.get('/signup', function(req, res) {
  // Not really required, i just dont like GET's to the same addresses,
  // as they will be called by default on the form in case JS is disabled
  res.writeHead(200, {'content-type': 'text/html'});
  res.end("Sorry this document cant be GET'ed");
});

app.post('/verify', function(req, res){
  var secret = req.body.secret;
  var code = req.body.code;
  var otp = gen_otp(secret);
  if(otp.totp().toString() === code.toString()){
    // the codes matched, so we were able to set this up successfully.
    res.end("true");
  }
  else{
    res.end("false");
  }
});

app.get('/verify', function(req, res){
  // Same as above
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
