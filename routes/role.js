/**
 * Created by manthanhd on 22/12/2014.
 */
//Context Root: /role
var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var RoleManager = require("./lib/sec/RoleManager");

router.get('/', function(req, res) {
    var account = req.session.account;
    if(!account){
        res.status(403).send({error: "LoginRequired", errorCode: 403});
        return;
    }
    var roleIdList = req.body.roleIdList;
    if(!roleIdList) {
        var successCallback = function (roles) {
            res.send({roleList: roles});
            return;
        }

        var failureCallback = function () {
            res.status(500).send({error: "RoleListError", errorCode: 500});
            return;
        }

        RoleManager.getAllRoles(successCallback, failureCallback);
    } else {
        // We've been asked to expand the list of IDs.
        var successCallback = function(roles) {
            res.send(roles);
        }

        var failureCallback = function() {
            res.status(500).send({error: "RoleExpandError", errorCode: 500});
        }

        RoleManager.expandIdList(roleIdList,successCallback, failureCallback);
    }
});

router.get('/:id', function(req, res) {
    var account = req.session.account;
    if(!account){
        res.status(403).send({error: "LoginRequired", errorCode: 403});
        return;
    }

    var id = req.params.id;
    var successCallback = function(role) {
        res.send(role);
        return;
    }

    var failureCallback = function() {
        res.status(500).send({error: "RoleListError", errorCode: 500});
    }

    RoleManager.getRoleById(id, successCallback, failureCallback);
});

module.exports = router;