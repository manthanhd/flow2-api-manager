// Context root: /user
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var UserAccountManager = require("./lib/sec/UserAccountManager");
var UserAccountModel = require('./lib/sec/UserAccountModel');
var RoleModel = require('./lib/sec/RoleModel');
var RoleManager = require('./lib/sec/RoleManager');

router.get('/login', function(req, res) {
  req.session.csrfToken = req.csrfToken();
  res.render("user-login", { csrfToken: req.session.csrfToken, errorMessage: req.query.errorMessage, message: req.query.message });
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
    
    account.lastLoginDate = new Date();
    account.save(function(err, newAccount) {
      req.session.account = newAccount;
    });
    res.redirect("/user/home");
  }
  
  var notFoundCallback = function() {
    res.redirect("/user/login?errorMessage=Incorrect username or password.");
  }
  
  UserAccountManager.validate(req.body.usernameText, req.body.passwordText, foundCallback, notFoundCallback);
});

router.post('/logout', function(req, res) {
  req.session.account = undefined;
  req.session.fwd = undefined;
  res.redirect('/user/login');
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

  var hasRoleCallback = function(user, userRole, role) {

    UserAccountModel.find({}, function (err, users) {
      if (err || !users) {
        console.log("Error occured while listing users.");
        res.status(500).send({error: "UserListError", errorCode: 500});
        return;
      }

      var userList = [];
      if(userRole) {

        for (var i = 0; i < users.length; i++) {
          if (RegExp(userRole.affects).test(users[i].username) == true) {
            userList.push(users[i]);
          }
        }

        // Strip out password.
        for (var i = 0; i < userList.length; i++) {
          userList[i].password = undefined;
        }
      } else {
        // We've been allowed because it's an admin account.

        userList = users;
        // Strip out password.
        for (var i = 0; i < userList.length; i++) {
          userList[i].password = undefined;
        }
      }

      res.send({userList: userList});
    });
  }

  var doesNotHaveRoleCallback = function() {
    res.status(403).send({error: "AccessDeniedError", errorCode: 403});
    return;
  }

  RoleManager.hasRole("user", "r", account._id, hasRoleCallback, doesNotHaveRoleCallback);
});

router.get('/:userId', function(req, res) {
  var account = req.session.account;
  if(!account){
    res.status(403).send({error: "LoginRequired", errorCode: 403});
    return;
  }
  var hasRoleCallback = function(user, userRole, role) {
    var userId = req.params.userId;

    UserAccountModel.findOne({_id: userId}, function (err, user) {
      if (err || !user) {
        res.status(500).send({error: "UserListError", errorCode: 500});
        return;
      }

      if(RegExp(userRole.affects).test(user.username) == true) {
        res.send(user);
        return;
      } else {
        res.status(403).send({error: "AccessDeniedError", errorCode: 403});
        return;
      }
    });
  }

  var doesNotHaveRoleCallback = function() {
    res.status(403).send({error: "AccessDeniedError", errorCode: 403});
    return;
  }

  RoleManager.hasRole("user", "r", account._id, hasRoleCallback, doesNotHaveRoleCallback);
})

router.post('/', function(req, res) {
  var account = req.session.account;
  if (!account) {
    res.status(403).send({error: "LoginRequired", errorCode: 403});
    return;
  }

  var hasRoleCallback = function(user, userRole, role) {
    if (!req.body.username) {
      res.status(401).send({error: "Username is a required field."});
      return;
    }

    if (!req.body.password) {
      res.status(401).send({error: "Password is a required field."});
      return;
    }
    var foundCallback = function (user) {
      res.status(409).send({error: "UserExistsError", errorCode: 409});
      return;
    }

    var notFoundCallback = function () {
      if (user.isAdmin != true && req.body.isAdmin == true) {
        res.status(401).send({error: "Non-admins cannot create admins."});
        return;
      }

      // For now, only admins can assign roles.
      if ((!req.body.isAdmin || req.body.isAdmin == false) && req.body.roles && req.body.roles.length > 0) {
        res.status(401).send({error: "Non-admins cannot assign roles."});
        return;
      }

      // Do a role check if user is allowed to assign roles or not.

      var newUser = new UserAccountModel();
      newUser.username = req.body.username;
      newUser.password = req.body.password;
      newUser.hasBeenReset = true;
      newUser.isAdmin = (req.body.isAdmin && req.body.isAdmin == true) ? req.body.isAdmin : false;
      newUser.isEnabled = true; // All new users are enabled rightaway.
      newUser.createdBy = user.username;

      // Do a check here to see if user is allowed to assign roles.
      newUser.roles = (req.body.isAdmin && req.body.isAdmin == true && req.body.roles) ? req.body.roles : [];

      newUser.save(function (err, savedUser) {
        if (err) {
          console.log("Failed to save new user.");
          console.log(err);
          res.status(500).send({error: "UserSaveError", errorCode: 500});
          return;
        }

        res.send(savedUser);
      });
    };
    if(user.isAdmin == true || RegExp(userRole.affects).test(req.body.username) == true) {
      UserAccountManager.doesUserExist(req.body.username, foundCallback, notFoundCallback);
    } else {
      res.status(403).send({error: "AccessDeniedError", errorCode: 403});
      return;
    }
  }

  var doesNotHaveRoleCallback = function() {
    res.status(403).send({error: "AccessDeniedError", errorCode: 403});
    return;
  }

  RoleManager.hasRole("user", "c", account._id, hasRoleCallback, doesNotHaveRoleCallback);
});

