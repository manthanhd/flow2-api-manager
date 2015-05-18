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

var reservedKeys = Object.keys(mongoose.Schema.reserved);
reservedKeys.push("_id","__v","admin");

var isReserved = function(value) {
    var trimmedValue = value.trim();
    if(reservedKeys.indexOf(trimmedValue) === -1) {
        return false;
    }

    return true;
};

modelCollection.add("GenericEntityModel", SavedGenericEntity);

var router = express.Router();

router.get('/material', function (req, res) {
    res.render('material-app');
});

router.get('/index', function (req, res) {
    res.render('index');
});

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

router.get('/entity/metadata/reserved', function (req, res) {
    var account = req.session.account;
    if (!account) {
        res.status(403).send({error: "LoginRequired", errorCode: 403});
        return;
    }

    var userFoundCallback = function (user) {
        var hasRoleCallback = function (user, userRole, role) {
            if (userRole || (user && user.isAdmin == true)) {
                res.send({reservedList: reservedKeys});
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

/**
 * @api {get} /entity Get all entities
 * @apiName Get Entities
 * @apiGroup Entity
 *
 * @apiError (ClientError) {json} LoginRequired The user needs to log in.
 * @apiError (ClientError) {json} AccessDeniedError The user does not have sufficient privileges to perform operation.
 * @apiError (ClientError) {json} UserNotFoundError User trying to access API was not found.
 *
 * @apiError (ServerError) {json} EntityDefinitionListError API factory has encountered an issue while listing entities.
 *
 * @apiSuccess {Object[]} entityList Array containing zero or more entity objects.
 * @apiSuccess {Boolean} entityList.active Indicates whether or not the entity is active.
 * @apiSuccess {String} entityList.instanceClassName Internal reference to instance. To be used for bug tracking or debugging.
 * @apiSuccess {String} entityList.name Name of the entity.
 * @apiSuccess {Number} entityList.accountId Id of the account the entity belongs to.
 * @apiSuccess {String} entityList._id Entity index.
 * @apiSuccess {Object[]} entityList.properties Properties of the entity.
 * @apiSuccess {String} entityList.properties.name Name of the property.
 * @apiSuccess {String} entityList.properties.value Default value of the property.
 * @apiSuccess {String} entityList.properties.type Data type of the property.
 * @apiSuccess {String} entityList.properties._id Property index.
 *
 * @apiSuccessExample Example response from a successful call:
 *     HTTP/1.1 200 OK
 *     {
            "entityList": [
                {
                    "active": true,
                    "instanceClassName": "jet5505ed96c31d628c5f4a76f5",
                    "name": "jet",
                    "accountId": "5505ed96c31d628c5f4a76f5",
                    "_id": "5505ede9c31d628c5f4a76fd",
                    "__v": 0,
                    "properties": [
                        {
                            "name": "wings",
                            "value": "",
                            "type": "number",
                            "_id": "5505ede9c31d628c5f4a76fe"
                        }
                    ]
                },
                {
                    "active": true,
                    "instanceClassName": "stocklib5505ed96c31d628c5f4a76f5",
                    "name": "stocklib",
                    "accountId": "5505ed96c31d628c5f4a76f5",
                    "_id": "550ef91fd280172590625f27",
                    "__v": 0,
                    "properties": [
                        {
                            "name": "itemName",
                            "value": "",
                            "type": "string",
                            "_id": "550ef91fd280172590625f2a"
                        },
                        {
                            "name": "stockDate",
                            "value": "",
                            "type": "date",
                            "required": true,
                            "_id": "550ef91fd280172590625f29"
                        },
                        {
                            "name": "itemCount",
                            "value": "",
                            "type": "number",
                            "required": true,
                            "_id": "550ef91fd280172590625f28"
                        }
                    ]
                }
            ]
        }
 *
 */
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

/**
 * @api {post} /entity Create a new entity
 * @apiName Create Entity
 * @apiGroup Entity
 *
 * @apiError (ClientError) {json} LoginRequired The user needs to log in.
 * @apiError (ClientError) {json} AccessDeniedError The user does not have sufficient privileges to perform operation.
 * @apiError (ClientError) {json} UserNotFoundError User trying to access API was not found.
 * @apiError (ClientError) {json} EntityExistsError User trying to create an entity with a name that already exists.
 *
 * @apiError (ServerError) {json} EntityDefinitionListError API factory has encountered an issue while listing entities.

 * @apiParam {Object[]} entityList Array containing zero or more entity objects.
 * @apiParam {Boolean} [entityList.active] Indicates whether or not the entity is active.
 * @apiParam {String} entityList.name Name of the entity.
 * @apiParam {Object[]} entityList.properties Properties of the entity.
 * @apiParam {String} entityList.properties.name Name of the property.
 * @apiParam {String} entityList.properties.value Default value of the property.
 * @apiParam {String} entityList.properties.type Data type of the property.
 *
 * @apiSuccessExample Example response from a successful call:
 *  HTTP/1.1 200 OK
    {
        "active": true,
        "instanceClassName": "jet5505ed96c31d628c5f4a76f5",
        "name": "jet",
        "accountId": "5505ed96c31d628c5f4a76f5",
        "_id": "5505ede9c31d628c5f4a76fd",
        "__v": 0,
        "properties": [
            {
                "name": "wings",
                "value": "",
                "type": "number",
                "_id": "5505ede9c31d628c5f4a76fe"
            }
        ]
    }
 *
 */
router.post("/entity", function (req, res) {  // Protected at app.js level. Renamed from createEntity
    var account = req.session.account;
    if (!account || !account.accountId) {
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
        dbGenericEntity.active = true;
        dbGenericEntity.properties = entity.properties;
        dbGenericEntity.save();
        dbGenericEntity.instanceClassName = entity.name + dbGenericEntity._id;
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

/**
 * @api {get} /entity/:id Get a specific entity by it's ID.
 * @apiName Get entity by ID.
 * @apiGroup Entity
 *
 * @apiError (ClientError) {json} LoginRequired The user needs to log in.
 * @apiError (ClientError) {json} AccessDeniedError The user does not have sufficient privileges to perform operation.
 * @apiError (ClientError) {json} UserNotFoundError User trying to access API was not found.
 * @apiError (ClientError) {json} EntityExistsError User trying to create an entity with a name that already exists.
 *
 * @apiError (ServerError) {json} EntityNotFoundError API factory cannot find specified entity.
 *
 * @apiParam {String} id Index (id) of entity to get.
 *
 * @apiSuccess {Boolean} active Indicates whether or not the entity is active.
 * @apiSuccess {String} instanceClassName Internal reference to instance. To be used for bug tracking or debugging.
 * @apiSuccess {String} name Name of the entity.
 * @apiSuccess {Number} accountId Id of the account the entity belongs to.
 * @apiSuccess {String} _id Entity index.
 * @apiSuccess {Object[]} properties Properties of the entity.
 * @apiSuccess {String} properties.name Name of the property.
 * @apiSuccess {String} properties.value Default value of the property.
 * @apiSuccess {String} properties.type Data type of the property.
 * @apiSuccess {String} properties._id Property index.
 *
 * @apiSuccessExample Example response from a successful call:
 *  HTTP/1.1 200 OK
    {
        "active": true,
        "instanceClassName": "jet5505ed96c31d628c5f4a76f5",
        "name": "jet",
        "accountId": "5505ed96c31d628c5f4a76f5",
        "_id": "5505ede9c31d628c5f4a76fd",
        "__v": 0,
        "properties": [
            {
                "name": "wings",
                "value": "",
                "type": "number",
                "_id": "5505ede9c31d628c5f4a76fe"
            }
        ]
    }
 *
 */
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

/**
 * @api {put} /entity/:entityId Modify entity metadata
 * @apiName Modify Entity
 * @apiGroup Entity
 *
 * @apiError (ClientError) {json} LoginRequired The user needs to log in.
 * @apiError (ClientError) {json} AccessDeniedError The user does not have sufficient privileges to perform operation.
 * @apiError (ClientError) {json} UserNotFoundError User trying to access API was not found.
 * @apiError (ClientError) {json} EntityExistsError User trying to create an entity with a name that already exists.
 *
 * @apiError (ServerError) {json} EntityDefinitionListError API factory has encountered an issue while fetching requested entity.

 * @apiParam {String} entityId Index (id) of entity to delete.
 * @apiParam {Boolean} [active] Indicates whether or not the entity is active.
 *
 * @apiSuccessExample Example response from a successful call:
 *  HTTP/1.1 200 OK
 {
     "active": true,
     "instanceClassName": "jet5505ed96c31d628c5f4a76f5",
     "name": "jet",
     "accountId": "5505ed96c31d628c5f4a76f5",
     "_id": "5505ede9c31d628c5f4a76fd",
     "__v": 0,
     "properties": [
         {
             "name": "wings",
             "value": "",
             "type": "number",
             "_id": "5505ede9c31d628c5f4a76fe"
         }
     ]
 }
 *
 */
router.put("/entity/:entityId", function (req, res) {  // Protected at app.js level. Renamed from createEntity
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

                if ((userRole && RegExp(userRole.affects).test(entity.name) == true) || user.isAdmin == true) {

                    if(req.body.active == true || req.body.active == "true") {
                        entity.active = true;
                    } else if (req.body.active == false || req.body.active == "false") {
                        entity.active = false;
                    }

                    entity.save();
                    res.send(entity);
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

        RoleManager.hasRole(account.accountId, "entity", "d", account._id, hasRoleCallback, doesNotHaveRoleCallback);
    }

    var userNotFoundCallback = function () {
        res.status(404).send({error: "UserNotFoundError", errorCode: 404});
        return;
    }

    UserAccountManager.doesUserExist(account.accountId, account.username, userFoundCallback, userNotFoundCallback);
});

/**
 * @api {delete} /entity/:id Delete a specific entity by it's ID.
 * @apiName Delete entity by ID.
 * @apiGroup Entity
 *
 * * @apiError (ClientError) {json} LoginRequired The user needs to log in.
 * @apiError (ClientError) {json} AccessDeniedError The user does not have sufficient privileges to perform operation.
 * @apiError (ClientError) {json} UserNotFoundError User trying to access API was not found.
 * @apiError (ClientError) {json} EntityExistsError User trying to create an entity with a name that already exists.
 *
 * @apiError (ServerError) {json} EntityDefinitionListError API factory has encountered an issue while listing entities.
 *
 * @apiParam {String} id Index (id) of entity to delete.
 *
 * @apiSuccess {String} status Status of the delete operation (OK/ERROR).
 * @apiSuccess {String} description Human readable description of the status.
 *
 * @apiSuccessExample Example response from a successful call:
 *  HTTP/1.1 200 OK
 {
     "status": "OK",
     "description": "Entity deleted."
 }
 *
 */
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

/**
 * @api {get} /instance/:entityName Get all instances for specified entity.
 * @apiName Get instances for an entity.
 * @apiGroup Instance
 *
 * @apiError (ClientError) {json} LoginRequired The user needs to log in.
 * @apiError (ClientError) {json} AccessDeniedError The user does not have sufficient privileges to perform operation.
 * @apiError (ClientError) {json} UserNotFoundError User trying to access API was not found.
 * @apiError (ClientError) {json} EntityDoesNotExistError User trying to list instances of an entity that does not exist.
 *
 * @apiError (ServerError) {json} EntityDefinitionListError API factory has encountered an issue while listing entities.
 *
 * @apiParam {String} entityName Name of the entity to fetch instances of.
 *
 * @apiSuccess {Object[]} instanceList Array containing instance objects. Structure here is defined by properties specified in the entity definition.
 *
 * @apiSuccessExample Example response from a successful call:
 *  HTTP/1.1 200 OK
 {
    "instanceList": [
        {
            "wings": 2,
            "_id": "5505f047187e81286385956b",
            "__v": 0
        },
        {
            "wings": 4,
            "_id": "5505f04c187e81286385956c",
            "__v": 0
        }
    ]
 }
 *
 */
router.get('/instance/:entityName', function (req, res) {
    var entityName = req.params.entityName;
    var account = req.session.account;
    if (!account || !account.accountId) {
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

        if(entity.active == false) {
            res.status(403).send("EntityNotActiveError");
            return;
        }

        var foundCallback = function (instances) {
            res.send({
                instanceList: instances
            });
        };

        var notFoundCallback = function () {
            res.status(401).send("EntityDoesNotExistError");
        };

        GenericEntityInstance.listAll(entity, foundCallback, notFoundCallback);
    });
});

/**
 * @api {post} /instance/:entityName Create an instance of the specified entity.
 * @apiName Create instance.
 * @apiGroup Instance
 *
 * @apiError (ClientError) {json} LoginRequired The user needs to log in.
 * @apiError (ClientError) {json} AccessDeniedError The user does not have sufficient privileges to perform operation.
 * @apiError (ClientError) {json} UserNotFoundError User trying to access API was not found.
 * @apiError (ClientError) {json} EntityDoesNotExistError User trying to list instances of an entity that does not exist.
 *
 * @apiError (ServerError) {json} EntityDefinitionListError API factory has encountered an issue while listing entities.
 *
 * @apiParam {String} entityName Name of the entity to create instance of.
 *
 * @apiSuccess {Object} object Request object containing additional _id field of your newly created instance.
 *
 * @apiSuccessExample Example response from a successful call:
 *  HTTP/1.1 200 OK
 {
    "wings": 200,
    "_id": "551dd3d42860e830d3fd3754"
}
 *
 */
router.post('/instance/:entityName', function (req, res) {
    var entityName = req.params.entityName;
    var account = req.session.account;
    if (!account || !account.accountId) {
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

        if(entity.active == false) {
            res.status(403).send("EntityNotActiveError");
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

/**
 * @api {delete} /instance/:entityName/:instanceId Delete a specific instance of an entity by it's ID.
 * @apiName Delete instance by ID.
 * @apiGroup Instance
 *
 * @apiError (ClientError) {json} LoginRequired The user needs to log in.
 * @apiError (ClientError) {json} AccessDeniedError The user does not have sufficient privileges to perform operation.
 * @apiError (ClientError) {json} UserNotFoundError User trying to access API was not found.
 * @apiError (ClientError) {json} EntityDoesNotExistError User trying to list instances of an entity that does not exist.
 * @apiError (ClientError) {json} InstanceNotFoundError User trying to list an instance that does not exist.
 *
 * @apiError (ServerError) {json} EntityDefinitionListError API factory has encountered an issue while listing entities.
 *
 * @apiParam {String} entityName Name of the entity.
 * @apiParam {String} instanceId ID of the instance to delete.
 *
 * @apiSuccess {String} status Status of the delete operation (OK/ERROR).
 *
 * @apiSuccessExample Example response from a successful call:
 *  HTTP/1.1 200 OK
 {
    "status": "OK"
}
 *
 */
router.delete('/instance/:entityName/:instanceId', function (req, res) {
    var entityName = req.params.entityName;
    var instanceId = req.params.instanceId;

    var account = req.session.account;
    if (!account || !account.accountId) {
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

        if(entity.active == false) {
            res.status(403).send("EntityNotActiveError");
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

/**
 * @api {delete} /instance/:entityName/:propertyName/:propertyValue Delete instances matching a specific property and value.
 * @apiName Delete instance by property and value.
 * @apiGroup Instance
 *
 * @apiError (ClientError) {json} LoginRequired The user needs to log in.
 * @apiError (ClientError) {json} AccessDeniedError The user does not have sufficient privileges to perform operation.
 * @apiError (ClientError) {json} UserNotFoundError User trying to access API was not found.
 * @apiError (ClientError) {json} EntityDoesNotExistError User trying to list instances of an entity that does not exist.
 * @apiError (ClientError) {json} InstanceNotFoundError User trying to list an instance that does not exist.
 *
 * @apiError (ServerError) {json} EntityDefinitionListError API factory has encountered an issue while listing entities.
 *
 * @apiParam {String} entityName Name of the entity.
 * @apiParam {String} propertyName Name of the property to search. Must be defined in the entity.
 * @apiParam {String} propertyValue Value of the property.
 *
 * @apiSuccess {String} status Status of the delete operation (OK/ERROR).
 *
 * @apiSuccessExample Example response from a successful call:
 *  HTTP/1.1 200 OK
 {
    "status": "OK"
}
 *
 */
router.delete("/instance/:entityName/:propertyName/:propertyValue", function (req, res) {
    var entityName = req.params.entityName;
    var propertyName = req.params.propertyName;
    var propertyValue = req.params.propertyValue;

    var account = req.session.account;
    if (!account || !account.accountId) {
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

        if(entity.active == false) {
            res.status(403).send("EntityNotActiveError");
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

/**
 * @api {get} /instance/:entityName/:propertyName/:propertyValue Get all instances for specified entity matching given property and value.
 * @apiName Get instances for an entity matching given property and value.
 * @apiGroup Instance
 *
 * @apiError (ClientError) {json} LoginRequired The user needs to log in.
 * @apiError (ClientError) {json} AccessDeniedError The user does not have sufficient privileges to perform operation.
 * @apiError (ClientError) {json} UserNotFoundError User trying to access API was not found.
 * @apiError (ClientError) {json} EntityDoesNotExistError User trying to list instances of an entity that does not exist.
 * @apiError (ClientError) {json} InstanceNotFoundError User trying to list an instance that does not exist.
 * @apiError (ClientError) {json} InvalidPropertyError User trying to search instances by a property that does not exist.
 *
 * @apiError (ServerError) {json} EntityDefinitionListError API factory has encountered an issue while listing entities.
 *
 * @apiParam {String} entityName Name of the entity to fetch instances of.
 * @apiParam {String} propertyName Name of the property to search.
 * @apiParam {String} propertyValue Value of the specified property.
 *
 * @apiSuccess {Object[]} instanceList Array containing instance objects. Structure here is defined by properties specified in the entity definition.
 *
 * @apiSuccessExample Example response from a successful call:
 *  HTTP/1.1 200 OK
 {
    "instanceList": [
        {
            "wings": 2,
            "_id": "5505f047187e81286385956b",
            "__v": 0
        },
        {
            "wings": 4,
            "_id": "5505f04c187e81286385956c",
            "__v": 0
        }
    ]
 }
 *
 */
router.get('/instance/:entityName/:propertyName/:propertyValue', function (req, res) {
    var entityName = req.params.entityName;
    var account = req.session.account;
    if (!account || !account.accountId) {
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

        if(entity.active == false) {
            res.status(403).send("EntityNotActiveError");
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

/**
 * @api {put} /instance/:entityName Update a specific instance of an entity.
 * @apiName Update instance.
 * @apiGroup Instance
 *
 * @apiError (ClientError) {json} LoginRequired The user needs to log in.
 * @apiError (ClientError) {json} AccessDeniedError The user does not have sufficient privileges to perform operation.
 * @apiError (ClientError) {json} UserNotFoundError User trying to access API was not found.
 * @apiError (ClientError) {json} EntityDoesNotExistError User trying to list instances of an entity that does not exist.
 * @apiError (ClientError) {json} InstanceNotFoundError User trying to list an instance that does not exist.
 * @apiError (ClientError) {json} InvalidPropertyError User trying to search instances by a property that does not exist.
 * @apiError (ClientError) {json} MissingArgumentException One or more required fields are missing.
 *
 * @apiError (ServerError) {json} EntityDefinitionListError API factory has encountered an issue while listing entities.
 * @apiError (ServerError) {json} InstanceUpdateFailedError Failure was encountered while updating instance.
 *
 * @apiParam {String} entityName Name of the entity to update instance of.
 *
 * @apiSuccess {Object} object Updated instance object.
 *
 * @apiSuccessExample Example response from a successful call:
 *  HTTP/1.1 200 OK
 {
    "wings": 425,
    "_id": "551dd3d42860e830d3fd3754"
}
 *
 */
router.put("/instance/:entityName", function (req, res) {
    var entityName = req.params.entityName;
    var account = req.session.account;
    if (!account || !account.accountId) {
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

        if(entity.active == false) {
            res.status(403).send("EntityNotActiveError");
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