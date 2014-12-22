var UserAccountModel = require('./UserAccountModel');

var UserAccountManager = {};

//Initialize accounts.
UserAccountManager.init = function() {
  UserAccountModel.find({isAdmin: true}, function(err, accounts) {
    if(err) {
      console.log("Fatal error. User account manager failed to initialize.");
      process.exit(1);
    }
    
    console.log("System has " + accounts.length + " account(s).");
    
    if(accounts.length == 0) {
      console.log("User account manager did not find any admin accounts on the system.");
      console.log("Creating the default admin account for system access.");
      UserAccountManager.createDefaultAdminAccount();
      return;
    }
  });
}

UserAccountManager.createDefaultAdminAccount = function() {
  var defaultAdmin = new UserAccountModel();
  defaultAdmin.username = "admin";
  defaultAdmin.password = "shiny-admin!1#";
  defaultAdmin.hasBeenReset = true;
  defaultAdmin.isAdmin = true;
  defaultAdmin.isEnabled = true;
  defaultAdmin.save(function(err, savedDefaultAdmin) {
    if(err || savedDefaultAdmin == undefined) {
      console.log("Error creating default admin account.");
      process.exit(2);
    }
    
    console.log("Admin user: " + savedDefaultAdmin.username + " was saved successfully.");
  });
}

UserAccountManager.validate = function(username, password, foundCallback, notFoundCallback) {
  UserAccountModel.findOne({username: username}, function(err, account) {
    if(err != undefined || account == undefined){
      notFoundCallback();
      return;
    }
    account.comparePassword(password, function(err, isMatch) {
      if(isMatch && isMatch == true) {
        foundCallback(account);
      } else {
        notFoundCallback();
      }
    });
  });
}

UserAccountManager.resetPassword = function(username, newPassword, successCallback, failureCallback) {
  UserAccountModel.findOne({username: username}, function(err, account) {
    if(err != undefined || account == undefined || account.length == 0){
      failureCallback();
      return;
    }
    
    account.password = newPassword;
    account.hasBeenReset = false;
    account.save(function(err, updatedAccount){
      if(err || updatedAccount == undefined){
        failureCallback();
        return;
      }
      
      successCallback(updatedAccount);
    });
  })
}

UserAccountManager.doesUserExist = function(username, foundCallback, notFoundCallback) {
  UserAccountModel.findOne({username: username}, function(err, user) {
    if(err){
      notFoundCallback();
      return;
    }

    if(user == undefined){
      notFoundCallback();
      return;
    }

    foundCallback(user);
  })
}

UserAccountManager.doesUserIdExist = function(id, foundCallback, notFoundCallback) {
  UserAccountModel.findOne({_id: id}, function(err, user) {
    if(err){
      notFoundCallback();
      return;
    }

    if(user == undefined){
      notFoundCallback();
      return;
    }

    foundCallback(user);
  })
}

module.exports = UserAccountManager;