router.delete('/:id', function(req, res) {
  var account = req.session.account;
  if(!account){
    res.status(403).send({error: "LoginRequired", errorCode: 403});
    return;
  }

  var hasRoleCallback = function(loggedUser, userRole, role) {
    var userId = req.params.id;
    UserAccountModel.findOne({_id: userId}, function (err, user) {
      if (err || !user) {
        console.log("Failed to list user with ID " + userId);
        console.log(err);
        res.status(500).send({error: "UserListError", errorCode: 500});
        return;
      }

      if(loggedUser.isAdmin == true || (RegExp(userRole.affects).test(user.username) == true)) {
        user.remove();
        res.send({status: "OK"});
        return;
      } else {
        res.status(403).send({error: "AccessDeniedError", errorCode: 403});
        return;
      }
    });
  }

  var doesNotHaveRoleCallback = function() {
    res.status(403).send({error: "AccessDeniedError", errorCode: 403});
    return;
  }

  RoleManager.hasRole("user", "d", account._id, hasRoleCallback, doesNotHaveRoleCallback);
});

router.post('/:userId', function(req, res) {
  // Adds role to user
  var account = req.session.account;
  if(!account){
    res.status(403).send({error: "LoginRequired", errorCode: 403});
    return;
  }

  if(!account.isAdmin || account.isAdmin == false) {
    res.status(403).send({error: "AccessDeniedError", errorCode: 403});
    return;
  }

  var userId = req.params.userId;
  var roleId = req.body.roleId;
  var affects = req.body.affects;

  if(!userId) {
    res.status(401).send({error: "userId is a required field.", errorCode: 401});
    return;
  }

  if(!roleId) {
    res.status(401).send({error: "roleId is a required field.", errorCode: 401});
    return;
  }

  if(!affects) {
    res.status(401).send({error: "affects is a required field.", errorCode: 401});
    return;
  }

  var userExistsCallback = function(user) {
    var roleFoundCallback = function(role) {
      user.roles.push({roleId: roleId, affects: affects});
      user.save(function(err, savedUser) {
        if(err){
          res.status(500).send({error: "UserSaveError", errorCode: 500});
          return;
        }
        savedUser.password = undefined; // Strip out the password.
        res.send(savedUser);
      });
    }

    var roleNotFoundCallback = function() {
      res.status(404).send({error: "RoleNotFoundError", errorCode: 404});
    }

    RoleManager.getRoleById(roleId, roleFoundCallback, roleNotFoundCallback);

  }

  var userNotFoundCallback = function() {
    res.status(404).send({error: "UserNotFoundError", errorCode: 404});
  }

  UserAccountManager.doesUserIdExist(userId, userExistsCallback, userNotFoundCallback);
});

router.delete('/:userId/:roleAssignmentId', function(req, res) {
  // Unassign role from user.
  var account = req.session.account;
  if(!account){
    res.status(403).send({error: "LoginRequired", errorCode: 403});
    return;
  }

  if(!account.isAdmin || account.isAdmin == false) {
    res.status(403).send({error: "AccessDeniedError", errorCode: 403});
    return;
  }

  // We've been asked to delete the role relationship
  var roleAssignmentId = req.params.roleAssignmentId;
  var userId = req.params.userId;
  UserAccountModel.findOne({_id: userId}, function (err, user) {
    if (err) {
      console.log("Failed to list user with ID " + userId);
      console.log(err);
      res.status(500).send({error: "UserListError", errorCode: 500});
      return;
    }

    var removeAt = undefined;
    for(var i = 0; i < user.roles.length; i++) {
      console.log("Comparing " + user.roles[i]._id + " with " + roleAssignmentId);
      if(user.roles[i]._id == roleAssignmentId) {
        console.log("FOUND IT!!");
        user.roles.splice(i, 1);
        break;
      }
    }
    //console.log("Before:" + user.roles.length);
    //console.log(user.roles);
    //if(removeAt){
    //
    //  console.log("Spliced at " + removeAt);
    //}
    console.log("After:" + user.roles.length);
    console.log(user.roles);

    user.save(function(err, savedUser) {
      if(err) {
        res.status(500).send({error: "UserSaveError", errorCode: 500});
        return;
      }
      savedUser.password = undefined; // Strip out the password as usual.
      res.send(savedUser);
    });
  });
})

module.exports = router;