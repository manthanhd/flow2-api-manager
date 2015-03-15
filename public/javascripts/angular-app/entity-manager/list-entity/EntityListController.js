var entitiesModule = angular.module("Entities");
entitiesModule.controller("EntityListController", function($scope, $http, RequestService) {
    RequestService.getEntityList(onEntityListSuccess, onEntityListFailure);
    $scope.view = view;

    function onEntityListSuccess(data, statusCode) {
        $scope.entityList = data.entityList;
    };

    function onEntityListFailure(data, statusCode) {
        toast("Failed to load entities.", 2000);
    };

    $scope.$on("RefreshEntityList", function(event) {
        RequestService.getEntityList(onEntityListSuccess, onEntityListFailure);
    });

    function view(entity) {
        if(!$scope.$parent.newEntity) {
            $scope.$parent.$broadcast("ViewEntity", entity);
        } else {
            toast("Cannot view entity while a new entity is being created.", 2000);
        }
    };

    $scope.entitySearchFilter = function(entity) {
        if($scope.$parent.searchEntityNameText == undefined || $scope.$parent.searchEntityNameText == "") {
            return true;
        }

        var lEntityName = entity.name.toLowerCase();
        var lSearchString = $scope.searchEntityNameText.toLowerCase();
        var regex = new RegExp(lSearchString);
        if(regex.test(lEntityName) == true) {
            return true;
        }
        return false;
    }
});

//entitiesModule.filter('entitySearchFilter', function() {
//    return function(entity, scope) {
//        console.log("filtering..");
//        if(!scope.$parent.searchEntityNameText) {
//            return true;
//        }
//
//        var lEntityName = entity.name.toLowerCase();
//        var lSearchString = $scope.$parent.searchEntityNameText.toLowerCase();
//        var regex = new RegExp(lSearchString);
//        if(regex.test(lEntityName) == true) {
//            return true;
//        }
//
//        return false;
//    }
//})