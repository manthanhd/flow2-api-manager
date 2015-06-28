// Context root: /user
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var AccountManager = require('./lib/sec/AccountManager');
var UserAccountManager = require("./lib/sec/UserAccountManager");
var UserAccountModel = require('./lib/sec/UserAccountModel');
var RoleManager = require('./lib/sec/RoleManager');
var ApiKeyManager = require('./lib/sec/ApiKeyManager');

/*router.get('/authenticate', function(req, res) {
    var sessionId = req.cookies['connect.sid'];
    res.send({authToken: sessionId});
})*/

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

router.get('/register', function (req, res) {
    req.session.csrfToken = req.csrfToken();
    res.render("user-register", {
        csrfToken: req.session.csrfToken,
        errorMessage: req.query.errorMessage,
        message: req.query.message
    });
});

function sendEmail(account, user) {
    app.mailer.send('email', {
             to: account.emailAddress, // REQUIRED. This can be a comma delimited string just like a normal email to field.
             subject: 'Welcome to API Factory', // REQUIRED.
             domainName: account.domainName,
             password: user.originalPassword
         }, function (err) {
         if (err) {
             console.log("Failed to send email to account: " + account.firstName + " " + account.lastName);
             console.log(err);
             return;
         }
     });
}

router.post('/register', function (req, res) {
    var domainName = req.body.domainNameText.trim();
    var firstName = req.body.firstName.trim();
    var lastName = req.body.lastName.trim();
    var emailAddress = req.body.emailAddress.trim();
    var confirmEmailAddress = req.body.confirmEmailAddress.trim();

    if(emailAddress.length <= 3) {
        return res.redirect("/user/register?errorMessage=Invalid email address.");
    }

    if(domainName.length <= 3) {
        return res.redirect("/user/register?errorMessage=Domain name is invalid.");
    }

    if(validateEmail(emailAddress) != true){
        return res.redirect("/user/register?errorMessage=Email address must be valid.");
    }

    if(emailAddress.length != confirmEmailAddress.length || emailAddress != confirmEmailAddress) {
        return res.redirect("/user/register?errorMessage=Email addresses must match.");
    }

    if(!domainName || domainName == "" || !firstName || firstName == "" || !lastName || lastName == "") {
        return res.redirect("/user/register?errorMessage=Domain name, first name and last name are required fields.");
    }

    var alphaNumericUnderscoreRegex = new RegExp("^[A-Za-z0-9_]+$");
    if(alphaNumericUnderscoreRegex.test(domainName) != true) {
        return res.redirect("/user/register?errorMessage=Domain name can only contain alpha-numeric characters.");
    }

    var alphaRegex = new RegExp("^[A-Za-z]+$");
    if(alphaRegex.test(firstName) != true || alphaRegex.test(lastName) != true) {
        return res.redirect("/user/register?errorMessage=First name and last name can only contain alphabets.");
    }

    var successCallback = function (account) {
        UserAccountManager.createDefaultAdminAccount(account.accountId, function(user) {
            sendEmail(account, user);
            return res.redirect("/user/login");
        });
    }

    var failureCallback = function () {
        return res.redirect("/user/register?errorMessage=Domain is already in use.");
    }

    AccountManager.createAccount(domainName, firstName, lastName, emailAddress, successCallback, failureCallback);
});

router.get('/login', function (req, res) {
    req.session.csrfToken = req.csrfToken();
    res.render("user-login", {
        csrfToken: req.session.csrfToken,
        errorMessage: req.query.errorMessage,
        message: req.query.message
    });
});

