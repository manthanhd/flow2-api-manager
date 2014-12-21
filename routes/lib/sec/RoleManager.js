var mongoose = require('mongoose');
var RoleModel = require('./RoleModel');

var RoleManager = {};

RoleManager.init = function() {
  RoleModel.find({}, function(err, roles) {
    if(err){
      console.log("Error while listing roles: ");
      console.log(err);
      process.exit(1);
    }
    
    if(roles == undefined || roles.length == 0) {
      // Define default roles:
      var entityCreateRole = new RoleModel();
      entityCreateRole.name = "Create Entity";
      entityCreateRole.description = "Grants permission to create an entity.";
      entityCreateRole.context = "entity";
      entityCreateRole.allowsOperation = ['c'];
      entityCreateRole.allowedAuthTypes = ['UsernameAndPassword', 'OAuth'];
      entityCreateRole.save(function(err, savedRole) {
        if(err){
          console.log("Failed to save role.");
          console.log(err);
          process.exit(1);
        }
        
        console.log("Default role created: " + savedRole.name);
      });
      
      var entityReadRole = new RoleModel();
      entityReadRole.name = "Read Entity";
      entityReadRole.description = "Grants permission to read an entity.";
      entityReadRole.context = "entity";
      entityReadRole.allowsOperation = ['r'];
      entityReadRole.allowedAuthTypes = ['UsernameAndPassword', 'OAuth'];
      entityReadRole.save(function(err, savedRole) {
        if(err){
          console.log("Failed to save role.");
          console.log(err);
          process.exit(1);
        }

        console.log("Default role created: " + savedRole.name);
      });
      
      // No update entity is available at this time.
      
      var entityDeleteRole = new RoleModel();
      entityDeleteRole.name = "Delete Entity";
      entityDeleteRole.description = "Grants permission to delete an entity.";
      entityDeleteRole.context = "entity";
      entityDeleteRole.allowsOperation = ['d'];
      entityDeleteRole.allowedAuthTypes = ['UsernameAndPassword', 'OAuth'];
      entityDeleteRole.save(function(err, savedRole) {
        if(err){
          console.log("Failed to save role.");
          console.log(err);
          process.exit(1);
        }

        console.log("Default role created: " + savedRole.name);
      });
      
//      Instance related roles
      
      var instanceCreateRole = new RoleModel();
      instanceCreateRole.name = "Create Any Instance";
      instanceCreateRole.description = "Grants permission to create any instance.";
      instanceCreateRole.context = "instance";
      instanceCreateRole.allowsOperation = ['c'];
      instanceCreateRole.allowedAuthTypes = ['UsernameAndPassword', 'OAuth'];
      instanceCreateRole.save(function(err, savedRole) {
        if(err){
          console.log("Failed to save role.");
          console.log(err);
          process.exit(1);
        }

        console.log("Default role created: " + savedRole.name);
      });
      
      var instanceReadRole = new RoleModel();
      instanceReadRole.name = "Read Any Instance";
      instanceReadRole.description = "Grants permission to read any instance.";
      instanceReadRole.context = "instance";
      instanceReadRole.allowsOperation = ['r'];
      instanceReadRole.allowedAuthTypes = ['UsernameAndPassword', 'OAuth'];
      instanceReadRole.save(function(err, savedRole) {
        if(err){
          console.log("Failed to save role.");
          console.log(err);
          process.exit(1);
        }

        console.log("Default role created: " + savedRole.name);
      });
      
      var instanceUpdateRole = new RoleModel();
      instanceUpdateRole.name = "Update Any Instance";
      instanceUpdateRole.description = "Grants permission to update any instance.";
      instanceUpdateRole.context = "instance";
      instanceUpdateRole.allowsOperation = ['u'];
      instanceUpdateRole.allowedAuthTypes = ['UsernameAndPassword', 'OAuth'];
      instanceUpdateRole.save(function(err, savedRole) {
        if(err){
          console.log("Failed to save role.");
          console.log(err);
          process.exit(1);
        }

        console.log("Default role created: " + savedRole.name);
      });
      
      var instanceDeleteRole = new RoleModel();
      instanceDeleteRole.name = "Delete Any Instance";
      instanceDeleteRole.description = "Grants permission to delete any instance.";
      instanceDeleteRole.context = "instance";
      instanceDeleteRole.allowsOperation = ['d'];
      instanceDeleteRole.allowedAuthTypes = ['UsernameAndPassword', 'OAuth'];
      instanceDeleteRole.save(function(err, savedRole) {
        if(err){
          console.log("Failed to save role.");
          console.log(err);
          process.exit(1);
        }

        console.log("Default role created: " + savedRole.name);
      });
      
//      Roles affecting User
      
      var userCreateRole = new RoleModel();
      userCreateRole.name = "Create User";
      userCreateRole.description = "Grants permission to create any user.";
      userCreateRole.context = "user";
      userCreateRole.allowsOperation = ['c'];
      userCreateRole.allowedAuthTypes = ['UsernameAndPassword', 'OAuth'];
      userCreateRole.save(function(err, savedRole) {
        if(err){
          console.log("Failed to save role.");
          console.log(err);
          process.exit(1);
        }

        console.log("Default role created: " + savedRole.name);
      });
      
      var userReadRole = new RoleModel();
      userReadRole.name = "Read User";
      userReadRole.description = "Grants permission to read any user.";
      userReadRole.context = "user";
      userReadRole.allowsOperation = ['r'];
      userReadRole.allowedAuthTypes = ['UsernameAndPassword', 'OAuth'];
      userReadRole.save(function(err, savedRole) {
        if(err){
          console.log("Failed to save role.");
          console.log(err);
          process.exit(1);
        }

        console.log("Default role created: " + savedRole.name);
      });
      
      var userUpdateRole = new RoleModel();
      userUpdateRole.name = "Update User";
      userUpdateRole.description = "Grants permission to update any user.";
      userUpdateRole.context = "user";
      userUpdateRole.allowsOperation = ['u'];
      userUpdateRole.allowedAuthTypes = ['UsernameAndPassword', 'OAuth'];
      userUpdateRole.save(function(err, savedRole) {
        if(err){
          console.log("Failed to save role.");
          console.log(err);
          process.exit(1);
        }

        console.log("Default role created: " + savedRole.name);
      });
      
      var userDeleteRole = new RoleModel();
      userDeleteRole.name = "Delete User";
      userDeleteRole.description = "Grants permission to delete any user.";
      userDeleteRole.context = "user";
      userDeleteRole.allowsOperation = ['d'];
      userDeleteRole.allowedAuthTypes = ['UsernameAndPassword', 'OAuth'];
      userDeleteRole.save(function(err, savedRole) {
        if(err){
          console.log("Failed to save role.");
          console.log(err);
          process.exit(1);
        }

        console.log("Default role created: " + savedRole.name);
      });
      
//      Role related roles
      
      var roleCreateRole = new RoleModel();
      roleCreateRole.name = "Create Role";
      roleCreateRole.description = "Grants permission to create a role.";
      roleCreateRole.context = "role";
      roleCreateRole.allowsOperation = ['c'];
      roleCreateRole.allowedAuthTypes = ['UsernameAndPassword', 'OAuth'];
      roleCreateRole.save(function(err, savedRole) {
        if(err){
          console.log("Failed to save role.");
          console.log(err);
          process.exit(1);
        }

        console.log("Default role created: " + savedRole.name);
      });
      
      var roleReadRole = new RoleModel();
      roleReadRole.name = "Read Role";
      roleReadRole.description = "Grants permission to read a role.";
      roleReadRole.context = "role";
      roleReadRole.allowsOperation = ['r'];
      roleReadRole.allowedAuthTypes = ['UsernameAndPassword', 'OAuth'];
      roleReadRole.save(function(err, savedRole) {
        if(err){
          console.log("Failed to save role.");
          console.log(err);
          process.exit(1);
        }

        console.log("Default role created: " + savedRole.name);
      });
      
      var roleUpdateRole = new RoleModel();
      roleUpdateRole.name = "Update Role";
      roleUpdateRole.description = "Grants permission to update a role.";
      roleUpdateRole.context = "role";
      roleUpdateRole.allowsOperation = ['u'];
      roleUpdateRole.allowedAuthTypes = ['UsernameAndPassword', 'OAuth'];
      roleUpdateRole.save(function(err, savedRole) {
        if(err){
          console.log("Failed to save role.");
          console.log(err);
          process.exit(1);
        }

        console.log("Default role created: " + savedRole.name);
      });
      
      var roleDeleteRole = new RoleModel();
      roleDeleteRole.name = "Delete Role";
      roleDeleteRole.description = "Grants permission to delete a role.";
      roleDeleteRole.context = "role";
      roleDeleteRole.allowsOperation = ['d'];
      roleDeleteRole.allowedAuthTypes = ['UsernameAndPassword', 'OAuth'];
      roleDeleteRole.save(function(err, savedRole) {
        if(err){
          console.log("Failed to save role.");
          console.log(err);
          process.exit(1);
        }

        console.log("Default role created: " + savedRole.name);
      });
      
      var roleAssignRole = new RoleModel();
      roleAssignRole.name = "Assign Role";
      roleAssignRole.description = "Grants permission to assign a role to user.";
      roleAssignRole.context = "role";
      roleAssignRole.allowsOperation = ['a'];
      roleAssignRole.allowedAuthTypes = ['UsernameAndPassword', 'OAuth'];
      roleAssignRole.save(function(err, savedRole) {
        if(err){
          console.log("Failed to save role.");
          console.log(err);
          process.exit(1);
        }

        console.log("Default role created: " + savedRole.name);
      });
    }
  });
}