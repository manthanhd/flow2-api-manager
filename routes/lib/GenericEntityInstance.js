var mongoose = require("mongoose");
var GenericEntityProperty = require("./GenericEntityProperty");

function GenericEntityInstance() {

};

GenericEntityInstance.instanceModelCache = {};

/**
 * getInstanceModelFromCache: Method to get model of an instance by it's Entity name from cache.
 */
GenericEntityInstance.getInstanceModelFromCache = function (entity) {
    //var entityName = entity.name || entity;
    var entityName = entity.instanceClassName;

    if (!entityName) {
        return;
    }

    var instanceModel = GenericEntityInstance.instanceModelCache[entityName];
    if (instanceModel != undefined) {
        return instanceModel;
    }

    var mongooseSchemaObject = {};
    for (var i = 0; i < entity.properties.length; i++) {
        mongooseSchemaObject[entity.properties[i].name] = GenericEntityProperty.getMongooseType(entity.properties[i].type);
    }

    var entitySchema = mongoose.Schema(mongooseSchemaObject);
    var EntityObject = mongoose.model(entityName, entitySchema, entityName);

    GenericEntityInstance.instanceModelCache[entityName] = EntityObject;
    console.log(GenericEntityInstance.instanceModelCache);
    return EntityObject;
};

/**
 * findInstanceById: Find an instance by using it's ID.
 */
GenericEntityInstance.findInstanceById = function (id, entity, foundCallback, notFoundCallback) {
    var InstanceModel = GenericEntityInstance.getInstanceModelFromCache(entity);
    if (InstanceModel == undefined) {
        notFoundCallback();
        return;
    }

    InstanceModel.findOne({
        _id: id
    }, function (err, instance) {
        if (err) {
            console.log("An error occurred while fetching instance. Provided ID was " + id);
            notFoundCallback();
            return;
        }

        foundCallback(instance);
    });
};

/**
 * findInstanceByProperty: Find an instance by querying it's property and value.
 */
GenericEntityInstance.findInstanceByProperty = function (entity, propertyName, propertyValue, foundCallback, notFoundCallback) {
    var InstanceModel = GenericEntityInstance.getInstanceModelFromCache(entity);
    if (InstanceModel == undefined) {
        notFoundCallback();
        return;
    }

    var queryObject = {};
    queryObject[propertyName] = propertyValue;
    InstanceModel.find(queryObject, function (err, instances) {
        if (err) {
            console.log("An error occurred while fetching instance. Provided property pair was " + propertyName + "=" + propertyValue);
            notFoundCallback();
            return;
        }

        foundCallback(instances);
    });
};

/**
 * listAll: Lists all instances belonging to a specified Entity.
 */
GenericEntityInstance.listAll = function (entity, foundCallback, notFoundCallback) {
    var InstanceModel = GenericEntityInstance.getInstanceModelFromCache(entity);
    if (InstanceModel == undefined) {
        notFoundCallback();
        return;
    }

    InstanceModel.find({}, function (err, instances) {
        if (err) {
            console.log("An error occurred while fetching instances.");
            notFoundCallback();
            return;
        }

        foundCallback(instances);
    });
};

/**
 * create: Allows creation of a new instance belonging to an Entity.
 */
GenericEntityInstance.create = function (entity, instance) {
    var InstanceModel = GenericEntityInstance.getInstanceModelFromCache(entity);
    if (InstanceModel == undefined) {
        return undefined;
    }

    var newInstance = new InstanceModel();

    for (var i = 0; i < entity.properties.length; i++) {
        newInstance[entity.properties[i].name] = instance[entity.properties[i].name];
    }
    newInstance.save();
    return newInstance;
};

/**
 * registerInstanceModelFromCache: Allows registering of an instance model in cache.
 */
GenericEntityInstance.registerInstanceModelFromCache = function (entityName, instanceModel) {
    if (GenericEntityInstance.getInstanceModelFromCache(entityName) == undefined) {
        GenericEntityInstance.instanceModelCache.push(instanceModel);
    }
};

/**
 * removeInstanceModelFromCache: Allows removing of an instance model from cache by it's entity name.
 */
GenericEntityInstance.removeInstanceModelFromCache = function (entityName) {
    if (GenericEntityInstance.getInstanceModelFromCache(entityName) != undefined) {
        delete GenericEntityInstance.instanceModelCache[entityName];
    }
};

/**
 *
 */
GenericEntityInstance.update = function (instance, entity, successCallback, errorCallback) {
    var foundCallback = function (existingInstance) {
        // Assuming all required fields have been validated...
        for (var i = 0; i < entity.properties.length; i++) {
            var property = entity.properties[i];
            existingInstance[property.name] = instance[property.name]; // Make properties same.
        }
        existingInstance.save();
        successCallback(existingInstance);
    }

    var notFoundCallback = function () {
        errorCallback();
    }

    GenericEntityInstance.findInstanceById(instance._id, entity, foundCallback, notFoundCallback);
}

module.exports = GenericEntityInstance;