router.post('/login', function (req, res) {
    var domainName = req.body.domainName.trim();
    var username = req.body.usernameText.trim();
    var password = req.body.passwordText.trim();

    if(!domainName || domainName == "" || !username || username == "" || !password || password == "") {
        res.redirect("/user/login?errorMessage=Domain name, username and password are required fields.");
        return;
    }
    var alphaNumericUnderscoreRegex = new RegExp("^[A-Za-z0-9_]+$");
    if(alphaNumericUnderscoreRegex.test(domainName) != true) {
        res.redirect("/user/login?errorMessage=Domain name must be alpha-numeric.");
        return;
    }

    if(alphaNumericUnderscoreRegex.test(username) != true) {
        res.redirect("/user/login?errorMessage=Username must be alpha-numeric.");
        return;
    }

    var foundCallback = function (user) {
        req.session.account = user;

        if (user.hasBeenReset == true) {
            res.redirect("/user/reset");
            return;
        }

        var fwd = req.session.fwd;
        if (fwd && fwd != "") {
            req.session.fwd = undefined;
            res.redirect(fwd);
            return;
        }

        user.lastLoginDate = new Date();
        user.save(function (err, newAccount) {
            req.session.account = newAccount;
        });
        res.redirect("/");
    }

    var notFoundCallback = function () {
        res.redirect("/user/login?errorMessage=Incorrect username or password.");
    }

    UserAccountManager.validate(domainName, username, password, foundCallback, notFoundCallback);
});

router.get('/logout', function (req, res) {
    req.session.account = undefined;
    req.session.fwd = undefined;
    res.redirect('/');
});

router.get("/reset", function (req, res) {
    var account = req.session.account || req.account;
    if (account == undefined) {
        res.redirect("/user/login?errorMessage=Session timed out. Please login again.");
        return;
    }

    if (account.hasBeenReset == false) {
        res.redirect("/user/login?errorMessage=Password for this account has already been changed. Please login using your new password.");
        return;
    }

    res.render("user-reset", {username: account.username, csrfToken: req.csrfToken()});
});

router.post("/reset", function (req, res) {
    var account = req.session.account || req.account;
    if (account == undefined) {
        res.redirect("/user/login?errorMessage=Session timed out. Please login again.");
        return;
    }

    if (account.hasBeenReset == false) {
        res.redirect("/user/login?errorMessage=Password for this account has already been changed. Please login using your new password.");
        return;
    }

    if (req.body.passwordText1 == req.body.passwordText2) {
        var successCallback = function (updatedAccount) {
            req.session.account = updatedAccount;
            res.redirect("/user/login?message=Please login with your new password.");
            return;
        }

        var failureCallback = function () {
            res.render("user-reset", {
                username: account.username,
                csrfToken: req.csrfToken(),
                errorMessage: "Failed to update your password. Please try again."
            });
        }

        UserAccountManager.resetPassword(account.accountId, account.username, req.body.passwordText1, successCallback, failureCallback);
    } else {
        res.render("user-reset", {
            username: account.username,
            csrfToken: req.csrfToken(),
            errorMessage: "Passwords don't match. Please try again."
        });
    }
});

router.get("/home", function (req, res) {
    var account = req.session.account || req.account;
    if (account == undefined) {
        res.redirect("/user/login?errorMessage=Session timed out. Please login again.");
        return;
    }

    if (account == undefined) {
        res.redirect("/user/login?errorMessage=Session timed out. Please login again.");
        return;
    }

    if (account.hasBeenReset == true) {
        res.redirect("/user/login?errorMessage=Your password needs to be reset. Please login to continue.");
        return;
    }

    res.render("material-app", {account: account})
});

