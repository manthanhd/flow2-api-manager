var app = angular.module("Controllers", []);

app.controller("GlobalMenuController", function($scope) {
  $scope.showCreateUserPanelClick = function(){
    $scope.$parent.$broadcast("showCreateUserPanel");
  };
});

app.controller("CreateUserController", function($scope, $http){
  $scope.showCreateUserPanel = undefined;

  $scope.hideAllPanels = function(){
    $scope.showTypeErrorPanel = undefined;
    $scope.showUserExistsErrorPanel = undefined;
  };

  $scope.closePanel = function() {
    $scope.showCreateUserPanel = undefined;
  }

  $scope.showCreateUserPanelClick = function(){
    $scope.showCreateUserPanel = true;
  }

  $scope.$on("showCreateUserPanel", function(event){
    $scope.showCreateUserPanel = true;
  });

  $scope.resetNewUser = function(){
    $scope.newUser = {
      
      }
    };

  $scope.submitCreateUserForm = function(){
    var entityCreationPath = "/user";
    $http.post(entityCreationPath, $scope.newUser).success(function(data, statusCode) {
      if(statusCode == 200){
        $scope.$parent.$broadcast("UserCreateSuccessful");
        $scope.resetNewUser();
        $scope.hideAllPanels();
        $scope.$parent.$broadcast("ReloadUserListEvent");
      };
    }).error(function(data, status){
      if(status == 409){
        $scope.showUserExistsError();
      }
    });
  };

  $scope.showUserExistsError = function(){
    $scope.showCreateUserPanel == false;
    $scope.showUserExistsErrorPanel = {};
  }

  $scope.cancelCreateUser = function(){
    $scope.resetNewUser();
    $scope.hideAllPanels();
    $scope.closePanel();
  };

  $scope.resetNewUser();
});

app.controller("AlertsController", function($scope, $http){
  $scope.success = {};
  $scope.warning = {};
  $scope.fail = {};
  
  $scope.$on("UserDeleteSuccessfulEvent", function(event){
    $scope.resetAlerts();
    $scope.success.userDelete = true;
  });
  
  $scope.$on("UserDeleteFailEvent", function(event){
    $scope.resetAlerts();
    $scope.fail.userDelete = true;
  });
  
  $scope.$on("UserCreateSuccessful", function(event) {
    $scope.resetAlerts();
    $scope.success.userCreate = true;
  });

  $scope.$on("UserCreateFail", function(event) {
    $scope.resetAlerts();
    $scope.fail.userCreate = true;
  });

  $scope.resetAlerts = function(){
    $scope.success = {};
    $scope.warning = {};
    $scope.fail = {};
  };
});

app.controller("NavigationController", function($scope, $http){
  $scope.users = [];
  $scope.roles = [];

  $scope.$on("ReloadRoleListEvent", function(event) {
    $scope.listRoles();
  });

  $scope.listRoles = function() {
    $http.get("/role").success(function(data, status){
      if(status == 200){
        $scope.roles = data.roleList;
      }
    });
  }

  $scope.$on("ReloadUserListEvent", function(event, user){
    console.log("Received broadcast at nav controller. Processing.")
    $scope.listUsers(user);
  });

  $scope.listUsers = function(showUser){
    $http.get("/user").success(function(data, status){
      if(status == 200){
        $scope.users = data.userList;
        // Refine roles to display names rather than just IDs.
        /*
        The loop clusterfuck below basically maps roleId attribute
        within each user object to it's actual object. This desperately needs
        to be improved as it's efficiency is n3 which is horrible.'
        */
        for(var i = 0; i < $scope.users.length; i++) {
          var user = $scope.users[i];
          for(var j = 0; j < user.roles.length; j++) {
            var role = user.roles[j];
            for(var k = 0; k < $scope.roles.length; k++) {
              if($scope.roles[k]._id == user.roles[j].roleId) {
                role.roleObject = $scope.roles[k];
              }
            }
          }
        }
        if(showUser) {
          $scope.displayDetail(showUser._id);
        }
      }
    });
  }

  $scope.displayDetail = function(id){
    if($scope.users == undefined || $scope.users == []){
      return;
    }
    
    for(var i = 0; i < $scope.users.length; i++){
      var user = $scope.users[i];
      if(user._id == id){
        $scope.$parent.$broadcast('DisplayDetail', user);
        break;
      }
    }
  };

  $scope.displayRoleDetail = function(id){
    if($scope.roles == undefined || $scope.roles == []){
      return;
    }

    for(var i = 0; i < $scope.roles.length; i++){
      var role = $scope.roles[i];
      if(role._id == id){
        $scope.$parent.$broadcast('DisplayRoleDetail', role);
        break;
      }
    }
  };

  $scope.listRoles(); // This order is important!
  $scope.listUsers();
});

