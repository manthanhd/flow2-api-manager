var app = angular.module("EAG_Home", []);

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
            console.log(data.entities);
            $scope.entities = data.entities;
        }
    });
});