// APIs
//==========================================================================================================
/**
 * @api {get} /user Get all users
 * @apiName Get all users
 * @apiGroup User
 *
 * @apiError (ClientError) {json} LoginRequired The user needs to log in.
 * @apiError (ClientError) {json} AccessDeniedError The user does not have sufficient privileges to perform requested operation.
 *
 * @apiError (ServerError) {json} UserListError API factory has encountered an issue while listing users.
 *
 * @apiSuccess {Object[]} userList Array containing one or more user objects.
 * @apiSuccess {String} userList._id User index.
 * @apiSuccess {String} userList.accountId Id of the account the user belongs to.
 * @apiSuccess {Boolean} userList.hasBeenReset Indicates whether or not the user's password is scheduled to be reset.
 * @apiSuccess {Boolean} userList.isAdmin Indicates if the user is administrator.
 * @apiSuccess {Boolean} userList.isEnabled Indicates if the user's account is enabled.
 * @apiSuccess {Date} userList.lastLoginDate Date of the user's last login.
 * @apiSuccess {String} userList.username Username of the user.
 * @apiSuccess {Object[]} userList.roles List of roles the user is in. Admin users assume all roles by default.
 *
 * @apiSuccessExample Example response from a successful call:
 *     HTTP/1.1 200 OK
 *     {
            "userList": [
                {
                    "_id": "550eb24ebeebe58583aa9fbc",
                    "__v": 0,
                    "accountId": "550eb24ebeebe58583aa9fba",
                    "hasBeenReset": false,
                    "isAdmin": true,
                    "isEnabled": true,
                    "lastLoginDate": "2015-04-06T09:20:50.989Z",
                    "username": "admin",
                    "roles": [ ]
                },
                {
                    "_id": "550efb2d9590ca1100de4f43",
                    "createdBy": "admin",
                    "isEnabled": true,
                    "isAdmin": true,
                    "hasBeenReset": true,
                    "username": "mrcool",
                    "accountId": "550eb24ebeebe58583aa9fba",
                    "__v": 0,
                    "roles": [ ]
                },
                {
                    "_id": "551a8eb10cbe5f1100287eb1",
                    "createdBy": "admin",
                    "isEnabled": true,
                    "isAdmin": true,
                    "hasBeenReset": false,
                    "username": "leigh",
                    "accountId": "550eb24ebeebe58583aa9fba",
                    "__v": 0,
                    "lastLoginDate": "2015-03-31T12:10:57.496Z",
                    "roles": [ ]
                }
            ]
       }
 *
 */
router.get('/', function (req, res) {
    var account = req.session.account || req.account;
    if (!account) {
        res.status(403).send({error: "LoginRequired", errorCode: 403});
        return;
    }

    UserAccountModel.find({accountId: account.accountId}, function (err, users) {
        if (err || !users) {
            console.log("Error occured while listing users.");
            res.status(500).send({error: "UserListError", errorCode: 500});
            return;
        }

        var userList = users;
        // Strip out password.
        for (var i = 0; i < userList.length; i++) {
            userList[i].password = undefined;
        }

        res.send({userList: userList});
    });
});

/**
 * @api {get} /user/:userId Get a specific user by Id.
 * @apiName Get specific user by Id
 * @apiGroup User
 *
 * @apiParam {String} _id value of the user to fetch details of.
 *
 * @apiError (ClientError) {json} LoginRequired The user needs to log in.
 * @apiError (ClientError) {json} AccessDeniedError The user does not have sufficient privileges to perform requested operation.
 *
 * @apiError (ServerError) {json} UserListError API factory has encountered an issue while listing users.
 *
 * @apiSuccess {String} _id User index.
 * @apiSuccess {String} accountId Id of the account the user belongs to.
 * @apiSuccess {Boolean} hasBeenReset Indicates whether or not the user's password is scheduled to be reset.
 * @apiSuccess {Boolean} isAdmin Indicates if the user is administrator.
 * @apiSuccess {Boolean} isEnabled Indicates if the user's account is enabled.
 * @apiSuccess {Date} lastLoginDate Date of the user's last login.
 * @apiSuccess {String} username Username of the user.
 * @apiSuccess {Object[]} roles List of roles the user is in. Admin users assume all roles by default.
 *
 * @apiSuccessExample Example response from a successful call:
 *     HTTP/1.1 200 OK
 *     {
            "_id": "550eb24ebeebe58583aa9fbc",
            "__v": 0,
            "accountId": "550eb24ebeebe58583aa9fba",
            "hasBeenReset": false,
            "isAdmin": true,
            "isEnabled": true,
            "lastLoginDate": "2015-04-06T09:47:01.480Z",
            "username": "admin",
            "roles": [ ]
       }
 *
 */
