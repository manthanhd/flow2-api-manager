var AccountModel = require("./AccountModel");

var AccountManager = {};

AccountManager.createAccount = function(domainName, firstName, lastName, emailAddress, successCallback, failureCallback) {
    var newAccount = new AccountModel();
    newAccount.domainName = domainName;
    newAccount.firstName = firstName;
    newAccount.lastName = lastName;
    newAccount.emailAddress = emailAddress;
    newAccount.save(function(err, savedAccount) {
        if(err || !savedAccount){
            console.log("Failed to save new account. Error: ");
            console.log(err);
            failureCallback(err);
            return;
        }

        successCallback(savedAccount);
    });
}

AccountManager.findAccountByDomain = function(domainName, foundCallback, notFoundCallback) {
    AccountModel.findOne({domainName: domainName}, function(err, account) {
        if(err || !account) {
            notFoundCallback(err);
            return;
        }

        foundCallback(account)
    })
}

AccountManager.findAccountByAccountId = function(accountId, foundCallback, notFoundCallback) {
    AccountModel.findOne({accountId: accountId}, function(err, account) {
        if(err || !account) {
            notFoundCallback(err);
            return;
        }

        foundCallback(account)
    })
};

module.exports = AccountManager;