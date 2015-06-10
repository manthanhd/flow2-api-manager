var instanceListModule = angular.module("Entities");
instanceListModule.controller("InstanceListController", function($scope, RequestService) {
    $scope.initializeMaterialSelect = function() {
        $('select').material_select();
    };

    $scope.initializeMaterialSelect();


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
        };

        var onFailure = function(data, statusCode) {
            if(statusCode == 403) {
                toast("User is not authorised to create instance.", 2000);
            } else {
                toast("Failed to add new instance.", 2000);
            }
        };

        RequestService.createInstance($scope.$parent.entity.name, $scope.newInstance, onSuccess, onFailure);

        $scope.newInstance = {};
    }

    $scope.showFindInstanceModal = function() {
        $("#findInstanceModal").openModal();
    }

    $scope.findInstances = function() {
        console.log($scope.findInstanceProperty);
        console.log($scope.findInstanceValue);
    }

    function successHandler(data, statusCode) {
        $scope.instances = data.instanceList;
        $scope.instanceString = JSON.stringify(data.instanceList, null, 4);
    }

    function failureHandler(data, statusCode) {
        if(statusCode == 404 && data == "EntityNotActiveError") {
            toast("Cannot display instances as entity has been deactivated.", 2000);
        } else if (statusCode == 404 && data == "EntityDoesNotExistError") {
            toast("Instances cannot be viewed as the entity of this instance has been deleted.", 2000);
        } else if (statusCode == 403) {
            toast("User is not authorised to view instances.", 2000);
        }
    }
});