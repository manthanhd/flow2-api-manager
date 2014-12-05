var mongoose = require('mongoose');

var ErrorObject = require('./lib/ErrorObject');
var modelCollection = require('./lib/ModelCollection');
var GenericEntity = require('./lib/GenericEntity');
var GenericEntityProperty = require('./lib/GenericEntityProperty');
var SavedGenericEntity = require('./lib/GenericEntityModel');

modelCollection.add("GenericEntityModel", SavedGenericEntity);

var express = require('express');
var router = express.Router();

var uri = 'mongodb://localhost:27017/flow2';

mongoose.connect(uri, function(err, res) {
    if(err) {
        console.log("Error connecting to DB.");
    } else {
        console.log("Successfully connected to DB.");
    }
});

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
      res.send(ErrorObject.create("EntityDefinitionListError", 30));
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
    for(var i = 1; i < Object.keys(req.body).length / 2; i++){
        var prop = new GenericEntityProperty(req.body['property' + i + '_name'], "", req.body['property' + i + '_type']);
        entity.addProperty(prop);
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
    res.status(401).send("EntityExistsException");
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
    var EntityObject = entityObjectModels[entity.name];

    mongoose.connection.db.dropCollection(entityName, function(err, result){
      if(err){
        console.log(err);
      }
      
      entity.remove();
      console.log("Entity deleted.");
      res.send({ status: "OK", description: "Entity deleted." });
    });
    
  });
});

var entityObjectModels = {};

var getEntityObjectModel = function(entity){  // Call once per entity
  if(entityObjectModels[entity.name] != undefined){
    return entityObjectModels[entity.name];
  }
  
  var mongooseSchemaObject = {};
  for(var i = 0; i < entity.properties.length; i++){
    mongooseSchemaObject[entity.properties[i].name] = GenericEntityProperty.getMongooseType(entity.properties[i].type);
  }

  console.log("Mongoose schema object created for " + entity.name + ".");

  var entitySchema = mongoose.Schema(mongooseSchemaObject);
  var EntityObject = mongoose.model(entity.name, entitySchema, entity.name);
  
  entityObjectModels[entity.name] = EntityObject;
  
  return EntityObject;
}

var webbifyEntity = function(entity){
  
  EntityObject = getEntityObjectModel(entity);
  
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
      
      EntityObject.find({}).exec(function(err, result){
        if(err){
            console.log("Error finding " + entity.name);
            res.send(ErrorObject.create("NullPointerException", 500));
        } else {
            res.send({ instanceList: result });
        }
      });
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
        res.status(401).send("EntityDoesNotExistError");
        return;
      }
      
      var newObject = new EntityObject();
      for(var i = 0; i < entity.properties.length; i++){
        if(req.body[entity.properties[i].name] == undefined && entity.properties[i].required == true){
            res.send(entity.properties[i].name + " field is a required field.");
            return;
        }
      }

      for(var i = 0; i < entity.properties.length; i++){
        newObject[entity.properties[i].name] = req.body[entity.properties[i].name];
      }

      newObject.save();
      res.send(newObject);
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
