var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var accountSchema = mongoose.Schema({
    accountId: {type: ObjectId, index: {unique: true}, required: true, default: mongoose.Types.ObjectId},
    domainName: {type: String, index: {unique: true}},
    firstName: {type: String},
    lastName: {type: String},
    emailAddress: {type: String}
});

var accountDBName = "FLOW2_Accounts";
var AccountModel = mongoose.model(accountDBName, accountSchema, accountDBName);

module.exports = AccountModel;