var mongoose = require('mongoose');

var ErrorObject = require('./lib/ErrorObject');
var modelCollection = require('./lib/ModelCollection');
var GenericEntity = require('./lib/GenericEntity');
var GenericEntityProperty = require('./lib/GenericEntityProperty');
var SavedGenericEntity = require('./lib/GenericEntityModel');
var GenericEntityInstance = require("./lib/GenericEntityInstance");

var properties = require("properties");
properties.parse ("db.properties", { path: true }, function (error, obj){
  if (error) return console.error (error);
  var hostname = obj.hostname || "localhost";
  var port = obj.port || 27017;
  var dbname = obj.dbname || "flow2";
  
  var uri = "mongodb://" + hostname + ":" + port + "/" + dbname;
  var options = {};
  
  var dbuser = process.env.FLOW2_DBUSER;
  var dbpass = process.env.FLOW2_DBPASS;
  if(dbuser && dbpass){
    options.user = dbuser;
    options.pass = dbpass;
  }
  
  mongoose.connect(uri, options, function(err, res) {
      if(err) {
          console.log("Error connecting to DB.");
      } else {
          console.log("Successfully connected to DB.");
      }
  });
});

modelCollection.add("GenericEntityModel", SavedGenericEntity);

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express', layout: 'layouts/layout' });
});

router.get('/resetDB', function(req, res){
    mongoose.connection.db.dropDatabase();
    res.send({status: 'OK'});
});

router.get('/EAG', function(req, res){

    res.render("eag_home");
});

router.get('/listEntities', function(req, res){
  SavedGenericEntity.find({}, function(err, result){
    if(err){
      console.log("An error occurred while listing entity definitions.");
      console.log(err);
      res.status(30).send(ErrorObject.create("EntityDefinitionListError", 30));
    }
    res.send({entityList: result});
  });
});

router.get('/createEntity', function(req, res) {
  res.render('create_entity', { title: 'Express', layout: 'layouts/layout' });
});

var checkEntityNameExists = function(entityName, doesNotExist, exists) {
  SavedGenericEntity.findOne({name: entityName}, function(err, entity) {
    if(err){
      console.log(err);
    }

    if(entity == undefined){
      doesNotExist();
    } else {
      exists();
    }
  });
}

router.post("/createEntity", function(req, res) {
  var entityName = req.body.entityName;
  var entity = new GenericEntity(req.body.entityName);
  
  checkEntityNameExists(entityName, function(){
    if(req.property1_name != undefined){  // Probably a form post
      for(var i = 1; i < Object.keys(req.body).length / 2; i++){
          var prop = new GenericEntityProperty(req.body['property' + i + '_name'], "", req.body['property' + i + '_type']);
          entity.addProperty(prop);
      }
    } else {  // It must be an AJAX post
      for(var i = 0; i < req.body.properties.length; i++){
        var property = req.body.properties[i];
        if(GenericEntityProperty.isValidType(property.type) == false){
          res.status(422).send({name: property.name, type: property.type});
          return;
        }
        var prop = new GenericEntityProperty(property.name, "", property.type);
        entity.addProperty(prop);
      }
    }

    console.log(entity.name + "entity has been created.");
    console.log(entity);

    var dbGenericEntity = new SavedGenericEntity();
    dbGenericEntity.name = entity.name;
    dbGenericEntity.active = true;
    dbGenericEntity.properties = entity.properties;
    dbGenericEntity.save();

    webbifyEntity(entity);
    res.send(entity);
  }, function(){
    res.status(409).send(ErrorObject.create("EntityExistsError", 409));
  })
});

var findEntityDefinitionById = function(entityId, found, notFound){
  SavedGenericEntity.findOne({_id: new mongoose.Types.ObjectId(entityId)}, function(err, entity) {
    if(err){
      console.log(err);
      found();
      return;
    }
    
    if(entity == undefined){
      notFound();
      return;
    }
    
    found(entity);
    return;
  });
};

router.get("/readEntity/:entityId", function(req, res){
  var entityId = req.params.entityId;
  findEntityDefinitionById(entityId, function(entity){
    if(entity != undefined)
      res.send(entity);
    else
      res.status(500).send("Internal Server Error");
  }, function(){
    res.status(401).send("EntityNotFoundException");
  });
});

router.get("/deleteEntity/:entityId", function(req, res){
  var entityId = req.params.entityId;
  
  SavedGenericEntity.findOne({_id: new mongoose.Types.ObjectId(entityId)}, function(err, entity){
    if(err){
      console.log(err);
      res.send(ErrorObject.create("EntityDefinitionListError", 30));
    }
    
    if(entity == undefined){
      res.send({});
      return;
    }
    
    var entityName = entity.name;
    var EntityObject = GenericEntityInstance.getInstanceModelFromCache(entityName);

    //mongoose.connection.collections[entity.name].drop( function(err) {
    mongoose.connection.db.dropCollection(entityName, function(err){
      if(err){
        console.log(err);
      }
      
      delete entityObjectModels[entityName];  // Removing from our cache of object schemas.
      entity.remove();
      console.log("Entity deleted.");
      res.send({ status: "OK", description: "Entity deleted." });
    });
  });
});

