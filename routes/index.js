var mongoose = require('mongoose');
var express = require('express');

var ErrorObject = require('./lib/ErrorObject');
var modelCollection = require('./lib/ModelCollection');
var GenericEntity = require('./lib/GenericEntity');
var GenericEntityProperty = require('./lib/GenericEntityProperty');
var SavedGenericEntity = require('./lib/GenericEntityModel');
var GenericEntityInstance = require("./lib/GenericEntityInstance");
var UserAccountManager = require('./lib/sec/UserAccountManager');
var RoleManager = require('./lib/sec/RoleManager');

var properties = require("properties");
properties.parse("db.properties", {
    path: true
}, function (error, obj) {
    if (error) return console.error(error);
    var hostname = obj.hostname || "localhost";
    var port = obj.port || 27017;
    var dbname = obj.dbname || "flow2";

    var uri = "mongodb://" + hostname + ":" + port + "/" + dbname;
    var options = {};

    var dbuser = process.env.FLOW2_DBUSER;
    var dbpass = process.env.FLOW2_DBPASS;
    if (dbuser && dbpass) {
        options.user = dbuser;
        options.pass = dbpass;
    }

    mongoose.connect(uri, options, function (err, res) {
        if (err) {
            console.log("Error connecting to DB.");
            console.log(err);
        } else {
            console.log("Successfully connected to DB.");
        }
    });
});

modelCollection.add("GenericEntityModel", SavedGenericEntity);

var router = express.Router();

router.get('/material', function (req, res) {
    res.render('material-app');
})

/* GET home page. */
router.get('/', function (req, res) {
    res.cookie("XSRF-TOKEN", req.session.csrfToken);
    res.render('material-app');
});

router.get('/resetDB', function (req, res) {
    mongoose.connection.db.dropDatabase();
    res.send({
        status: 'OK'
    });
});

router.get('/EAG', function (req, res) {
    var user = req.session.account;
    if (user == undefined) {  // Require them to login
        req.session.fwd = "/EAG";
        res.redirect("/user/login?message=Please login to continue.");
        return;
    }
    res.cookie("XSRF-TOKEN", req.session.csrfToken);
    res.render("eag_home", {csrfToken: req.session.csrfToken});
});

router.get('/entity/metadata/types', function (req, res) {
    var account = req.session.account;
    if (!account) {
        res.status(403).send({error: "LoginRequired", errorCode: 403});
        return;
    }

    var userFoundCallback = function (user) {
        var hasRoleCallback = function (user, userRole, role) {
            if (userRole || (user && user.isAdmin == true)) {
                res.send({typeList: GenericEntityProperty.supportedTypes});
            } else {
                res.status(403).send({error: "AccessDeniedError", errorCode: 403});
                return;
            }
        }
        var doesNotHaveRoleCallback = function () {
            res.status(403).send({error: "AccessDeniedError", errorCode: 403});
            return;
        }

        RoleManager.hasRole(account.accountId, "entity", "c", account._id, hasRoleCallback, doesNotHaveRoleCallback);
    }

    var userNotFoundCallback = function () {
        res.status(404).send({error: "UserNotFoundError", errorCode: 404});
        return;
    }

    UserAccountManager.doesUserExist(account.accountId, account.username, userFoundCallback, userNotFoundCallback);
});

