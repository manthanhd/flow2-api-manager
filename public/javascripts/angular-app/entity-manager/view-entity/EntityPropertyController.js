var propertiesModule = angular.module("Entities");
propertiesModule.controller("EntityPropertyController", function($scope, RequestService) {

    $scope.$on("NewEntityCreateStart", function(event) {
        $scope.entity = $scope.$parent.newEntity;
    })

    $scope.$on("ViewEntity", function(event, entity) {
        $scope.entity = entity;
    });

    $scope.addProperty = function() {
        $scope.$parent.newEntity.properties.push({
            name: "",
            type: "string",
            required: true
        });

        toast("New property added!", 1000);
    }

    $scope.removePropertyAt = function(index) {
        if($scope.$parent.newEntity.properties.length == 1) {
            toast("An entity must have at least one property.", 3000);
            return;
        }

        $scope.$parent.newEntity.properties.splice(index, 1);
        toast("Property removed.", 1000);
    }
});