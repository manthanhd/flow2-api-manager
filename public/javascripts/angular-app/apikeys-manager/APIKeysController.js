var entitiesModule = angular.module("APIKeys");

entitiesModule.controller("APIKeysController", function($scope, RequestService) {
    $scope.$on("ViewKey", function(event, key) {
        $scope.key = key;
    });

    $scope.showAddKey = function(force) {
        $scope.cancelSearchBar();
        if($scope.newKey) {  // This will happen if the user flicks to the search screen and then decides to head back to the add screen.
            $scope.enableKeyAdd = true;
            return;
        }

        if($scope.newKey && !force) {
            $('#confirmResetKey').openModal();
            return;
        }

        var defaultPermissions;
        if($scope.myuser.isAdmin == false) {
            defaultPermissions = $scope.myuser.basePermissions;
        } else {
            defaultPermissions = [{action: "read", realm: "instance"}];
        }

        $scope.newKey = {
            name: "",
            active: "change1t",
            permissions: defaultPermissions
        };

        $scope.key = undefined;
        $scope.enableKeyAdd = true;
        $scope.$parent.$broadcast("NewKeyCreateStart");
    };

    $scope.hideAddKey = function(force) {
        if($scope.enableKeySearch) {
            $scope.enableKeyAdd = undefined;
            return;
        }

        if($scope.newKey && !force && $scope.newKey.name && $scope.newKey.name.length > 0) {
            $("#confirmCancelKeyCreation").openModal();
            return;
        }

        $scope.newKey = undefined;
        $scope.enableKeyAdd = undefined;
        $scope.$parent.$broadcast("NewKeyCreateEnd");
    };

    $scope.showSearchBar = function() {
        $scope.enableKeySearch = true;
        $scope.searchKeyNameText = "";
        $scope.hideAddKey();
    };

    $scope.cancelSearchBar = function() {
        if(!$scope.enableKeySearch) {
            return;
        }
        $scope.enableKeySearch = undefined;
        $scope.searchUserNameText = undefined;

        if($scope.newKey) {
            $scope.showAddKey();
        }
    };

    $scope.saveKey = function(force) {
        var alphaNumericUnderscoreRegex = new RegExp("^[A-Za-z0-9_]+$");
        if(alphaNumericUnderscoreRegex.test($scope.newKey.name) != true) {
            toast("API key name cannot contain spaces or special characters. A-Z, a-z, 0-9 and _ allowed.", 2000);
            return;
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
        RequestService.createAPIKey($scope.newKey, onSuccess, onFailure);

        function onSuccess(key, statusCode) {
            if(statusCode == 200) {
                $scope.retryCount = 0;
                $scope.$broadcast("RefreshKeysList");
                $scope.$broadcast("ViewKey", key);
                $scope.hideAddKey(true);
                toast("API key saved!", 1000);
                return $("#confirmAddModal").closeModal();
            }
        }

        function onFailure(data, statusCode) {
            if(statusCode == 409) {
                toast("Save failed. API key already exists!", 2000);
                return $("#confirmAddModal").closeModal();
            } else if(statusCode == 403) {
                toast("User is not authorised to save user.", 2000);
                $scope.hideAddKey(true);
                return $("#confirmAddModal").closeModal();
            }

            if($scope.retryCount == 5) {
                $scope.retryCount = 0;
                toast("We failed 5th time. Something\'s really wrong.", 2000);
                return;
            }
            toast("Oops... Something went wrong. We'll try again in a moment.", 2000);
            setTimeout($scope.confirmSave, 2000);
            $scope.retryCount++;
        }
    };

    $scope.broadcastAddPermission = function() {
        $scope.$parent.$broadcast("AddPermission");
    };
});