router.get('/entity', function (req, res) { // Renamed from listEntities
    var account = req.session.account;
    if (!account) {
        res.status(403).send({error: "LoginRequired", errorCode: 403});
        return;
    }

    var userFoundCallback = function (user) {
        var hasRoleCallback = function (user, userRole, role) {
            SavedGenericEntity.find({accountId: account.accountId}, function (err, result) {
                if (err) {
                    console.log("An error occurred while listing entity definitions.");
                    console.log(err);
                    res.status(30).send(ErrorObject.create("EntityDefinitionListError", 30));
                }
                console.log("has " + result.length + " for " + account.accountId);
                if (userRole) {
                    var entityList = [];
                    for (var i = 0; i < result.length; i++) {
                        if (RegExp(userRole.affects).test(result[i].name) == true) {
                            entityList.push(result[i]);
                        }
                    }
                    res.send({entityList: entityList});
                } else if (user && user.isAdmin == true) {
                    res.send({entityList: result});
                } else {
                    res.status(403).send({error: "AccessDeniedError", errorCode: 403});
                    return;
                }
            });

        }
        var doesNotHaveRoleCallback = function () {
            res.status(403).send({error: "AccessDeniedError", errorCode: 403});
            return;
        }

        RoleManager.hasRole(account.accountId, "entity", "r", account._id, hasRoleCallback, doesNotHaveRoleCallback);
    }

    var userNotFoundCallback = function () {
        res.status(404).send({error: "UserNotFoundError", errorCode: 404});
        return;
    }

    UserAccountManager.doesUserExist(account.accountId, account.username, userFoundCallback, userNotFoundCallback);
});

// Not required.
// router.get('/createEntity', function (req, res) {
//   res.render('create_entity', {
//     title: 'Express',
//     layout: 'layouts/layout'
//   });
// });

var checkEntityNameExists = function (accountId, entityName, doesNotExist, exists) {
    SavedGenericEntity.findOne({
        accountId: accountId,
        name: entityName
    }, function (err, entity) {
        if (err) {
            console.log(err);
        }

        if (entity == undefined) {
            doesNotExist();
        } else {
            exists();
        }
    });
}

router.post("/entity", function (req, res) {  // Protected at app.js level. Renamed from createEntity
    var account = req.session.account;
    if(!account || !account.accountId) {
        res.sendStatus(403);
        return;
    }
    var entityName = req.body.entityName;
    var entity = new GenericEntity(req.body.entityName);

    checkEntityNameExists(account.accountId, entityName, function () {
        if (req.property1_name != undefined) { // Probably a generic  form post
            for (var i = 1; i < Object.keys(req.body).length / 2; i++) {
                var prop = new GenericEntityProperty(req.body['property' + i + '_name'], "", req.body['property' + i + '_type'], req.body['property' + i + '_required']);
                entity.addProperty(prop);
            }
        } else { // It must be an AJAX post
            for (var i = 0; i < req.body.properties.length; i++) {
                var property = req.body.properties[i];
                if (GenericEntityProperty.isValidType(property.type) == false) {
                    res.status(422).send({
                        name: property.name,
                        type: property.type
                    });
                    return;
                }
                var prop = new GenericEntityProperty(property.name, "", property.type, property.required);
                entity.addProperty(prop);
            }
        }

        var dbGenericEntity = new SavedGenericEntity();
        dbGenericEntity.accountId = account.accountId;
        dbGenericEntity.name = entity.name;
        dbGenericEntity.instanceClassName = entity.name + account.accountId;
        dbGenericEntity.active = true;
        dbGenericEntity.properties = entity.properties;
        dbGenericEntity.save();

        res.send(entity);
    }, function () {
        res.status(409).send(ErrorObject.create("EntityExistsError", 409));
    })
});

var findEntityDefinitionById = function (accountId, entityId, found, notFound) {
    SavedGenericEntity.findOne({
        _id: new mongoose.Types.ObjectId(entityId), accountId: accountId
    }, function (err, entity) {
        if (err) {
            console.log(err);
            found();
            return;
        }

        if (entity == undefined) {
            notFound();
            return;
        }

        found(entity);
        return;
    });
};

