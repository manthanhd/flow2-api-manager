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

    $http.get("/EAG/listEntities").success(function(data, status){
        if(status == 200){
            $scope.entities = data.entities;
        }
    });
});


app.controller("EntityDetailController", function($scope){
  $scope.$on("DisplayDetail", function(event, entity){
    console.log(entity);
    $scope.entity = entity;
  });
});