router.get('/:userId', function (req, res) {
    var account = req.session.account || req.account;
    if (!account) {
        return res.status(403).send({error: "LoginRequired", errorCode: 403});
    }

    var userId = req.params.userId;

    UserAccountModel.findOne({accountId: account.accountId, _id: userId}, function (err, user) {
        if(req.session.account) {
            req.session.account = user;
        }

        if (err || !user) {
            return res.status(500).send({error: "UserListError", errorCode: 500});
        }

        // Strip out the password
        user.password = undefined;
        return res.send(user);
    });
});

/**
 * @api {post} /user Create user
 * @apiName Create a new user
 * @apiGroup User
 *
 * @apiParam {String} username Username of the new user.
 * @apiParam {String} password Temporary password of the new user. Upon first login, this user will be asked for a password reset.
 * @apiParam {Boolean} isAdmin Flag indicating whether or not the user is admin.
 *
 * @apiError (ClientError) {json} LoginRequired The user needs to log in.
 * @apiError (ClientError) {json} AccessDeniedError The user does not have sufficient privileges to perform requested operation.
 * @apiError (ClientError) {json} UserExistsError The user that is being created already exists. This happens when the new user that is being created has the same username as an existing user.
 *
 * @apiError (ServerError) {json} UserSaveError API factory has encountered an issue while saving user.
 *
 * @apiSuccess {String} _id User index.
 * @apiSuccess {String} accountId Id of the account the user belongs to.
 * @apiSuccess {Boolean} hasBeenReset Indicates whether or not the user's password is scheduled to be reset.
 * @apiSuccess {Boolean} isAdmin Indicates if the user is administrator.
 * @apiSuccess {Boolean} isEnabled Indicates if the user's account is enabled.
 * @apiSuccess {Date} lastLoginDate Date of the user's last login.
 * @apiSuccess {String} username Username of the user.
 * @apiSuccess {Object[]} roles List of roles the user is in. Admin users assume all roles by default.
 *
 * @apiSuccessExample Example response from a successful call:
 *     HTTP/1.1 200 OK
 *     {
            "_id": "550eb24ebeebe58583aa9fbc",
            "__v": 0,
            "accountId": "550eb24ebeebe58583aa9fba",
            "hasBeenReset": false,
            "isAdmin": true,
            "isEnabled": true,
            "lastLoginDate": "2015-04-06T09:47:01.480Z",
            "username": "admin",
            "roles": [ ]
       }
 *
 */
