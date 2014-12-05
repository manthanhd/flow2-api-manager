var app = angular.module("Controllers", []);

app.controller("GlobalMenuController", function($scope) {
  $scope.showCreateEntityPanelClick = function(){
    $scope.$parent.$broadcast("showCreateEntityPanel");
  };
});

app.controller("CreateEntityController", function($scope, $http){
  $scope.showCreateEntityPanel == false;

  $scope.hideAllPanels = function(){
    $scope.showCreateEntityPanel = undefined;
  };

  $scope.showCreateEntityPanelClick = function(){
    $scope.showCreateEntityPanel = true;
  }

  $scope.$on("showCreateEntityPanel", function(event){
    $scope.showCreateEntityPanel = true;
  });

  $scope.addNewProperty = function(){
    $scope.newEntity.newProperties.push({name: "", type: ""});
  };

  $scope.removeProperty = function(index){
    $scope.newEntity.newProperties.splice(index, 1);
  };

  $scope.resetNewEntity = function(){
    $scope.newEntity = {
      name: "",
      newProperties: [{
        name: "",
        type: "",
        required: true
      }]
    };
  };

  $scope.createEntityButton = function(){
    console.log($scope.newEntity);
  };

  $scope.cancelCreateEntity = function(){
    $scope.resetNewEntity();
    $scope.hideAllPanels();
  };

  $scope.resetNewEntity();
});

app.controller("AlertsController", function($scope, $http){
  $scope.success = {};
  $scope.warning = {};
  $scope.fail = {};
  
  $scope.$on("EntityDeleteSuccessfulEvent", function(event){
    $scope.resetAlerts();
    $scope.success.entityDelete = true;
  });
  
  $scope.$on("EntityDeleteFailEvent", function(event){
    $scope.resetAlerts();
    $scope.success.entityDelete = true;
  });
  
  $scope.resetAlerts = function(){
    $scope.success = {};
    $scope.warning = {};
    $scope.fail = {};
  };
});

app.controller("NavigationController", function($scope, $http){
  $scope.entities = [];

  $scope.$on("ReloadEntityListEvent", function(event){
    $scope.listEntities();
  });

  $scope.listEntities = function(){
    $http.get("/listEntities").success(function(data, status){
      if(status == 200){
        $scope.entities = data.entityList;
      }
    });
  }

  $scope.displayDetail = function(id){
    if($scope.entities == undefined || $scope.entities == []){
      return;
    }

    for(var i = 0; i < $scope.entities.length; i++){
      var entity = $scope.entities[i];
      if(entity._id == id){
        $scope.$parent.$broadcast('DisplayDetail', entity);
        break;
      }
    }
  };

  $scope.listEntities();
    
});

app.controller("EntityDetailController", function($scope, $http){
  $scope.newObject = {props: {}};
  $scope.instanceList = [];
  $scope.showCreateInstancePanel = false;
  $scope.showListInstancePanel = false;
  $scope.success = {};
  $scope.warning = {};
  $scope.fail = {};
  
  $scope.hideAllPanels = function(){
    $scope.showCreateInstancePanel = false;
    $scope.showListInstancePanel = false;
  };
  
  $scope.createInstancePanelClick = function(){
    $scope.hideAllPanels();
    $scope.showCreateInstancePanel = true;
  }
  
  $scope.listInstancePanelClick = function(){
    $scope.hideAllPanels();
    $scope.showListInstancePanel = true;
  }
  
  $scope.countInstances = function(){
    var instances = angular.fromJson($scope.instanceList);
    if(instances == undefined || instances.instanceList == undefined){
      return 0;
    }
    return instances.instanceList.length;
  }
  
  $scope.resetAlerts = function(){
    $scope.success = {};
    $scope.warning = {};
    $scope.fail = {};
  }
  
  $scope.clearDetail = function(){
    $scope.hideAllPanels();
    $scope.resetAlerts();
    $scope.entity = undefined;
  }
  
  $scope.deleteEntityConfirmClick = function(entityId){
    console.log("Just confirmed to delete " + entityId + " entity");
    var entityDeletePath = "http://localhost:3000/deleteEntity/" + entityId;
    
    $http.get(entityDeletePath).success(function(data, statusCode) {
      if(statusCode == 200 && data.status == 'OK'){
        $scope.$parent.$broadcast("EntityDeleteSuccessfulEvent");
        $scope.clearDetail();
        $scope.$parent.$broadcast("ReloadEntityListEvent");
      } else {
        $scope.$parent.$broadcast("EntityDeleteFailEvent");
      }
    }).error(function(){
      $scope.$parent.$broadcast("EntityDeleteFailEvent");
    });
  }
  
  $scope.$on("DisplayDetail", function(event, entity){
    $scope.entity = entity;
    
    var listPath = "http://localhost:3000/EAG/access/" + entity.name + "/list";
  
    $http.get(listPath).success(function(data, status){
      if(status == 200){
        $scope.instanceList = JSON.stringify(data, null, 4);
      }
    });
  });
  
  $scope.createInstance = function(){
    var instance = $scope.newObject.props;
    var creationPath = "http://localhost:3000/EAG/access/" + $scope.entity.name + "/create";
    
    $http.post(creationPath, instance).success(function(instance, status){
      if(status == 200 && instance != undefined && instance._id != undefined){
        $scope.$parent.$broadcast("DisplayDetail", $scope.entity);
        $scope.newObject.props = {};
      } else {
        console.log("Failed to create instance.");
        console.log(instance);
        console.log(status);
      }
    });
  };
});
