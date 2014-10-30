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

var SavedGenericEntity = mongoose.model("FLOW2_Entities", entitySchema);

module.exports = SavedGenericEntity;