router.post('/', function (req, res) {
    var account = req.session.account || req.account;
    if (!account) {
        return res.status(403).send({error: "AuthenticationRequired", errorCode: 403});
    }

    var user = account;

    if (!req.body.username || req.body.username.length < 2) {
        return res.status(400).send({error: "Username is invalid."});
    }

    if (!req.body.password || req.body.password.length < 6) {
        return res.status(400).send({error: "Password is invalid. Must be at least 6 characters."});
    }

    if(req.body.isAdmin && req.body.isAdmin == false && (!req.body.basePermissions || !req.body.basePermissions.length || req.body.basePermissions.length < 1 || req.body.basePermissions.length > 12)) {
        return res.status(400).send({error: "Invalid permissions. Base permissions must be provided for non-admin users and must be between 1 and 12."});
    }

    if(req.body.basePermissions) {
        for(var i = 0; i < req.body.basePermissions.length; i++) {
            var basePermission = req.body.basePermissions[i];
            if(!basePermission || !basePermission.action || basePermission.action == "" || !basePermission.realm || basePermission.realm == "") {
                return res.status(400).send({error: "action and realm are mandatory attributes for each base permission."});
            } else if (basePermission.action != "read" && basePermission.action != "create" && basePermission.action != "update" && basePermission.action != "delete"){
                return res.status(400).send({error: "action attribute for base permission must be one of create/read/update/delete."});
            } else if (basePermission.realm != "entity" && basePermission.realm != "instance" && basePermission.realm != "user") {
                return res.status(400).send({error: "realm attribute for base permission must be one of entity/instance/user."});
            }
        }
    }

    var foundCallback = function (user) {
        return res.status(409).send({error: "UserExistsError", errorCode: 409});
    };

    var notFoundCallback = function () {
        var newUser = new UserAccountModel();
        newUser.accountId = account.accountId;
        newUser.username = req.body.username;
        newUser.password = req.body.password;
        newUser.hasBeenReset = true;
        newUser.isAdmin = (req.body.isAdmin && req.body.isAdmin == true) ? req.body.isAdmin : false;
        newUser.isEnabled = true; // All new users are enabled rightaway.
        newUser.createdBy = user.username;
        var basePermissions = [];
        for(var i = 0; i < req.body.basePermissions.length; i++) {
            var basePermission = req.body.basePermissions[i];
            basePermissions.push({action: basePermission.action, realm: basePermission.realm});
        }
        newUser.basePermissions = (req.body.isAdmin == false) ? basePermissions : [];

        newUser.save(function (err, savedUser) {
            if (err) {
                console.log("Failed to save new user.");
                console.log(err);
                return res.status(500).send({error: "UserSaveError", errorCode: 500});
            }

            return res.send(savedUser);
        });
    };

    return UserAccountManager.doesUserExist(account.accountId, req.body.username, foundCallback, notFoundCallback);

});

/**
 * @api {post} /user Modify user
 * @apiName Modify user
 * @apiGroup User
 *
 * @apiParam {Boolean} isAdmin Flag indicating whether or not the user is admin.
 * @apiParam {Boolean} hasBeenReset Flag indicating whether or not the user password has been marked for reset at next login.
 * @apiParam {Boolean} isEnabled Flag indicating whether or not the user access and login is enabled.
 *
 * @apiError (ClientError) {json} LoginRequired The user needs to log in.
 * @apiError (ClientError) {json} AccessDeniedError The user does not have sufficient privileges to perform requested operation.
 * @apiError (ClientError) {json} UserExistsError The user that is being created already exists. This happens when the new user that is being created has the same username as an existing user.
 *
 * @apiError (ServerError) {json} UserSaveError API factory has encountered an issue while saving user.
 *
 * @apiSuccess {String} _id User index.
 * @apiSuccess {String} accountId Id of the account the user belongs to.
 * @apiSuccess {Boolean} hasBeenReset Indicates whether or not the user's password is scheduled to be reset.
 * @apiSuccess {Boolean} isAdmin Indicates if the user is administrator.
 * @apiSuccess {Boolean} isEnabled Indicates if the user's account is enabled.
 * @apiSuccess {Date} lastLoginDate Date of the user's last login.
 * @apiSuccess {String} username Username of the user.
 * @apiSuccess {Object[]} roles List of roles the user is in. Admin users assume all roles by default.
 *
 * @apiSuccessExample Example response from a successful call:
 *     HTTP/1.1 200 OK
 *     {
            "_id": "550eb24ebeebe58583aa9fbc",
            "__v": 0,
            "accountId": "550eb24ebeebe58583aa9fba",
            "hasBeenReset": false,
            "isAdmin": true,
            "isEnabled": true,
            "lastLoginDate": "2015-04-06T09:47:01.480Z",
            "username": "admin",
            "roles": [ ]
       }
 *
 */
