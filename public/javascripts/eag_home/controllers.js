var app = angular.module("Controllers", []);

app.controller("GlobalMenuController", function($scope) {
  $scope.showCreateEntityPanelClick = function(){
    $scope.$parent.$broadcast("showCreateEntityPanel");
  };
});

app.controller("CreateEntityController", function($scope, $http){
  $scope.showCreateEntityPanel = undefined;

  $scope.hideAllPanels = function(){
    $scope.showTypeErrorPanel = undefined;
    $scope.showEntityExistsErrorPanel = undefined;
  };

  $scope.closePanel = function() {
    $scope.showCreateEntityPanel = undefined;
  }

  $scope.showCreateEntityPanelClick = function(){
    $scope.showCreateEntityPanel = true;
  }

  $scope.$on("showCreateEntityPanel", function(event){
    $scope.showCreateEntityPanel = true;
  });

  $scope.addNewProperty = function(){
    $scope.newEntity.properties.push({name: "", type: ""});
  };

  $scope.removeProperty = function(index){
    if($scope.newEntity.properties.length > 1){
      $scope.newEntity.properties.splice(index, 1);
    }
  };

  $scope.resetNewEntity = function(){
    $scope.newEntity = {
      entityName: "",
      properties: [{
        name: "",
        type: "",
        required: true
      }]
    };
  };

  $scope.submitCreateEntityForm = function(){
    var entityCreationPath = "http://localhost:3000/createEntity";
    $http.post(entityCreationPath, $scope.newEntity).success(function(data, statusCode) {
      if(statusCode == 200){
        $scope.$parent.$broadcast("EntityCreateSuccessful");
        $scope.resetNewEntity();
        $scope.hideAllPanels();
        $scope.$parent.$broadcast("ReloadEntityListEvent");
      };
    }).error(function(data, status){
      if(status == 422){
        $scope.showTypeError(data.name, data.type);
      } else if(status == 409){
        $scope.showEntityExistsError();
      }
    });
  };

  $scope.showEntityExistsError = function(){
    $scope.showCreateEntityPanel == false;
    $scope.showEntityExistsErrorPanel = {};
  }

  $scope.showTypeError = function(name, type){
    $scope.hideAllPanels();
    $scope.showTypeErrorPanel = {
      name: name,
      type: type
    };
  }

  $scope.cancelCreateEntity = function(){
    $scope.resetNewEntity();
    $scope.hideAllPanels();
    $scope.closePanel();
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
  
  $scope.$on("EntityCreateSuccessful", function(event) {
    $scope.resetAlerts();
    $scope.success.entityCreate = true;
  })

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
  $scope.showDeleteInstancePanel = false;
  $scope.success = {};
  $scope.warning = {};
  $scope.fail = {};
  
  $scope.hideAllPanels = function(){
    $scope.showCreateInstancePanel = false;
    $scope.showListInstancePanel = false;
    $scope.showDeleteInstancePanel = false;
  };
  
  $scope.createInstancePanelClick = function(){
    $scope.hideAllPanels();
    $scope.showCreateInstancePanel = true;
  }
  
  $scope.listInstancePanelClick = function(){
    $scope.hideAllPanels();
    $scope.showListInstancePanel = true;
  }
  
  $scope.deleteInstancePanelClick = function(){
    $scope.hideAllPanels();
    $scope.showDeleteInstancePanel = true;
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
    
    var listPath = "http://localhost:3000/EAG/access/" + entity.name;
  
    $http.get(listPath).success(function(data, status){
      if(status == 200){
        $scope.instanceList = JSON.stringify(data, null, 4);
      }
    });
  });
  
  $scope.createInstance = function(){
    var instance = $scope.newObject.props;
    var creationPath = "http://localhost:3000/EAG/access/" + $scope.entity.name;
    
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
  
  $scope.deleteInstance = function(){
    $scope.showDeleteSuccessPanel = undefined;
    $scope.showDeleteErrorPanel = undefined;
    var id = $scope.deleteIDString;
    var deleteEndpoint = "http://localhost:3000/EAG/access/" + $scope.entity.name + "/" + id;
    
    $http.delete(deleteEndpoint).success(function(data, status){
      $scope.showDeleteSuccessPanel = undefined;
      $scope.showDeleteErrorPanel = undefined;

      if(status == 200) {
        $scope.showDeleteSuccessPanel = "Instance with ID " + id + " was successfully deleted.";
        $scope.$parent.$broadcast("DisplayDetail", $scope.entity);
        $scope.deleteIDString = undefined;    // Because it's initial state is undefined.
      } else if(status == 401) {
        $scope.showDeleteErrorPanel = "Failed to delete instance. Invalid or missing ID."
      } else if (status == 404) {
        $scope.showDeleteErrorPanel = "Instance with ID " + id + " does not exist.";
      }
    }).error(function(error, status) {
      $scope.showDeleteSuccessPanel = undefined;
      $scope.showDeleteErrorPanel = undefined;

      if(status == 401) {
        $scope.showDeleteErrorPanel = "Failed to delete instance. Invalid or missing ID."
      } else if (status == 404) {
        $scope.showDeleteErrorPanel = "Instance with ID " + id + " does not exist.";
      }
    });
  }
});
