// Context root: /user
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var UserAccountManager = require("./lib/sec/UserAccountManager");

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

module.exports = router;