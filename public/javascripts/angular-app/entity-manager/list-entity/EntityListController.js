var entitiesModule = angular.module("Entities");
entitiesModule.controller("EntityListController", function($scope, $http, RequestService) {
    RequestService.getEntityList(onEntityListSuccess, onEntityListFailure);

    function onEntityListSuccess(data, statusCode) {
        $scope.entityList = data.entityList;
    };

    function onEntityListFailure(data, statusCode) {

    };
});