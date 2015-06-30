/**
 * Created by schandramouli on 6/28/15.
 */
var OTP = require('otp');
var otp_key = require('otp-key');
otp_key(function(err, key){
  var options = {
    name: 'moz-2fa-otp', // A name used in generating URLs
    keySize: 32, // The size of the OTP-Key (default 32)
    codeLength: 6, // The length of the code generated (default 6)
    secret: key, // The secret (either a Buffer of Base32-encoded String)
    epoch: 0, // The seconds since Unix-Epoch to use as a base for calculating the TOTP (default 0)
    timeSlice: 30 // The timeslice to use for calculating counter from time in seconds (default 30)
};
  // Most of the options can be set to defaults, so basically just need to
  // set the name and the key for our purpose. Just letting the others be there
  // in case we need something other than the default.
  var otp = OTP(options);
  console.log("OTP generated is",otp.totp());
  console.log("This is the URL to be embedded in the QR",otp.totpURL);
  console.log("This is the secret key",otp.secret);
  console.log("Just listing the otp object",otp)
});