app.controller("RoleDetailController", function($scope, $http) {
  $scope.role = undefined;
  $scope.success = {};
  $scope.warning = {};
  $scope.fail = {};

  $scope.resetAlerts = function(){
    $scope.success = {};
    $scope.warning = {};
    $scope.fail = {};
  }

  $scope.clearDetail = function(){
    $scope.resetAlerts();
    $scope.role = undefined;
  }

  $scope.$on("DisplayRoleDetail", function(event, role) {
    $scope.role = role;
  })
});

app.controller("UserDetailController", function($scope, $http){
  $scope.newObject = {props: {}};
  $scope.success = {};
  $scope.warning = {};
  $scope.fail = {};
  
  $scope.resetAlerts = function(){
    $scope.success = {};
    $scope.warning = {};
    $scope.fail = {};
  }

  $scope.clearDetail = function(){
    $scope.resetAlerts();
    $scope.user = undefined;
  }

  $scope.fetchAvailableRoles = function() {
    $http.get("/role").success(function(data, status){
      if(status == 200){
        $scope.availableRoles = data.roleList;
        $scope.selectedRole = $scope.availableRoles[0];
      }
    });
  }

  $scope.deleteUserConfirmClick = function(userId) {
    var userDeletePath = "/user/" + userId;
    
    $http.delete(userDeletePath).success(function(data, statusCode) {
      if(statusCode == 200 && data.status == 'OK'){
        $scope.$parent.$broadcast("UserDeleteSuccessfulEvent");
        $scope.clearDetail();
        $scope.$parent.$broadcast("ReloadUserListEvent", $scope.user);
      } else {
        $scope.$parent.$broadcast("UserDeleteFailEvent");
      }
    }).error(function(){
      $scope.$parent.$broadcast("UserDeleteFailEvent");
    });
  }
  
  $scope.$on("DisplayDetail", function(event, user){
    console.log("Displaying...");
    console.log(user);
    $scope.user = user;
  });

  $scope.addRoleToUser = function(userId, roleId, affects) {
    var url = "/user/" + userId;
    $http.post(url, {roleId: roleId, affects: affects}).success(function(data, status) {
      if(status == 200) {
        $scope.user = data;
        $scope.selectedRole = $scope.availableRoles[0];
        $scope.selectedRoleAffects = undefined;
        $scope.showSuccessPanel = "Role was successfully assigned to the user.";
        $scope.$parent.$broadcast("ReloadUserListEvent", $scope.user);
      }
    }).error(function(data, status) {
      $scope.showFailPanel = "Failed to assign role.";
      if(status == 404) {
        $scope.showFailPanel += " Role or User not found.";
      } else if(status == 401) {
        $scope.showFailPanel += " One or more required attributes are missing.";
      } else if(status == 403 && data.error == "AccessDeniedError") {
        $scope.showFailPanel += " Only administrators can assign roles to users.";
      } else if(status == 403) {
        $scope.showFailPanel += " Session has timed out. Login is required.";
      }
    });
  }

  $scope.unassign = function(userId, roleAssignmentId) {
    $http.delete('/user/' + userId + '/' + roleAssignmentId).success(function(data, status) {
      $scope.showSuccessPanel = undefined;
      $scope.showFailPanel = undefined;
      if(status == 200) {
        $scope.$parent.$broadcast("ReloadUserListEvent");
        $scope.showSuccessPanel = "Role was successfully unassigned from the user.";
        $scope.$parent.$broadcast("ReloadUserListEvent", $scope.user);
      } else if(status == 403 && data.error == "OperationNotPermitted") {
        $scope.showFailPanel = "You do not have the necessary permission(s) to perform this operation."
      } else if(status == 403 && data.error == "LoginRequired") {
        $scope.showFailPanel = "You must be logged in to perform this operation.";
      }
    }).error(function(data, status) {
      $scope.showSuccessPanel = undefined;
      $scope.showFailPanel = undefined;
      if (status == 403 && data.error == "OperationNotPermitted") {
        $scope.showFailPanel = "You do not have the necessary permission(s) to perform this operation."
      } else if(status == 403 && data.error == "AccessDeniedError") {
        $scope.showFailPanel = "You must be an administrator to perform this operation.";
      }else if(status == 403 && data.error == "LoginRequired") {
        $scope.showFailPanel = "You must be logged in to perform this operation.";
      }
    })
  }

  $scope.cancelAddRoleToUser = function() {
    $scope.showFailPanel = undefined;
    $scope.showSuccessPanel = undefined;
    $scope.showUserRoleAssignPanel = undefined;
  }

  $scope.fetchAvailableRoles();
});
