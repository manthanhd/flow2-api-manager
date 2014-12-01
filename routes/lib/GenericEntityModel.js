var mongoose = require("mongoose");

var entitySchema = mongoose.Schema({
    name: String,
    properties: {
        name: String,
        value: String,
        type: String,
        required: Boolean
    }
});

var entityDBName = "FLOW2_Entities";
var SavedGenericEntity = mongoose.model(entityDBName, entitySchema, entityDBName);

module.exports = SavedGenericEntity;
