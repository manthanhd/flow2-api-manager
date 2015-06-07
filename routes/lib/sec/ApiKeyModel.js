/**
 * Created by manthanhd on 06/06/2015.
 */
var mongoose = require('mongoose');
var hat = require("hat");

var ObjectId = mongoose.Schema.Types.ObjectId;

var apiKeySchema = mongoose.Schema({
    userId: {type: ObjectId, index: true, required: true},
    apiKey: {type: String, index: {unique: true}, required: true, default: hat()},
    createdOn: {type: Date, default: Date.now},
    active: {type: Boolean, default: true},
    permissions: [{ action: String, realm: String }]
});

var apiKeyDBName = "FLOW2_APIKEYS";
var ApiKeyModel = mongoose.model(apiKeyDBName, apiKeySchema, apiKeyDBName);

module.exports = ApiKeyModel;