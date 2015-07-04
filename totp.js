/**
 * Created by schandramouli on 6/28/15.
 */
var OTP = require('otp');
var otp_key = require('otp-key');
var gen_otp = require('./gen_otp')
function gen_secret_key(callback) {
  otp_key(function (err, key) {
    if(err){
      console.log("Sorry, couldn\'t generate OTP");
      callback(err, null);
    }
    var otp = gen_otp(key);
    console.log("This is the URL to be embedded in the QR", otp.totpURL);
    console.log("This is the secret key", otp.secret);
    //console.log("Just listing the otp object", otp)
    callback(null, otp);
  });

}

module.exports = gen_secret_key;