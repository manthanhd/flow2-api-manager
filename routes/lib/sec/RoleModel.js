var mongoose = require('mongoose');
var roleSchema = mongoose.Schema({
  name: String,
  description: String,
  context: String,  // entity or user or role or ID of an instance
  allowsOperation: [String], // Array of c, r, u, d, a (a/assign only for context role and user.);
  allowedAuthTypes: [String]  // UsernameAndPassword and/or OAuth
});

var roleDBName = "FLOW2_Roles";
var RoleModel = mongoose.model(roleDBName, roleSchema, roleDBName);

module.exports = RoleModel;