router.get("/entity/:entityId", function (req, res) { // renamed from readEntity/:entityId
    var account = req.session.account;
    if (!account) {
        res.status(403).send({error: "LoginRequired", errorCode: 403});
        return;
    }

    var userFoundCallback = function (user) {

        var hasRoleCallback = function (user, userRole, role) {
            var entityId = req.params.entityId;

            var entityFoundCallback = function (entity) {
                if (userRole) { // User is not an Admin.

                    if (entity != undefined) {
                        var entityName = entity.name;
                        if (RegExp(userRole.affects).test(entityName) == true || user.isAdmin == true) {
                            res.send(entity);
                        } else {
                            res.status(403).send({error: "AccessDeniedError", errorCode: 403});
                            return;
                        }

                    } else {
                        res.status(500).send({error: "Internal Server Error", errorCode: 500});
                    }

                } else if (user && user.isAdmin == true) {
                    res.send(entity);
                    return;
                } else {
                    res.status(403).send({error: "AccessDeniedError", errorCode: 403});
                    return;
                }
            }

            var entityNotFoundCallback = function () {
                res.status(404).send({error: "EntityNotFoundException", errorCode: 404});
                return;
            }

            findEntityDefinitionById(account.accountId, entityId, entityFoundCallback, entityNotFoundCallback);
        }
        var doesNotHaveRoleCallback = function () {
            res.status(403).send({error: "AccessDeniedError", errorCode: 403});
            return;
        }

        RoleManager.hasRole(account.accountId, "entity", "r", account._id, hasRoleCallback, doesNotHaveRoleCallback);
    }

    var userNotFoundCallback = function () {
        res.status(404).send({error: "UserNotFoundError", errorCode: 404});
        return;
    }

    UserAccountManager.doesUserExist(account.accountId, account.username, userFoundCallback, userNotFoundCallback);
});

