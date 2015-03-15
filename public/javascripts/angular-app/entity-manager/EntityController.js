var entitiesModule = angular.module("Entities");

entitiesModule.controller("EntityController", function($scope, RequestService) {
    $scope.$on("ViewEntity", function(event, entity) {
        $scope.entity = entity;
    });

    $scope.showEntityDocumentationModal = function() {
        $("#entityDocumentationModal").openModal();
    }

    $scope.showAddEntity = function(force) {
        $scope.cancelSearchBar();
        if($scope.newEntity) {  // This will happen if the user flicks to the search screen and then decides to head back to the add screen.
            $scope.enableEntityAdd = true;
            return;
        }

        if($scope.newEntity && !force) {
            //toast("<span>Reset</span><a class='btn-flat yellow-text' href='#'>Confirm<a>", 5000)
            $('#confirmResetEntity').openModal();
            return;
        }
        $scope.newEntity = {
            name: "",
            properties: [{
                name: "",
                type: "string"
            }]
        };
        $scope.entity = undefined;
        $scope.enableEntityAdd = true;
    };

    $scope.hideAddEntity = function(force) {
        if($scope.enableEntitySearch) {
            $scope.enableEntityAdd = undefined;
            return;
        }

        if($scope.newEntity && !force) {
            $("#confirmCancelEntityCreation").openModal();
            return;
        }

        $scope.newEntity = undefined;
        $scope.enableEntityAdd = undefined;
    };

    $scope.showSearchBar = function() {
        $scope.enableEntitySearch = true;
        $scope.searchEntityNameText = "";
        $scope.hideAddEntity();
    };

    $scope.cancelSearchBar = function() {
        if(!$scope.enableEntitySearch) {
            return;
        }
        $scope.enableEntitySearch = undefined;
        $scope.searchEntityNameText = undefined;

        if($scope.newEntity) {
            $scope.showAddEntity();
        }
    };

    $scope.saveEntity = function(force) {
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
            console.log("'" + property.name + "'");
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
        if(!force) {
            $("#confirmAddModal").openModal();
        } else {
            $scope.confirmSave();
        }
    };

    $scope.retryCount = 0;

    $scope.confirmSave = function() {
        toast("Saving...", 1000);
        RequestService.createEntity($scope.newEntity, onSuccess, onFailure);

        function onSuccess(entity, statusCode) {
            if(statusCode == 200) {
                $scope.$broadcast("RefreshEntityList");
                $scope.$broadcast("ViewEntity", entity);
                $scope.hideAddEntity(true);
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
    };

    $scope.broadcastAddProperty = function() {
        if($scope.newEntity) {
            $scope.$parent.$broadcast("AddProperty");
        }
    }
});