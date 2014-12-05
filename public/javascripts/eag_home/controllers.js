var app = angular.module("Controllers", []);

app.controller("NavigationController", function($scope, $http){
    $scope.entities = [];

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

    $http.get("/listEntities").success(function(data, status){
        if(status == 200){
            $scope.entities = data.entityList;
        }
    });
});

app.controller("EntityDetailController", function($scope, $http){
  $scope.newObject = {props: {}};
  $scope.instanceList = [];
  $scope.showCreateInstancePanel = false;
  $scope.showListInstancePanel = false;
  
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
  
  $scope.deleteEntityConfirmClick = function(entityId){
    console.log("Just confirmed to delete " + entityId + " entity");
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
