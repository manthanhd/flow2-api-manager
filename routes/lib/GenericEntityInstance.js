var mongoose = require("mongoose");
var GenericEntityProperty = require("./GenericEntityProperty");

function GenericEntityInstance() {
  
};

GenericEntityInstance.instanceModelCache = {};

/**
* getInstanceModelFromCache: Method to get model of an instance by it's Entity name from cache.
*/
GenericEntityInstance.getInstanceModelFromCache = function(entity) {
  var entityName = entity.name || entity;
  console.log("Finding instance model for " + entityName);
  var instanceModel = GenericEntityInstance.instanceModelCache[entity.name];
  if(instanceModel != undefined){
    console.log("Found it!");
    return instanceModel;
  }
  
  if(!entity.name) {
    return;
  }
  console.log("Couldn't find it. Defining it.");
  var mongooseSchemaObject = {};
  for(var i = 0; i < entity.properties.length; i++){
    mongooseSchemaObject[entity.properties[i].name] = GenericEntityProperty.getMongooseType(entity.properties[i].type);
  }

  console.log("Mongoose schema object created for " + entity.name + ".");

  var entitySchema = mongoose.Schema(mongooseSchemaObject);
  var EntityObject = mongoose.model(entity.name, entitySchema, entity.name);

  GenericEntityInstance.instanceModelCache[entity.name] = EntityObject;

  return EntityObject;
};

/**
* findInstanceById: Find an instance by using it's ID.
*/
GenericEntityInstance.findInstanceById = function(id, entity, foundCallback, notFoundCallback) {
  console.log("Fetching instance model...");
  var InstanceModel = GenericEntityInstance.getInstanceModelFromCache(entity);
  if(InstanceModel == undefined){
    console.log("Couldn't find it. :(");
    notFoundCallback();
    return;
  }
  console.log("Found it!");
  InstanceModel.findOne({_id: id}, function(err, instance) {
    if(err){
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
GenericEntityInstance.findInstanceByProperty = function(entity, propertyName, propertyValue, foundCallback, notFoundCallback) {
  var InstanceModel = GenericEntityInstance.getInstanceModelFromCache(entity);
  console.log("Finding instance model.");
  if(InstanceModel == undefined){
    notFoundCallback();
    return;
  }
  
  var queryObject = {};
  queryObject[propertyName] = propertyValue;
  InstanceModel.find(queryObject, function(err, instances) {
    if(err){
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
GenericEntityInstance.listAll = function(entity, foundCallback, notFoundCallback) {
  var InstanceModel = GenericEntityInstance.getInstanceModelFromCache(entity);
  if(InstanceModel == undefined){
    notFoundCallback();
    return;
  }

  InstanceModel.find({}, function(err, instances) {
    if(err){
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
GenericEntityInstance.create = function(entity, instance) {
  console.log("Creating... Getting instance model.");
  var InstanceModel = GenericEntityInstance.getInstanceModelFromCache(entity);
  console.log("Got the model. Checking...");
  if(InstanceModel == undefined){
    return undefined;
  }
  console.log("Model validated. Proceeding...");
  
  var newInstance = new InstanceModel();
  
  for(var i = 0; i < entity.properties.length; i++){
    newInstance[entity.properties[i].name] = instance[entity.properties[i].name];
  }
  console.log("Saving...");
  newInstance.save();
  return newInstance;
};

/**
* registerInstanceModelFromCache: Allows registering of an instance model in cache.
*/
GenericEntityInstance.registerInstanceModelFromCache = function(entityName, instanceModel){
  if(GenericEntityInstance.getInstanceModelFromCache(entityName) == undefined) {
    GenericEntityInstance.instanceModelCache.push(instanceModel);
  }
};

/**
* removeInstanceModelFromCache: Allows removing of an instance model from cache by it's entity name.
*/
GenericEntityInstance.removeInstanceModelFromCache = function(entityName){
  if(GenericEntityInstance.getInstanceModelFromCache(entityName) != undefined) {
    delete GenericEntityInstance.instanceModelCache[entityName];
  }
};

module.exports = GenericEntityInstance;