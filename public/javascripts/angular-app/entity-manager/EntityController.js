var entitiesModule = angular.module("Entities");
entitiesModule.controller("EntityController", function($scope) {
    $scope.showAddEntity = function() {
        $scope.newEntity = {};
        $scope.enableEntityAdd = true;
    }
});