var UserAccountModel = require('./UserAccountModel');
var AccountManager = require('./AccountManager');
var UserAccountManager = {};

UserAccountManager.createDefaultAdminAccount = function (accountId) {
    var defaultAdmin = new UserAccountModel();
    defaultAdmin.accountId = accountId;
    defaultAdmin.username = "admin";
    defaultAdmin.password = "shiny-admin!1#";
    defaultAdmin.hasBeenReset = true;
    defaultAdmin.isAdmin = true;
    defaultAdmin.isEnabled = true;
    defaultAdmin.save(function (err, savedDefaultAdmin) {
        if (err || savedDefaultAdmin == undefined) {
            console.log("Error creating default admin account for account id " + accountId + ".");
            console.log(err);
            process.exit(2);
        }

        console.log("Admin user for account Id " + accountId + ": " + savedDefaultAdmin.username + " was saved successfully.");
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
}

module.exports = UserAccountManager;