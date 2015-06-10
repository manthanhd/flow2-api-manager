var UserAccountModel = require('./UserAccountModel');
var AccountManager = require('./AccountManager');
var UserAccountManager = {};

var str = "abcdefghijklmnopqrstuvwxyz";
var lowerArray = str.split("");
var upperArray = str.toUpperCase().split("");
var numbersArray = [0,1,2,3,4,5,6,7,8,9];
var specialCharactersArray = "-=+*!$@~".split("");

var generatePassword = function() {
    var password = "";
    // All passwords are 12 characters long.
    for(var i = 0; i < 12; i++) {
        if(i < 6) {
            // lower characters
            password += lowerArray[getRandomInt(0, lowerArray.length)];
        } else if (i >= 6 && i < 8) {
            password += upperArray[getRandomInt(0, upperArray.length)];
        } else if ( i >= 8 && i < 11) {
            password += numbersArray[getRandomInt(0, numbersArray.length)];
        } else {
            password += specialCharactersArray[getRandomInt(0, specialCharactersArray.length)];
        }
    }

    return password;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

UserAccountManager.createDefaultAdminAccount = function (accountId, callback) {
    var defaultAdmin = new UserAccountModel();
    defaultAdmin.accountId = accountId;
    defaultAdmin.username = "admin";
    var password = generatePassword();
    defaultAdmin.password = password;
    defaultAdmin.hasBeenReset = true;
    defaultAdmin.isAdmin = true;
    defaultAdmin.isEnabled = true;
    defaultAdmin.save(function (err, savedDefaultAdmin) {
        if (err || savedDefaultAdmin == undefined) {
            console.log("Error creating default admin account for account id " + accountId + ".");
            console.log(err);
            process.exit(2);
        }

        savedDefaultAdmin.originalPassword = password;
        callback(savedDefaultAdmin);
    });
}

UserAccountManager.validate = function (domainName, username, password, foundCallback, notFoundCallback) {
    var accountFoundCallback = function(account) {
        UserAccountModel.findOne({accountId: account.accountId, username: username}, function (err, user) {
            if (err != undefined || user == undefined) {
                notFoundCallback();
                return;
            }
            user.comparePassword(password, function (err, isMatch) {
                if (isMatch && isMatch == true) {
                    foundCallback(user);
                } else {
                    notFoundCallback();
                }
            });
        });
    };

    var accountNotFoundCallback = function(err) {
        notFoundCallback();
    };

    AccountManager.findAccountByDomain(domainName, accountFoundCallback, accountNotFoundCallback);
}

UserAccountManager.resetPassword = function (accountId, username, newPassword, successCallback, failureCallback) {
    UserAccountModel.findOne({accountId: accountId, username: username}, function (err, account) {
        if (err != undefined || account == undefined || account.length == 0) {
            failureCallback();
            return;
        }

        account.password = newPassword;
        account.hasBeenReset = false;
        account.save(function (err, updatedAccount) {
            if (err || updatedAccount == undefined) {
                failureCallback();
                return;
            }

            successCallback(updatedAccount);
        });
    })
}

UserAccountManager.doesUserExist = function (accountId, username, foundCallback, notFoundCallback) {
    UserAccountModel.findOne({accountId: accountId, username: username}, function (err, user) {
        if (err) {
            notFoundCallback();
            return;
        }

        if (user == undefined) {
            notFoundCallback();
            return;
        }

        foundCallback(user);
    })
}

UserAccountManager.doesUserIdExist = function (accountId, id, foundCallback, notFoundCallback) {
    UserAccountModel.findOne({accountId: accountId, _id: id}, function (err, user) {
        if (err) {
            notFoundCallback();
            return;
        }

        if (user == undefined) {
            notFoundCallback();
            return;
        }

        foundCallback(user);
    })
};

UserAccountManager.getAccountFromUserId = function (userId, callback) {
    UserAccountModel.findOne({_id: userId}, function(err, user) {
        if(err) {
            console.log(err);
            return callback(undefined);
        }

        callback(user);
    })
};

UserAccountManager.hasBasePermission = function(userObject, expectedBasePermission, callback) {
    if(!userObject || !expectedBasePermission || !expectedBasePermission.action || !expectedBasePermission.realm) {
        return callback(undefined);
    }

    if(userObject.basePermissions) {
        for(var i = 0; i < userObject.basePermissions.length; i++) {
            var basePermission = userObject.basePermissions[i];
            if(basePermission.action == expectedBasePermission.action && basePermission.realm == expectedBasePermission.realm) {
                return callback(basePermission);
            }
        }
    }

    return callback(undefined);
};

module.exports = UserAccountManager;