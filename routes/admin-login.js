var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var UserAccountManager = require("./lib/sec/UserAccountManager");

router.get('/login', function(req, res) {
  
  res.render("admin-login", { csrfToken: req.csrfToken(), errorMessage: req.query.errorMessage });
});

router.post('/login', function(req, res) {
  var foundCallback = function(account) {
    if(account.hasBeenReset == true) {
      req.session.account = account;
      res.redirect("/admin/reset");
      return;
    }
    
    res.redirect("/admin/home");
  }
  
  var notFoundCallback = function() {
    res.redirect("/admin/login?errorMessage=" + "Incorrect username or password.");
  }
  
  UserAccountManager.validate(req.body.username, req.body.password, foundCallback, notFoundCallback);
});

module.exports = router;