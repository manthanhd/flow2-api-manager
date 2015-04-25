var mongoose = require("mongoose");

var entitySchema = mongoose.Schema({
    accountId: {type: mongoose.Schema.Types.ObjectId, required: true},
    name: String,
    instanceClassName: String,
    active: {type: Boolean, default: true},
    properties: [{
        name: String,
        value: String,
        type: {type: String, required: false},
        required: {type: Boolean, required: false}
    }]
});

var entityDBName = "FLOW2_Entities";
var SavedGenericEntity = mongoose.model(entityDBName, entitySchema, entityDBName);

module.exports = SavedGenericEntity;
