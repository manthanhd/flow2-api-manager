var propertiesModule = angular.module("APIKeys");
propertiesModule.controller("APIKeyPropertyController", function($scope, $timeout, $http, RequestService) {

    $scope.allowedActions = ["read", "create", "update", "delete"];
    $scope.allowedRealms = ["entity", "user", "instance"];

    $scope.$on("NewKeyCreateStart", function(event) {
        $scope.hidePermissionsPanel();
        $scope.$parent.editKey = undefined;
    });

    $scope.$on("NewKeyCreateEnd", function(event) {
        $scope.hidePermissionsPanel();
    });

    $scope.$on("ViewKey", function(event, key) {
        if(!$scope.$parent.editKey) {
            $scope.hidePermissionsPanel();
        }
        $scope.key = key;
    });

    $scope.initializeMaterialSelect = function() {
        $('select').material_select();
    };

    $scope.showPermissionsPanel = function() {
        $scope.$parent.permissionsPanel = true;
    };

    $scope.hidePermissionsPanel = function() {
        $scope.$parent.permissionsPanel = undefined;
    };

    $scope.cancelManagePermissions = function() {
        $scope.$parent.permissionsPanel = undefined;
        $scope.$parent.editKey = undefined;
        $scope.$parent.$broadcast("RefreshKeysList");
    };

    $scope.removePropertyAt = function(index) {
        var ky = $scope.$parent.newKey || $scope.key;
        var permissions = ky.permissions;
        if(permissions.length == 1) {
            toast("A key must have at least one permission.", 3000);
            return;
        }

        permissions.splice(index, 1);
        toast("Permission removed.", 1000);
    };

    $scope.drawAttention = function(item, index) {
        if(item == "permission") {
            var key = $scope.$parent.newKey || $scope.key;
            key.permissions[index].attention = true;
            $timeout(function() {
                key.permissions[index].attention = undefined;
            }, 300);
        }
    }

    $scope.$on("AddPermission", function() {
        var permissions;// = $scope.$parent.newUser.basePermissions || $scope.user.basePermissions;
        if($scope.$parent.newKey) {
            permissions = $scope.$parent.newKey.permissions;
        } else {
            permissions = $scope.key.permissions;
        }

        if(permissions.length == 12) {
            return toast("Cannot add more than 12 permissions.", 2000);
        }

        for(var i = 0; i < permissions.length; i++) {
            var permission = permissions[i];
            if(permission.action == "" || permission.realm == "") {
                $scope.drawAttention("permission", i);
                return toast("Permission cannot be blank.", 2000);
            }
        }

        permissions.push({
            action: "",
            realm: ""
        });

        console.log(permissions);

        toast("New permission added!", 1000);
    });

    /*$scope.updateUserPermissions = function(user) {
        toast("Updating user permissions for " + user.username + "...", 2000);
        return RequestService.updateUser(user._id, {basePermissions: user.basePermissions}, function(data, statusCode) {
            $scope.$parent.$broadcast("RefreshUserList");
            $scope.$parent.editUser = undefined;
            return toast("Permissions updated successfully for user " + user.username, 2000);
        }, function(data, statusCode) {
            if(statusCode == 403) {
                toast("User is not authorised to modify user.", 2000);
            } else {
                toast("Experiencing technical difficulties at the moment. Please try again.", 2000);
            }
        })
    }*/

    $scope.i = 0;
});