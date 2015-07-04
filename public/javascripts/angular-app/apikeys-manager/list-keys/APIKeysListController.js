var entitiesModule = angular.module("APIKeys");
entitiesModule.controller("APIKeysListController", function($scope, $http, RequestService) {
    RequestService.getMyApiKeys(onGetMyAPIKeysSuccess, onGetMyAPIKeysFailure);
    $scope.view = view;
    $scope.activateKey = activateKey;
    $scope.deactivateKey = deactivateKey;
    $scope.deleteKey = deleteKey;
    $scope.managePermissions = managePermissions;

    function managePermissions(key) {
        if($scope.$parent.newKey != undefined) {
            return toast("Cannot edit permissions of a key while creating a new one.", 2000);
        }
        $scope.$parent.permissionsPanel = true;
        $scope.$parent.editKey = true;
        $scope.$parent.$broadcast("ViewKey", key);
    }

    function onGetMyAPIKeysSuccess(data, statusCode) {
        $scope.keyList = data.apiKeys;
    }

    function onGetMyAPIKeysFailure(data, statusCode) {
        if(statusCode == 403) {
            toast("User is not authorised to view API keys.", 2000);
        } else {
            toast("Failed to load API keys.", 2000);
        }
    }

    $scope.$on("RefreshKeysList", function(event) {
        RequestService.getMyApiKeys(onGetMyAPIKeysSuccess, onGetMyAPIKeysFailure);
    });

    function view(key) {
        if(!$scope.$parent.newKey) {
            $scope.$parent.$broadcast("ViewKey", key);
        } else {
            toast("Cannot view key while a new key is being created.", 2000);
        }
    };

    function deactivateKey(key) {
        if(key.active == false) {
            toast("Key " + user.username + " has already been deactivated.", 2000);
            $scope.$parent.$broadcast("RefreshKeysList");
            return;
        }

        RequestService.deactivateKey(key._id, {active: "false"}, function(data, statusCode) {   // TBW
            $scope.$parent.$broadcast("RefreshKeysList");
            toast("Key " + key.name + " has been deactivated successfully.", 2000);
        }, function(data, statusCode) {
            if(statusCode == 403) {
                toast("User is not authorised to modify key.", 2000);
            } else {
                toast("Experiencing technical difficulties at the moment. Please try again.", 2000);
            }
        });
    }

    function activateKey(key) {
        if(user.active == true) {
            toast("Key " + key.name + " is already active.", 2000);
            $scope.$parent.$broadcast("RefreshKeyList");
            return;
        }

        RequestService.activateKey(key._id, {active: "true"}, function(data, statusCode) {
            $scope.$parent.$broadcast("RefreshKeysList");
            toast("Key " + key.name + " has been activated successfully.", 2000);
        }, function(data, statusCode) {
            if(statusCode == 403) {
                toast("User is not authorised to modify key.", 2000);
            } else {
                toast("Experiencing technical difficulties at the moment. Please try again.", 2000);
            }
        });
    }

    function deleteKey(key) {
        RequestService.deleteKey(key._id, function(data, statusCode) {
            $scope.$parent.$broadcast("RefreshKeysList");
            toast("Key " + key.name + " has been deleted successfully.", 2000);
        }, function(data, statusCode) {
            if(statusCode == 403) {
                toast("User is not authorised to delete key.", 2000);
            } else {
                toast("Experiencing technical difficulties at the moment. Please try again.", 2000);
            }
        });
    }

    $scope.userSearchFilter = function(key) {
        if($scope.$parent.searchKeyNameText == undefined || $scope.$parent.searchKeyNameText == "") {
            return true;
        }

        var lKeyName = key.name.toLowerCase();
        var lSearchString = $scope.searchKeyNameText.toLowerCase();
        var regex = new RegExp(lSearchString);
        if(regex.test(lKeyName) == true) {
            return true;
        }
        return false;
    }

    $scope.copyToClipboard = function(text) {
        window.prompt("Copy to clipboard: Ctrl + C, Enter", text);
    }
});