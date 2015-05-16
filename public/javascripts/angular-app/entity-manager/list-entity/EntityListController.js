var entitiesModule = angular.module("Entities");
entitiesModule.controller("EntityListController", function($scope, $http, RequestService) {
    RequestService.getEntityList(onEntityListSuccess, onEntityListFailure);
    $scope.view = view;
    $scope.activate = activate;
    $scope.deactivate = deactivate;
    $scope.deleteEntity = deleteEntity;

    function onEntityListSuccess(data, statusCode) {
        $scope.entityList = data.entityList;
    };

    function onEntityListFailure(data, statusCode) {
        toast("Failed to load entities.", 2000);
    };

    $scope.$on("RefreshEntityList", function(event) {
        RequestService.getEntityList(onEntityListSuccess, onEntityListFailure);
    });

    function view(entity) {
        if(!$scope.$parent.newEntity) {
            $scope.$parent.$broadcast("ViewEntity", entity);
        } else {
            toast("Cannot view entity while a new entity is being created.", 2000);
        }
    };

    function activate(entity) {
        console.log(entity._id);
        if(entity.active == false) {
            RequestService.updateEntity(entity._id, {active: true}, function(data, statusCode) {
                $scope.$parent.$broadcast("RefreshEntityList");
                toast("Entity " + entity.name + " was successfully activated.", 2000);
            }, function(data, statusCode) {
                if(statusCode == 404) {
                    toast("Lost server uplink. Please try again.", 2000);
                } else {
                    toast("Experiencing technical difficulties at the moment. Please try again later.", 2000);
                }
            })
        } else {
            toast("Entity is already active.", 2000);
        }
    };

    function deactivate(entity) {
        if(entity.active == true) {
            RequestService.updateEntity(entity._id, {active: false}, function(data, statusCode) {
                $scope.$parent.$broadcast("RefreshEntityList");
                toast("Entity " + entity.name + " was successfully deactivated.", 2000);
            }, function(data, statusCode) {
                if(statusCode == 404) {
                    toast("Lost server uplink. Please try again.", 2000);
                } else {
                    toast("Experiencing technical difficulties at the moment. Please try again later.", 2000);
                }
            })
        } else {
            toast("Entity is already deactive.", 2000);
        }
    };

    function deleteEntity(entity) {
        if(entity != undefined) {
            RequestService.deleteEntity(entity._id, function(data, statusCode) {
                $scope.$parent.$broadcast("RefreshEntityList");
                toast("Entity " + entity.name + " and all its associated instances have been deleted.", 2000);
            }, function(data, statusCode) {
                if(statusCode == 404) {
                    toast("Lost server uplink. Please try again.", 2000);
                } else {
                    toast("Experiencing technical difficulties at the moment. Please try again later.", 2000);
                }
            });
        } else {
            $scope.$parent.$broadcast("RefreshEntityList");
        }
    }

    $scope.entitySearchFilter = function(entity) {
        if($scope.$parent.searchEntityNameText == undefined || $scope.$parent.searchEntityNameText == "") {
            return true;
        }

        var lEntityName = entity.name.toLowerCase();
        var lSearchString = $scope.searchEntityNameText.toLowerCase();
        var regex = new RegExp(lSearchString);
        if(regex.test(lEntityName) == true) {
            return true;
        }
        return false;
    }
});