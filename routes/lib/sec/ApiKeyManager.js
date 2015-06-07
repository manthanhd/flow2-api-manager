/**
 * Created by manthanhd on 06/06/2015.
 */

var ApiKeyModel = require("./ApiKeyModel");
var hat = require("hat");

var ApiKeyManager = {};

ApiKeyManager.registerKey = function(userId, permissions, callback) {
    if(userId && permissions && permissions.length && permissions.length > 0) {
        var apiKey = new ApiKeyModel();
        apiKey.userId = userId;
        apiKey.apiKey = hat();
        apiKey.permissions = permissions;
        apiKey.save(function(err, savedApiKey) {
            if(err) {
                console.log(err);
                return callback(undefined);
            }

            return callback(savedApiKey);
        });
    } else {
        callback(undefined);
    }
};

ApiKeyManager.getAllKeysForUser = function(userId, callback) {
    if(userId) {
        ApiKeyModel.find({ userId: userId },function(err, apiKeys) {
            if(err) {
                console.log(err);
                return callback(undefined);
            }

            callback(apiKeys);
        });
    } else {
        callback(undefined);
    }
};

ApiKeyManager.doesKeyExistForUser = function(userId, apiKey, callback) {
    if(userId && apiKey) {
        ApiKeyModel.findOne({userId: userId, apiKey: apiKey}, function(err, foundApiKey) {
            if(err) {
                console.log(err);
                return callback(undefined);
            }

            callback(foundApiKey);
        });
    } else {
        return callback(undefined);
    }
};

ApiKeyManager.deleteKey = function(userId, apiKey, callback) {
    if(userId && apiKey) {
        ApiKeyModel.findOneAndRemove({userId: userId, apiKey: apiKey}, function(err) {
            if(err) {
                console.log(err);
                return callback(undefined);
            }

            return callback(true);
        });
    }
};

ApiKeyManager.hasActionPermissionsInRealm = function(apiKey, action, realm, callback) {
    ApiKeyModel.findOne({apiKey: apiKey}, function(err, apiKeyObject) {
        if(err) {
            console.log(err);
            return callback(undefined);
        }

        var permissions = apiKeyObject.permissions;
        for(var i = 0; i < permissions.length; i++) {
            var permission = permissions[i];
            if(permission.action == action && permission.realm == realm) {
                return callback(true, permission, apiKeyObject);
            }
        }

        return callback(false);
    });
};


//ApiKeyManager.hasPermissions = function(apiKey, action, realm, actionableObject, callback) {
//    ApiKeyModel.findOne({apiKey: apiKey}, function(err, apiKeyObject) {
//        if(err) {
//            console.log(err);
//            return callback(undefined);
//        }
//
//        var permissions = apiKeyObject.permissions;
//        for(var i = 0; i < permissions.length; i++) {
//            var permission = permissions[i];
//            if(permission.action == action && permission.actionableObject == actionableObject && permission.realm == realm) {
//                return callback(true);
//            }
//        }
//
//        return callback(false);
//    });
//};

module.exports = ApiKeyManager;