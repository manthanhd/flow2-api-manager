var entitiesModule = angular.module("Entities");
entitiesModule.controller("EntityListController", function($scope, $http, RequestService) {
    RequestService.getEntityList(onEntityListSuccess, onEntityListFailure);
    $scope.view = view;

    function onEntityListSuccess(data, statusCode) {
        $scope.entityList = data.entityList;
    };

    function onEntityListFailure(data, statusCode) {

    };

    function view(entity) {
        $scope.$parent.$broadcast("ViewEntity", entity);
    };
});