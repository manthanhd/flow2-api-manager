var instanceListModule = angular.module("Entities");
instanceListModule.controller("InstanceListController", function($scope, RequestService) {
    $scope.$on("ViewEntity", function(event, entity) {
        RequestService.getInstanceList(entity.name, successHandler, failureHandler);
    });

    $scope.$on("Refresh", function(event, entity) {
        RequestService.getInstanceList(entity.name, successHandler, failureHandler);
    });


    function successHandler(data, statusCode) {
        $scope.instances = data.instanceList;
        $scope.instanceString = JSON.stringify(data.instanceList, null, 4);
    }

    function failureHandler(data, statusCode) {

    }
});