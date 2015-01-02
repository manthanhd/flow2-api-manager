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
    var entityCreationPath = "/entity";
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
    $http.get("/entity").success(function(data, status){
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
  $scope.showEditInstancePanel = false;
  $scope.success = {};
  $scope.warning = {};
  $scope.fail = {};
  
  $scope.hideAllPanels = function(){
    $scope.showCreateInstancePanel = false;
    $scope.showListInstancePanel = false;
    $scope.showDeleteInstancePanel = false;
    $scope.showEditInstancePanel = false;
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
  
  $scope.editInstancePanelClick = function(){
    $scope.editInstanceObject = undefined;
    $scope.hideAllPanels();
    $scope.showEditInstancePanel = true;
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
    var entityDeletePath = "/entity/" + entityId;
    
    $http.delete(entityDeletePath).success(function(data, statusCode) {
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
  
  $scope.getInstancesForEntity = function(entityName){
    var listPath = "/EAG/access/" + entityName;

    $http.get(listPath).success(function(data, status){
      if(status == 200){
        $scope.instanceList = JSON.stringify(data, null, 4);
      }
    });
  }
  
  $scope.$on("DisplayDetail", function(event, entity){
    $scope.entity = entity;
    $scope.getInstancesForEntity(entity.name);
  });
  
  $scope.createInstance = function(){
    var instance = $scope.newObject.props;
    var creationPath = "/EAG/access/" + $scope.entity.name;
    
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
    var deleteEndpoint = "/EAG/access/" + $scope.entity.name + "/" + id;
    
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
  
  $scope.getInstanceForEdit = function(id) {
    var fetchEndpoint = "/EAG/access/" + $scope.entity.name + "/_id/" + id;
    $http.get(fetchEndpoint).success(function(data, response) {
      if(response == 200){
        console.log(data);
        if(data.result.length > 1) {
          $scope.showEditErrorPanel = "Too many instances matched the query. Exactly one result was expected."
        } else if (data.result.length == 0) {
          $scope.showEditErrorPanel = "Instance not found.";
        }
        $scope.editInstanceObject = data.result[0];
      }
    }).error(function(data, status) {
      $scope.showEditSuccessPanel = undefined;
      $scope.showEditErrorPanel = undefined;
      if (status == 404) {
        $scope.showEditErrorPanel = "Instance was not found. Please verify its ID and try again.";
      } else if (status == 401) {
        $scope.showEditErrorPanel = "Query argument is invalid. Please verify and try again.";
      }
    });
  }
  
  $scope.closeEditInstancePanel = function(){
    $scope.editInstanceObject = undefined;
    $scope.showEditErrorPanel = undefined;
    $scope.showEditSuccessPanel = undefined;
    
    $scope.showEditInstancePanel = undefined;
  }
  
  $scope.editCurrentInstance = function(instanceId) {
    var editEndpoint = "/EAG/access/" + $scope.entity.name;
    $http.put(editEndpoint, $scope.editInstanceObject).success(function(response, status) {
      if(status == 200) {
        $scope.showEditSuccessPanel = "Edit was successful!";
        $scope.showEditErrorPanel = undefined;
        $scope.editInstanceObject = undefined;
        $scope.editIDString = "";
        console.log(response);
      } else {
        $scope.showEditSuccessPanel = undefined;
        $scope.showEditErrorPanel = "Error occurred.";
        console.log(response);
      }
    }).error(function(data, status) {
      $scope.showEditSuccessPanel = undefined;
      $scope.showEditErrorPanel = undefined;
      if (status == 401) {
        if (data.error == "MissingArgumentException") {
          $scope.showEditErrorPanel = "Client error. Please reload the page and try again. If error persists, contact administrator or support."
        } else {
          $scope.showEditErrorPanel = "A required property missing. " + data.error;
        }
      } else if (status == 404) {
        $scope.showEditErrorPanel = "Couldn't connect to server. Try again.";
      } else if(status == 403) {
        $scope.showEditErrorPanel = "Access denied. You do not seem to have sufficient privileges to perform this operation.";
      }else {
        $scope.showEditErrorPanel = "Server error. This may be due to a conflict.";
      }
    });
  }
});
