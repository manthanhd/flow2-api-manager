var propertiesModule = angular.module("Entities");
propertiesModule.controller("EntityPropertyController", function($scope, RequestService) {
    $scope.$on("ViewEntity", function(event, entity) {
        console.log(entity);
        $scope.entity = entity;
    })
});