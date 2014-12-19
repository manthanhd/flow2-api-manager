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
    if(err != undefined || account == undefined || account.length == 0){
      notFoundCallback();
      return;
    }
    
    foundCallback(account);
  })
}

module.exports = UserAccountManager;