router.put('/:userId', function (req, res) {
    var account = req.session.account || req.account;
    if (!account) {
        res.status(403).send({error: "AuthenticationRequired", errorCode: 403});
        return;
    }

    var userId = req.params.userId;

    var foundCallback = function (user) {

        if(req.body.isAdmin != user.isAdmin && account.isAdmin != true) {
            return res.status(403).send({error: "AccessDeniedError", errorCode: 403});
        } else if (req.body.isAdmin != user.isAdmin) {
            if(user.createdBy == undefined) {
                return res.status(403).send({error: "AccessDeniedError", errorCode: 403});
            }

            if(req.body.isAdmin == true || req.body.isAdmin == "true") {
                user.isAdmin = true;
            } else if (req.body.isAdmin == false || req.body.isAdmin == "false") {
                user.isAdmin = false;
            }
        }

        if(req.body.hasBeenReset) {
            if(req.body.hasBeenReset == true || req.body.hasBeenReset == "true") {
                user.hasBeenReset = true;
            } else if (req.body.hasBeenReset == false || req.body.hasBeenReset == "false") {
                user.hasBeenReset = false;
            }
        }

        if(req.body.isEnabled) {
            if(req.body.isEnabled == true || req.body.isEnabled == "true") {
                user.isEnabled = true;
            } else if (req.body.isEnabled == false || req.body.isEnabled == "false") {
                user.isEnabled = false;
            }
        }

        var isBasePermissionChange = false;

        if(req.body.basePermissions) {
            var sanitisedBasePermissions = UserAccountManager.sanitiseBasePermissions(req.body.basePermissions);
            if(!sanitisedBasePermissions) {
                return res.status(400).send({error: "NewBasePermissionsAreInvalid", errorCode: 400});
            }

            // Find out which permissions were removed...
            var removedBasePermissions = [];
            for(var i = 0; i < user.basePermissions.length; i++) {
                var oldBasePermission = user.basePermissions[i];
                var found = false;
                for(var j = 0; j < sanitisedBasePermissions.length; j++) {
                    var newBasePermission = sanitisedBasePermissions[j];
                    if(oldBasePermission.action == newBasePermission.action && oldBasePermission.realm == newBasePermission.realm) {
                        found = true;
                        break;
                    }
                }

                if(found == false) {
                    removedBasePermissions.push(oldBasePermission);
                }
            }

            isBasePermissionChange = true;
            user.basePermissions = sanitisedBasePermissions;
        }

        user.save(function(err, savedUser) {
            savedUser.password = undefined;
            if(isBasePermissionChange == true) {
                return ApiKeyManager.getAllKeysForUser(savedUser._id, function(apiKeys) {
                    if(!apiKeys || apiKeys.length == 0) {
                        return res.send(savedUser);
                    }

                    console.log("Removing invalid ApiKeys... " + apiKeys.length + " total found. Checking validity...");

                    // Could be optimised...
                    for(var i = 0; i < apiKeys.length; i++) {
                        var apiKey = apiKeys[i];
                        if(apiKey.permissions) {

                            for(var j = 0; j < apiKey.permissions.length; j++) {
                                var apiKeyPermission = apiKey.permissions[j];

                                for(var k = 0; k < removedBasePermissions.length; k++) {
                                    var removedBasePermission = removedBasePermissions[k];

                                    if(apiKeyPermission.action == removedBasePermission.action && apiKeyPermission.realm == removedBasePermission.realm) {
                                        apiKey.remove(function(err) {
                                            console.log("Removed api key with base permissions: " + removedBasePermission.action + " on " + removedBasePermission.realm);
                                        });
                                    }
                                }
                            }
                        }
                    }

                    console.log("Done.");

                    return res.send(savedUser);
                });

            } else {
                return res.send(savedUser);
            }
        });

    };

    var notFoundCallback = function () {
        return res.status(404).send({error: "UserNotFoundError", errorCode: 404});
    };

    UserAccountManager.doesUserIdExist(account.accountId, userId, foundCallback, notFoundCallback);
});

