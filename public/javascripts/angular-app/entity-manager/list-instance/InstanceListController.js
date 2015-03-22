var instanceListModule = angular.module("Entities");
instanceListModule.controller("InstanceListController", function($scope, RequestService) {
    $scope.$on("ViewEntity", function(event, entity) {
        RequestService.getInstanceList(entity.name, successHandler, failureHandler);
    });

    $scope.$on("Refresh", function(event, entity) {
        RequestService.getInstanceList(entity.name, successHandler, failureHandler);
    });

    $scope.showNewInstanceModal = function() {
        $scope.newInstance = {};
        $("#addInstanceModal").openModal();
    }

    $scope.addNewInstance = function() {
        var entity = $scope.$parent.entity;
        if(!entity) {
            toast("No entity has been selected!", 2000);
            return;
        }

        for(var i = 0; i < entity.properties.length; i++) {
            var entityProperty = entity.properties[i];
            if(entityProperty.required && entityProperty.required == true && !$scope.newInstance[entityProperty.name]) {
                $scope.addInstanceValidationMessage = entityProperty.name + " is a required property and must have a value.";
                return;
            }
        }

        var onSuccess = function(data, statusCode) {
            toast("Instance added!", 2000);
        }

        var onFailure = function() {
            toast("Failed to add new instance.", 2000);
        }

        RequestService.createInstance($scope.$parent.entity.name, $scope.newInstance, onSuccess, onFailure);

        $scope.newInstance = {};
    }

    function successHandler(data, statusCode) {
        $scope.instances = data.instanceList;
        $scope.instanceString = JSON.stringify(data.instanceList, null, 4);
    }

    function failureHandler(data, statusCode) {

    }
});