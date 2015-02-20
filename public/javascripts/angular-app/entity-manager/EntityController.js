var entitiesModule = angular.module("Entities");
entitiesModule.controller("EntityController", function($scope, RequestService) {
    $scope.$on("ViewEntity", function(event, entity) {
        $scope.entity = entity;
    })

    $scope.showAddEntity = function() {
        $scope.newEntity = {
            name: "",
            properties: [{
                name: "",
                type: "string"
            }]
        };
        $scope.entity = undefined;
        $scope.enableEntityAdd = true;
    }

    $scope.hideAddEntity = function() {
        $scope.newEntity = undefined;
        $scope.enableEntityAdd = undefined;
    }

    $scope.saveEntity = function() {
        var alphaNumericUnderscoreRegex = new RegExp("^[A-Za-z0-9_]+$");
        if(alphaNumericUnderscoreRegex.test($scope.newEntity.entityName) != true) {
            toast("Entity name cannot contain spaces or special characters. A-Z, a-z, 0-9 and _ allowed.", 2000);
            return;
        } else if($scope.newEntity.properties.length == 0) {
            toast("An entity must have at least 1 property.", 2000);
            return;
        }

        // Thorough property validation.
        for(var i = 0; i < $scope.newEntity.properties.length; i++) {
            var property = $scope.newEntity.properties[i];
            if(property.name == "") {
                toast("Property name of property " + (i + 1) + " cannot be blank.", 2000);
                return;
            } else if(alphaNumericUnderscoreRegex.test(property.name) != true) {
                toast(property.name + " is an invalid property name.", 2000);
                return;
            } else if(property.type != "string" && property.type != "number" && property.type != "date") {
                toast(property.type + " is an invalid property value.", 2000);
                return;
            }
        }
        $("#confirmAddModal").openModal();
    }

    $scope.retryCount = 0;

    $scope.confirmSave = function() {
        toast("Saving...", 1000);
        RequestService.createEntity($scope.newEntity, onSuccess, onFailure);

        function onSuccess(entity, statusCode) {
            if(statusCode == 200) {
                $scope.$broadcast("RefreshEntityList");
                $scope.$broadcast("ViewEntity", entity);
                $scope.hideAddEntity();
                toast("Entity saved!", 1000);
                $("#confirmAddModal").closeModal();
            }
        }

        function onFailure(data, statusCode) {
            if($scope.retryCount == 5) {
                toast("We failed 5th time. Something's really wrong.", 2000);
                return;
            }
            toast("Oops... Something went wrong. We'll try again in a moment.", 2000);
            setTimeout($scope.confirmSave, 2000);
            $scope.retryCount++;
        }
    }
});