var mongoose = require('mongoose');
var bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  hasBeenReset: Boolean,
  isAdmin: Boolean,
  lastLoginDate: Date,
  isEnabled: Boolean,
  createdBy: String,
  roles: [ String ]
});

// Stolen from http://stackoverflow.com/questions/14588032/mongoose-password-hashing
userSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return callback(err);
    callback(undefined, isMatch);
  });
};

var userDBName = "FLOW2_Users";
var UserAccountModel = mongoose.model(userDBName, userSchema, userDBName);

module.exports = AdminAccount;