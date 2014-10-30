var mongoose = require('mongoose');

var GenericEntity = require('./lib/GenericEntity');
var GenericEntityProperty = require('./lib/GenericEntityProperty');

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
    var prop1 = new GenericEntityProperty(req.body.propKey1, "", req.body.propType1);
    var prop2 = new GenericEntityProperty(req.body.propKey2, "", req.body.propType2);
    var prop3 = new GenericEntityProperty(req.body.propKey3, "", req.body.propType3);
    entity.addProperty(prop1);
    entity.addProperty(prop2);
    entity.addProperty(prop3);
    console.log("An entity has been created.");
    console.log(entity);
    res.send(entity);
})

module.exports = router;
