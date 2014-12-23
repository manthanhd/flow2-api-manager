//Context root: /security-home

var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

var UserAccountModel = require("./lib/sec/UserAccountModel");
var UserAccountManager = require("./lib/sec/UserAccountManager");

router.get('/', function(req, res) {
  var account = req.session.account;
  if(!account){
    req.session.fwd = "/security-manager";
    res.redirect("/user/login?message=Please login to continue");
    return;
  }
  res.cookie("XSRF-TOKEN", req.session.csrfToken);
  res.render('security-home', {csrfToken: req.session.csrfToken});
});

module.exports = router;