/**
 * @api {delete} /user/:userId Delete user
 * @apiName Delete a user by Id
 * @apiGroup User
 *
 * @apiParam {String} userId _id of the user to be deleted.
 *
 * @apiError (ClientError) {json} LoginRequired The user needs to log in.
 * @apiError (ClientError) {json} AccessDeniedError The user does not have sufficient privileges to perform requested operation.
 *
 * @apiError (ServerError) {json} UserListError API factory has encountered an issue while listing users.
 *
 * @apiSuccess {String} status Status of the operation (OK/ERROR).
 *
 * @apiSuccessExample Example response from a successful call:
 *     HTTP/1.1 200 OK
 *     {
            "status": "OK"
       }
 *
 */
router.delete('/:id', function (req, res) {
    var account = req.session.account || req.account;
    if (!account) {
        res.status(403).send({error: "LoginRequired", errorCode: 403});
        return;
    }

    var userId = req.params.id;

    UserAccountManager.doesUserIdExist(account.accountId, userId, function(user) {
        if(user.createdBy == undefined) {
            return res.status(403).send({error: "AccessDeniedError", errorCode: 403});
        }

        user.remove();
        return res.send({status: "OK"});
    }, function(){
        return res.status(500).send({error: "UserListError", errorCode: 500});
    });
});

// New User Permissions API
// TODO: This is currently not authenticated from the parent auth module. Everyone who can create a user can create keys to any extent.
router.get('/:userId/key', function (req, res) {
    var account = req.session.account || req.account;
    if (!account) {
        return res.status(403).send({error: "AuthenticationRequired", errorCode: 403});
    }

    var userId = req.params.userId;

    ApiKeyManager.getAllKeysForUser(userId, function(keys) {
        if(!keys) {
            return res.status(404).send();
        }

        return res.send(keys);
    });
});

router.post('/:userId/key', function (req, res) {
    var account = req.session.account || req.account;
    if (!account) {
        return res.status(403).send({error: "AuthenticationRequired", errorCode: 403});
    }

    var userId = req.params.userId;
    var permissions = req.body.permissions;

    if(!permissions || !permissions.length || permissions.length == 0) {
        return res.status(400).send({error: "BadPermissions", errorCode: 400});
    }

    var allowedPermissions = [];

    if(account.isAdmin != true) {
        for (var i = 0; i < permissions.length; i++) {
            var permission = permissions[i];
            for (var j = 0; j < account.basePermissions.length; j++) {
                var basePermission = account.basePermissions[j];
                if (basePermission.action == permission.action && basePermission.realm == permission.realm) {
                    allowedPermissions.push({action: basePermission.action, realm: basePermission.realm});
                }
            }
        }
    } else {
        for(var i = 0; i < permissions.length; i++) {
            var permission = permissions[i];
            allowedPermissions.push({action: permission.action, realm: permission.realm});
        }
    }

    if(allowedPermissions.length != permissions.length) {
        return res.status(401).send({error: "PermissionGrantNotAuthorized", errorCode: 403});
    }

    var foundCallback = function(user) {

        ApiKeyManager.registerKey(user._id, permissions, function (registeredKey) {
            if (!registeredKey) {
                return res.status(500).send();
            }

            return res.send(registeredKey);
        });
    };

    var notFoundCallback = function() {
        return res.status(404).send();
    };

    return UserAccountManager.doesUserIdExist(account.accountId, userId, foundCallback, notFoundCallback);
});

router.delete('/:userId/key/:apiKey', function (req, res) {
    var account = req.session.account || req.account;
    if (!account) {
        res.status(403).send({error: "AuthenticationRequired", errorCode: 403});
        return;
    }

    var apiKey = req.params.apiKey;
    var userId = req.params.userId;

    if(!apiKey) {
        return res.status(404).send({error: "InvalidApiKeyError", errorCode: 400});
    }

    var foundCallback = function(user) {
        ApiKeyManager.deleteKey(user._id, apiKey, function(deleteStatus) {
            if(!deleteStatus) {
                return res.status(500).send();
            } else if (deleteStatus == false) {
                return res.status(403).send();
            }

            return res.status(200).send();
        });
    };

    var notFoundCallback = function() {
        return res.status(404).send();
    };

    UserAccountManager.doesUserIdExist(account.accountId, userId, foundCallback, notFoundCallback);
});

