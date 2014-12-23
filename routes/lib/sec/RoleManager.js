var mongoose = require('mongoose');
var RoleModel = require('./RoleModel');

var RoleManager = {};

RoleManager.roleCache = [];

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
      entityCreateRole.isDefault = true;
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
      entityReadRole.isDefault = true;
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
      entityDeleteRole.isDefault = true;
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
      instanceCreateRole.isDefault = true;
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
      instanceReadRole.isDefault = true;
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
      instanceUpdateRole.isDefault = true;
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
      instanceDeleteRole.isDefault = true;
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
      userCreateRole.isDefault = true;
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
      userReadRole.isDefault = true;
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
      userUpdateRole.isDefault = true;
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
      userDeleteRole.isDefault = true;
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
      roleCreateRole.isDefault = true;
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
      roleReadRole.isDefault = true;
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
      roleUpdateRole.isDefault = true;
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
      roleDeleteRole.isDefault = true;
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
      roleAssignRole.isDefault = true;
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

RoleManager.getAllRoles = function(successCallback, failureCallback) {
  RoleModel.find({}, function(err, roles) {
    if(err || !roles){
      failureCallback();
      return;
    }

    successCallback(roles);
  })
}

RoleManager.buildCache = function() {
  RoleManager.getAllRoles(function(roles) {
    if(roles && roles.length > 0) {
      RoleManager.roleCache = roles;
      console.log("Role cache is now available.");
    } else {
      console.log("Failed to build role cache. No roles exist!");
    }
  }, function() {
    console.log("Failed to build role cache.")
  })
}

RoleManager.getRoleById = function(id, successCallback, failureCallback) {
  RoleModel.findOne({_id: id}, function(err, role) {
    if(err || !role){
      failureCallback();
      return;
    }

    successCallback(role);
  })
}

/*RoleManager.expandIdList = function(roleIdList, successCallback, failureCallback) {
  var ids = roleIdList.map(function(id) { return ObjectId(id); });
  RoleModel.find({_id: {$in: ids}}, function(err, roles) {
    if(err || !roles || roles.length != roleIdList.length){
      failureCallback();
      return;
    }

    successCallback(roles);
  })
}*/
module.exports = RoleManager;