var webbifyEntity = function(entity){
  
  router.get('/EAG/access/' + entity.name + '/list', function(req, res){
    SavedGenericEntity.findOne({name: entity.name}, function(err, result){
      if(err){
        console.log(err);
        res.send(ErrorObject.create("EntityDefinitionListError", 30));
        return;
      }
      
      if(result == undefined){
        res.status(401).send("EntityDoesNotExistError");
        return;
      }
      
      var foundCallback = function(instances){
        res.send({ instanceList: instances });
      };
      
      var notFoundCallback = function(){
        res.status(401).send("EntityDoesNotExistError");
      };
      
      GenericEntityInstance.listAll(entity, foundCallback, notFoundCallback);
    });
    
  });

  router.post("/EAG/access/" + entity.name + "/create", function(req, res){
    SavedGenericEntity.findOne({name: entity.name}, function(err, result){
      if(err){
        console.log(err);
        res.send(ErrorObject.create("EntityDefinitionListError", 30));
        return;
      }

      if(result == undefined){
        res.status(401).send({error: "EntityDoesNotExistError", errorCode: 401});
        return;
      }

      for(var i = 0; i < entity.properties.length; i++){
        console.log("Validating properties:");
        console.log(entity.properties);
        if(req.body[entity.properties[i].name] == undefined && entity.properties[i].required == true){
            res.status(401).send({error: entity.properties[i].name + " field is a required field.", errorCode: 401});
            return;
        }
      }

      var newObject = {};
      for(var i = 0; i < entity.properties.length; i++){
        newObject[entity.properties[i].name] = req.body[entity.properties[i].name];
      }
      
      var savedInstance = GenericEntityInstance.create(entity, newObject);
      if(savedInstance == undefined){
        res.status(500).send({error: "InstanceSaveFailedError", errorCode: 500});
      } else {
        res.send(savedInstance);
      }
   });
  });
  
  router.delete("/EAG/access/" + entity.name, function(req, res) {
    var id = req.body.id;
    
    if(id == undefined || id == ""){
      res.status(401).send({error: "MissingArgumentException", errorCode: 401});
      return;
    }
    
    var foundCallback = function(instance) {
      instance.remove();
      res.send({status: "OK"});
    }

    var notFoundCallback = function() {
      res.status(404).send({error: "InstanceNotFoundError", errorCode: 404, originalArgs: {id: id}});
    }
    
    GenericEntityInstance.findInstanceById(id, entity, foundCallback, notFoundCallback);
  });

  router.delete("/EAG/access/" + entity.name + "/:propertyName/:propertyValue", function(req, res) {
    var propertyName = req.params.propertyName;
    var propertyValue = req.params.propertyValue;
    
    if(propertyName == undefined || propertyName == "" || propertyValue == undefined || propertyValue == ""){
      res.status(401).send({error: "MissingArgumentException", errorCode: 401});
      return;
    }
    
    var foundCallback = function(instances) {
      for(var i = 0; i < instances.length; i++){
        instances[i].remove();
      }
      
      res.send({status: "OK"});
    }

    var notFoundCallback = function() {
      res.status(404).send({error: "InstanceNotFoundError", errorCode: 404, originalArgs: {id: id}});
    }
    
    GenericEntityInstance.findInstanceByProperty(entity, propertyName, propertyValue, foundCallback, notFoundCallback);
  });
  
  router.get('/EAG/access/' + entity.name + '/findByProperty/:propertyName/:propertyValue', function(req, res){
    var propertyName = req.params.propertyName;
    var propertyValue = req.params.propertyValue;

    SavedGenericEntity.findOne({name: entity.name}, function(err, result){
      if(err){
        console.log(err);
        res.send(ErrorObject.create("EntityDefinitionListError", 30));
        return;
      }

      if(result == undefined){
        res.status(401).send({error: "EntityDoesNotExistError", errorCode: 401});
        return;
      }
      
      // Validate the property
      var isValidProperty = undefined;
      for(var i = 0; i < entity.properties.length; i++){
        var property = entity.properties[i];
        if(property.name == propertyName){
          isValidProperty = true;
          break;
        }
      }
      
      if(!isValidProperty){
        res.status(404).send({error: "InvalidPropertyError"});
        return;
      }
      
      // It's valid now. Define the callbacks and execute the final call.
      var foundCallback = function(instances){
        res.send({result: instances});
      };
      
      var notFoundCallback = function(){
        res.status(404).send({error: "InstanceNotFound"});
      };
      
      GenericEntityInstance.findInstanceByProperty(entity, propertyName, propertyValue, foundCallback, notFoundCallback);
    });
  });
};

var reloadEntities = function() {
  SavedGenericEntity.find({}, function(err, entities){
    if(err){
      console.log("Error has occurred while reloading entities.");
      console.log(err);
      return;
    }
    
    if(entities == undefined){
      console.log("Undefined entities to reload.");
      return;
    }
    
    for(var i = 0; i < entities.length; i++){
      var entity = entities[i];
      webbifyEntity(entity);
    }
  });
};

// Only do this once.
reloadEntities();

module.exports = router;