/*router.post('/:userId', function (req, res) {
    // Adds role to user
    var account = req.session.account || req.account;
    if (!account) {
        res.status(403).send({error: "LoginRequired", errorCode: 403});
        return;
    }

    if (!account.isAdmin || account.isAdmin == false) {
        res.status(403).send({error: "AccessDeniedError", errorCode: 403});
        return;
    }

    var userId = req.params.userId;
    var roleId = req.body.roleId;
    var affects = req.body.affects;

    if (!userId) {
        res.status(401).send({error: "userId is a required field.", errorCode: 401});
        return;
    }

    if (!roleId) {
        res.status(401).send({error: "roleId is a required field.", errorCode: 401});
        return;
    }

    if (!affects) {
        res.status(401).send({error: "affects is a required field.", errorCode: 401});
        return;
    }

    var userExistsCallback = function (user) {
        var roleFoundCallback = function (role) {
            user.roles.push({roleId: roleId, affects: affects});
            user.save(function (err, savedUser) {
                if (err) {
                    res.status(500).send({error: "UserSaveError", errorCode: 500});
                    return;
                }
                savedUser.password = undefined; // Strip out the password.
                res.send(savedUser);
            });
        }

        var roleNotFoundCallback = function () {
            res.status(404).send({error: "RoleNotFoundError", errorCode: 404});
        }

        RoleManager.getRoleById(roleId, roleFoundCallback, roleNotFoundCallback);

    }

    var userNotFoundCallback = function () {
        res.status(404).send({error: "UserNotFoundError", errorCode: 404});
    }

    UserAccountManager.doesUserIdExist(account.accountId, userId, userExistsCallback, userNotFoundCallback);
});

router.put('/:userId', function (req, res) {
    // Adds role to user
    var account = req.session.account || req.account;
    var userId = req.params.userId;

    if (!account) {
        res.status(403).send({error: "LoginRequired", errorCode: 403});
        return;
    }

    if (account._id != userId && ( !account.isAdmin || account.isAdmin == false )) {
        res.status(403).send({error: "AccessDeniedError", errorCode: 403});
        return;
    }


    var hasBeenReset = req.body.hasBeenReset;

    if (!userId) {
        res.status(401).send({error: "userId is a required field.", errorCode: 401});
        return;
    }

    if (!hasBeenReset) {
        res.status(401).send({error: "hasBeenReset is a required field.", errorCode: 401});
        return;
    }

    var userExistsCallback = function (user) {
        user.hasBeenReset = hasBeenReset;
        user.save(function (err, savedUser) {
            if (err) {
                res.status(500).send({error: "UserSaveError", errorCode: 500});
                return;
            }
            savedUser.password = undefined; // Strip out the password.
            res.send(savedUser);
        });
    }

    var userNotFoundCallback = function () {
        res.status(404).send({error: "UserNotFoundError", errorCode: 404});
    }

    UserAccountManager.doesUserIdExist(account.accountId, userId, userExistsCallback, userNotFoundCallback);
});

router.delete('/:userId/:roleAssignmentId', function (req, res) {
    // Unassign role from user.
    var account = req.session.account || req.account;
    if (!account) {
        res.status(403).send({error: "LoginRequired", errorCode: 403});
        return;
    }

    if (!account.isAdmin || account.isAdmin == false) {
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
        for (var i = 0; i < user.roles.length; i++) {

            if (user.roles[i]._id == roleAssignmentId) {
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
        //console.log("After:" + user.roles.length);
        //console.log(user.roles);

        user.save(function (err, savedUser) {
            if (err) {
                res.status(500).send({error: "UserSaveError", errorCode: 500});
                return;
            }
            savedUser.password = undefined; // Strip out the password as usual.
            res.send(savedUser);
        });
    });
});*/

module.exports = router;