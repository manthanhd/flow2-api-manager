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