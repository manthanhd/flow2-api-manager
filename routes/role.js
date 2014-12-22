/**
 * Created by manthanhd on 22/12/2014.
 */
//Context Root: /role
var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var RoleManager = require("./lib/sec/RoleManager");

RoleManager.init();
router.get('/', function(req, res) {
    var account = req.session.account;
    if(!account){
        res.status(403).send({error: "LoginRequired", errorCode: 403});
        return;
    }

    var successCallback = function(roles) {
        res.send({roleList: roles});
        return;
    }

    var failureCallback = function() {
        res.status(500).send({error: "RoleListError", errorCode: 500});
        return;
    }

    RoleManager.getAllRoles(successCallback, failureCallback);
});

module.exports = router;