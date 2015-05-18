var propertiesModule = angular.module("Entities");
propertiesModule.controller("EntityPropertyController", function($scope, $timeout, $http, RequestService) {

    $scope.$on("NewEntityCreateStart", function(event) {
        $scope.entity = $scope.$parent.newEntity;
        console.log("New entity!!")
        $scope.getTypes();
    })

    $scope.$on("ViewEntity", function(event, entity) {
        $scope.entity = entity;
    });

    $scope.initializeMaterialSelect = function() {
        $('select').material_select();
    };

    $scope.i = 0;

    $scope.$on("AddProperty", function() {
        $scope.$parent.newEntity.properties.push({
            name: "",
            type: "string",
            required: true
        });

        toast("New property added!", 1000);
    });

    $scope.removePropertyAt = function(index) {
        if($scope.$parent.newEntity.properties.length == 1) {
            toast("An entity must have at least one property.", 3000);
            return;
        }

        $scope.$parent.newEntity.properties.splice(index, 1);
        toast("Property removed.", 1000);
    }

    $scope.getTypes = function() {
        $http.get('/entity/metadata/types').success(function(data, statusCode) {
            if(statusCode == 200) {
                $scope.supportedTypes = data.typeList;
            }
        });
    };

    $scope.getTypes();
});