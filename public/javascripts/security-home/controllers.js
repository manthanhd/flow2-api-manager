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
    var entityCreationPath = "http://localhost:3000/user";
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
    $scope.success.userDelete = true;
  });
  
  $scope.$on("UserCreateSuccessful", function(event) {
    $scope.resetAlerts();
    $scope.success.userCreate = true;
  })

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

  $scope.$on("ReloadUserListEvent", function(event){
    $scope.listUsers();
  });

  $scope.listUsers = function(){
    $http.get("/user").success(function(data, status){
      if(status == 200){
        $scope.users = data.userList;
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

  $scope.listUsers();
  $scope.listRoles();
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
  
  $scope.deleteUserConfirmClick = function(userId) {
    var userDeletePath = "http://localhost:3000/user/" + userId;
    
    $http.delete(userDeletePath).success(function(data, statusCode) {
      if(statusCode == 200 && data.status == 'OK'){
        $scope.$parent.$broadcast("UserDeleteSuccessfulEvent");
        $scope.clearDetail();
        $scope.$parent.$broadcast("ReloadUserListEvent");
      } else {
        $scope.$parent.$broadcast("UserDeleteFailEvent");
      }
    }).error(function(){
      $scope.$parent.$broadcast("UserDeleteFailEvent");
    });
  }
  
  $scope.$on("DisplayDetail", function(event, user){
    $scope.user = user;
  });
});