router.delete("/entity/:entityId", function (req, res) {  // renamed from deleteEntity/:entityId
    var account = req.session.account;
    if (!account) {
        res.status(403).send({error: "LoginRequired", errorCode: 403});
        return;
    }

    var userFoundCallback = function (user) {

        var hasRoleCallback = function (user, userRole, role) {
            var entityId = req.params.entityId;

            SavedGenericEntity.findOne({accountId: account.accountId, _id: entityId}, function (err, entity) {
                if (err) {
                    console.log(err);
                    res.send(ErrorObject.create("EntityDefinitionListError", 30));
                }

                if (entity == undefined) {
                    res.send({});
                    return;
                }
                var entityName = entity.name;
                if ((userRole && RegExp(userRole.affects).test(entity.name) == true) || user.isAdmin == true) {
                    var EntityObject = GenericEntityInstance.getInstanceModelFromCache(entityName);

                    //mongoose.connection.collections[entity.name].drop( function(err) {
                    try {
                        mongoose.connection.db.dropCollection(entityName, function (err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    } catch (err) {
                        console.log(err);
                    } finally {
                        GenericEntityInstance.instanceModelCache[entityName] = undefined;

                        entity.remove();
                        console.log("Entity deleted.");
                        res.send({
                            status: "OK",
                            description: "Entity deleted."
                        });
                    }
                } else {
                    console.log("cant match.");
                    res.status(403).send({error: "AccessDeniedError", errorCode: 403});
                    return;
                }
            });

        }
        var doesNotHaveRoleCallback = function () {
            res.status(403).send({error: "AccessDeniedError", errorCode: 403});
            return;
        }

        RoleManager.hasRole(account.accountId, "entity", "d", account._id, hasRoleCallback, doesNotHaveRoleCallback);
    }

    var userNotFoundCallback = function () {
        res.status(404).send({error: "UserNotFoundError", errorCode: 404});
        return;
    }

    UserAccountManager.doesUserExist(account.accountId, account.username, userFoundCallback, userNotFoundCallback);
});

router.get('/instance/:entityName', function(req, res) {
    var entityName = req.params.entityName;
    var account = req.session.account;
    if(!account || !account.accountId) {
        res.sendStatus(403);
        return;
    }

    SavedGenericEntity.findOne({
        accountId: account.accountId,
        name: entityName
    }, function (err, entity) {
        if (err) {
            console.log(err);
            res.send(ErrorObject.create("EntityDefinitionListError", 30));
            return;
        }

        if (entity == undefined) {
            res.status(401).send("EntityDoesNotExistError");
            return;
        }

        var foundCallback = function (instances) {
            res.send({
                instanceList: instances
            });
        };

        var notFoundCallback = function () {
            res.status(401).send("EntityDoesNotExistError1");
        };

        GenericEntityInstance.listAll(entity, foundCallback, notFoundCallback);
    });
});

router.post('/instance/:entityName', function(req, res) {
    var entityName = req.params.entityName;
    var account = req.session.account;
    if(!account || !account.accountId) {
        res.sendStatus(403);
        return;
    }
    SavedGenericEntity.findOne({
        accountId: account.accountId,
        name: entityName
    }, function (err, entity) {
        if (err) {
            console.log(err);
            res.send(ErrorObject.create("EntityDefinitionListError", 30));
            return;
        }

        if (entity == undefined) {
            res.status(401).send({
                error: "EntityDoesNotExistError",
                errorCode: 401
            });
            return;
        }

        for (var i = 0; i < entity.properties.length; i++) {
            console.log("Validating properties:");
            console.log(entity.properties);
            if (req.body[entity.properties[i].name] == undefined && entity.properties[i].required == true) {
                res.status(401).send({
                    error: entity.properties[i].name + " field is a required field.",
                    errorCode: 401
                });
                return;
            }
        }

        var newObject = {};
        for (var i = 0; i < entity.properties.length; i++) {
            newObject[entity.properties[i].name] = req.body[entity.properties[i].name];
        }

        var savedInstance = GenericEntityInstance.create(entity, newObject);
        if (savedInstance == undefined) {
            res.status(500).send({
                error: "InstanceSaveFailedError",
                errorCode: 500
            });
        } else {
            res.send(savedInstance);
        }
    });
});

router.delete('/instance/:entityName/:instanceId', function(req, res) {
    var entityName = req.params.entityName;
    var instanceId = req.params.instanceId;

    var account = req.session.account;
    if(!account || !account.accountId) {
        res.sendStatus(403);
        return;
    }

    if (instanceId == undefined || instanceId == "") {
        res.status(401).send({
            error: "MissingArgumentException",
            errorCode: 401
        });
        return;
    }

    SavedGenericEntity.findOne({
        accountId: account.accountId,
        name: entityName
    }, function (err, entity) {
        if (err) {
            console.log(err);
            res.send(ErrorObject.create("EntityDefinitionListError", 30));
            return;
        }

        if (entity == undefined) {
            res.status(401).send({
                error: "EntityDoesNotExistError",
                errorCode: 401
            });
            return;
        }

        var foundCallback = function (instance) {
            if (instance != undefined) {
                instance.remove();
                res.send({
                    status: "OK"
                });
            } else {
                res.status(404).send({
                    error: "InstanceNotFoundError",
                    errorCode: 404
                });
            }

        }

        var notFoundCallback = function () {
            res.status(404).send({
                error: "InstanceNotFoundError",
                errorCode: 404
            });
        }

        GenericEntityInstance.findInstanceById(instanceId, entity, foundCallback, notFoundCallback);
    });
});

router.delete("/instance/:entityName/:propertyName/:propertyValue", function (req, res) {
    var entityName = req.params.entityName;
    var propertyName = req.params.propertyName;
    var propertyValue = req.params.propertyValue;

    var account = req.session.account;
    if(!account || !account.accountId) {
        res.sendStatus(403);
        return;
    }

    if (entityName == undefined || entityName == "" || propertyName == undefined || propertyName == "" || propertyValue == undefined || propertyValue == "") {
        res.status(401).send({
            error: "MissingArgumentException",
            errorCode: 401
        });
        return;
    }

    SavedGenericEntity.findOne({
        accountId: account.accountId,
        name: entityName
    }, function (err, entity) {
        if (err) {
            console.log(err);
            res.send(ErrorObject.create("EntityDefinitionListError", 30));
            return;
        }

        if (entity == undefined) {
            res.status(401).send({
                error: "EntityDoesNotExistError",
                errorCode: 401
            });
            return;
        }

        var foundCallback = function (instances) {
            for (var i = 0; i < instances.length; i++) {
                instances[i].remove();
            }

            res.send({
                status: "OK"
            });
        }

        var notFoundCallback = function () {
            res.status(404).send({
                error: "InstanceNotFoundError",
                errorCode: 404,
                originalArgs: {
                    id: id
                }
            });
        }

        GenericEntityInstance.findInstanceByProperty(entity, propertyName, propertyValue, foundCallback, notFoundCallback);
    });
});

router.get('/instance/:entityName/:propertyName/:propertyValue', function (req, res) {
    var entityName = req.params.entityName;
    var account = req.session.account;
    if(!account || !account.accountId) {
        res.sendStatus(403);
        return;
    }
    var propertyName = req.params.propertyName;
    var propertyValue = req.params.propertyValue;

    SavedGenericEntity.findOne({
        name: entityName
    }, function (err, entity) {
        if (err) {
            console.log(err);
            res.send(ErrorObject.create("EntityDefinitionListError", 30));
            return;
        }

        if (entity == undefined) {
            res.status(401).send({
                error: "EntityDoesNotExistError",
                errorCode: 401
            });
            return;
        }

        // Validate the property
        var isValidProperty = undefined;
        for (var i = 0; i < entity.properties.length; i++) {
            var property = entity.properties[i];
            if (property.name == propertyName) {
                isValidProperty = true;
                break;
            }
        }

        isValidProperty = (!isValidProperty) ? (propertyName == "_id") : isValidProperty; // If invalid, check if it's _id. Else, leave it alone.

        if (!isValidProperty) {
            res.status(404).send({
                error: "InvalidPropertyError"
            });
            return;
        }

        // It's valid now. Define the callbacks and execute the final call.
        var foundCallback = function (instances) {
            res.send({
                result: instances
            });
        };

        var notFoundCallback = function () {
            res.status(404).send({
                error: "InstanceNotFound"
            });
        };

        GenericEntityInstance.findInstanceByProperty(entity, propertyName, propertyValue, foundCallback, notFoundCallback);
    });
});

router.put("/instance/:entityName", function (req, res) {
    var entityName = req.params.entityName;
    var account = req.session.account;
    if(!account || !account.accountId) {
        res.sendStatus(403);
        return;
    }
    var instance = req.body;
    if (instance == undefined || instance._id == undefined) {
        console.log("Rejected instance. Missing _id.");
        console.log(instance);
        res.status(401).send({
            error: "MissingArgumentException",
            errorCode: 401
        });
        return;
    }

    SavedGenericEntity.findOne({
        name: entityName
    }, function (err, entity) {
        if (err) {
            console.log(err);
            res.send(ErrorObject.create("EntityDefinitionListError", 30));
            return;
        }

        if (entity == undefined) {
            res.status(401).send({
                error: "EntityDoesNotExistError",
                errorCode: 401
            });
            return;
        }
        // Validate if all required fields are present.
        for (var i = 0; i < entity.properties.length; i++) {
            var property = entity.properties[i];
            if (property.required == true && instance[property.name] == undefined) {
                res.status(401).send({
                    error: property.name + " is a required property.",
                    errorCode: 401
                });
                return;
            }
        }

        var successCallback = function (updatedInstance) {
            res.send(updatedInstance);
            return;
        }

        var errorCallback = function () {
            res.status(500).send({
                error: "InstanceUpdateFailedError",
                errorCode: 500
            });
        }

        GenericEntityInstance.update(instance, entity, successCallback, errorCallback);
    });
});

module.exports = router;