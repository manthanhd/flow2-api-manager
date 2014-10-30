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

router.get('/createEntity', function(req, res) {
  res.render('create_entity', { title: 'Express', layout: 'layouts/layout' });
});

router.post("/createEntity", function(req, res) {
    var entity = new GenericEntity(req.body.entityName);

    for(var i = 1; i < Object.keys(req.body).length / 2; i++){
        var prop = new GenericEntityProperty(req.body['property' + i + '_name'], "", req.body['property' + i + '_type']);
        entity.addProperty(prop);
    }
    
    console.log(entity.name + "entity has been created.");
    console.log(entity);
    
    var dbGenericEntity = new SavedGenericEntity();
    dbGenericEntity.name = entity.name;
    dbGenericEntity.properties = entity.properties;
    dbGenericEntity.save();
    
    var mongooseSchemaObject = {};
    for(var i = 0; i < entity.properties.length; i++){
        mongooseSchemaObject[entity.properties[i].name] = GenericEntityProperty.getMongooseType(entity.properties[i].type);
    }
    
    console.log("Mongoose schema object created for " + entity.name + ".");
    
    var entitySchema = mongoose.Schema(mongooseSchemaObject);
    var EntityObject = mongoose.model(entity.name, entitySchema);
    
    router.get('/' + entity.name + '/list', function(req, res){
        EntityObject.find({}).exec(function(err, result){
            if(err){
                console.log("Error finding " + entity.name);
                res.send(ErrorObject.create("NullPointerException", 500));
            } else {
                console.log(ErrorObject.create("TestErrorObject", 98));
                res.send(result);
            }
        });
    });
    
    router.post("/" + entity.name + "/create", function(req, res){
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
    res.send(entity);
});

module.exports = router;