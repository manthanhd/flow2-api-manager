// Context root: /user
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var UserAccountManager = require("./lib/sec/UserAccountManager");
var UserAccountModel = require('./lib/sec/UserAccountModel');
var AccountModel = require('./lib/sec/AccountModel');
var AccountManager = require('./lib/sec/AccountManager');
var RoleModel = require('./lib/sec/RoleModel');
var RoleManager = require('./lib/sec/RoleManager');

router.get('/', function (req, res) {
    req.session.csrfToken = req.csrfToken();
    res.render("register", {
        csrfToken: req.session.csrfToken,
        errorMessage: req.query.errorMessage,
        message: req.query.message
    });
});

router.post('/', function (req, res) {
    var successCallback = function (account) {
        console.log(account);
        //req.session.account = account;
        //
        //if (account.hasBeenReset == true) {
        //    res.redirect("/user/reset");
        //    return;
        //}
        //
        //var fwd = req.session.fwd;
        //if (fwd && fwd != "") {
        //    req.session.fwd = undefined;
        //    res.redirect(fwd);
        //    return;
        //}
        //
        //account.lastLoginDate = new Date();
        //account.save(function (err, newAccount) {
        //    req.session.account = newAccount;
        //});
        UserAccountManager.createDefaultAdminAccount(account.accountId);
        res.redirect("/");
    }

    var failureCallback = function () {
        res.redirect("/register?errorMessage=Incorrect username or password.");
    }

    AccountManager.createAccount(req.body.domainNameText, req.body.firstName, req.body.lastName, successCallback, failureCallback);
});

module.exports = router;