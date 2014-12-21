// Context root: /user
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var UserAccountManager = require("./lib/sec/UserAccountManager");
var UserAccountModel = require('./lib/sec/UserAccountModel');

router.get('/login', function(req, res) {
  
  res.render("user-login", { csrfToken: req.csrfToken(), errorMessage: req.query.errorMessage, message: req.query.message });
});

router.post('/login', function(req, res) {
  var foundCallback = function(account) {
    req.session.account = account;

    if(account.hasBeenReset == true) {
      res.redirect("/user/reset");
      return;
    }
    
    var fwd = req.session.fwd;
    if(fwd && fwd != ""){
      req.session.fwd = undefined;
      res.redirect(fwd);
      return;
    }
    
    res.redirect("/user/home");
  }
  
  var notFoundCallback = function() {
    res.redirect("/user/login?errorMessage=Incorrect username or password.");
  }
  
  UserAccountManager.validate(req.body.usernameText, req.body.passwordText, foundCallback, notFoundCallback);
});

router.get("/reset", function(req, res) {
  var account = req.session.account;
  if(account == undefined) {
    res.redirect("/user/login?errorMessage=Session timed out. Please login again.");
    return;
  }
  
  if(account.hasBeenReset == false) {
    res.redirect("/user/login?errorMessage=Password for this account has already been changed. Please login using your new password.");
    return;
  }
  
  res.render("user-reset", { username: account.username, csrfToken: req.csrfToken() });
});

router.post("/reset", function(req, res) {
  var account = req.session.account;
  if(account == undefined) {
    res.redirect("/user/login?errorMessage=Session timed out. Please login again.");
    return;
  }
  
  if(account.hasBeenReset == false) {
    res.redirect("/user/login?errorMessage=Password for this account has already been changed. Please login using your new password.");
    return;
  }
  
  if(req.body.passwordText1 == req.body.passwordText2) {
    var successCallback = function(updatedAccount) {
      req.session.account = updatedAccount;
      res.redirect("/user/login?message=Please login with your new password.");
      return;
    }
    
    var failureCallback = function() {
      res.render("user-reset", { username: account.username, csrfToken: req.csrfToken(), errorMessage: "Failed to update your password. Please try again." });
    }
    
    UserAccountManager.resetPassword(account.username, req.body.passwordText1, successCallback, failureCallback);
  } else {
    res.render("user-reset", { username: account.username, csrfToken: req.csrfToken(), errorMessage: "Username and password did not match." });
  }
});

router.get("/home", function(req, res) {
  var account = req.session.account;
  if(account == undefined) {
    res.redirect("/user/login?errorMessage=Session timed out. Please login again.");
    return;
  }
  
  if(account == undefined) {
    res.redirect("/user/login?errorMessage=Session timed out. Please login again.");
    return;
  }
  
  if(account.hasBeenReset == true) {
    res.redirect("/user/login?errorMessage=Your password needs to be reset. Please login to continue.");
    return;
  }
  
  res.render("user-home", { account: account })
});

// APIs
//==========================================================================================================
router.get('/', function(req, res) {
  var account = req.session.account;
  if(!account){
    res.status(403).send({error: "LoginRequired", errorCode: 403});
    return;
  }

  UserAccountModel.find({}, function(err, users) {
    if(err || !users){
      console.log("Error occured while listing users.");
      res.status(500).send({error: "UserListError", errorCode: 500});
      return;
    }
    
    // Strip out password.
    for(var i = 0; i < users.length; i++) {
      users[i].password = undefined;
    }
    
    res.send({userList: users});
  });
});

router.post('/', function(req, res) {
  var account = req.session.account;
  if(!account){
    res.status(403).send({error: "LoginRequired", errorCode: 403});
    return;
  }

  if(!req.body.username) {
    res.status(401).send({error: "Username is a required field."});
    return;
  }

  if(account.isAdmin != true && req.body.isAdmin == true) {
    res.status(401).send({error: "Non-admins cannot create admins."});
    return;
  }

  // For now, only admins can assign roles.
  if( (!req.body.isAdmin || req.body.isAdmin == false) && req.body.roles && req.body.roles.length > 0) {
    res.status(401).send({error: "Non-admins cannot assign roles."});
    return;
  }

  // Do a role check if user is allowed to assign roles or not.

  var newUser = new UserAccountModel();
  newUser.username = req.body.username;
  newUser.hasBeenReset = true;
  newUser.isAdmin = (req.body.isAdmin && req.body.isAdmin == true) ? req.body.isAdmin : false;
  newUSer.isEnabled = true; // All new users are enabled rightaway.
  newUSer.createdBy = account.username;

  // Do a check here to see if user is allowed to assign roles.
  newUser.roles = (req.body.isAdmin && req.body.isAdmin == true) ? req.body.roles : [];

  newUser.save(function(err, savedUser) {
    if(err){
      console.log("Failed to save new user.");
      console.log(err);
      res.status(500).send({error: "UserSaveError", errorCode: 500});
      return;
    }

    res.send(newUser);
  })
});

router.delete('/:id', function(req, res) {
  var account = req.session.account;
  if(!account){
    res.status(403).send({error: "LoginRequired", errorCode: 403});
    return;
  }

  if(!account.isAdmin || account.isAdmin == false) {
    res.status(403).send({error: "OperationNotPermitted", errorCode: 403});
    return;
  }

  var userId = req.params.id;
  UserAccountModel.findOne({_id: userId}, function(err, user) {
    if(err){
      console.log("Failed to list user with ID " + userId);
      console.log(err);
      res.status(500).send({error: "UserListError", errorCode: 500});
      return;
    }

    user.remove();
    res.send({status: "OK"});
  });

});

module.exports = router;