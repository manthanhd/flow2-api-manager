var propertiesModule = angular.module("Users");
propertiesModule.controller("UserPropertyController", function($scope, $timeout, $http, RequestService) {

    $scope.allowedActions = ["read", "create", "update", "delete"];
    $scope.allowedRealms = ["entity", "user", "instance"];

    $scope.$on("NewUserCreateStart", function(event) {
        $scope.hidePermissionsPanel();
        $scope.$parent.editUser = undefined;
    });

    $scope.$on("NewUserCreateEnd", function(event) {
        $scope.hidePermissionsPanel();
    });

    $scope.$on("ViewUser", function(event, user) {
        if(!$scope.$parent.editUser) {
            $scope.hidePermissionsPanel();
        }
        $scope.user = user;
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
        $scope.$parent.editUser = undefined;
        $scope.$parent.$broadcast("RefreshUserList");
    };

    $scope.removePropertyAt = function(index) {
        var usr = $scope.$parent.newUser || $scope.user;
        var basePermissions = usr.basePermissions;
        if(basePermissions.length == 1) {
            toast("A standard user must have at least one permission.", 3000);
            return;
        }

        basePermissions.splice(index, 1);
        toast("Permission removed.", 1000);
    };

    $scope.drawAttention = function(item, index) {
        if(item == "permission") {
            var user = $scope.$parent.newUser || $scope.user;
            user.basePermissions[index].attention = true;
            $timeout(function() {
                user.basePermissions[index].attention = undefined;
            }, 300);
        }
    }

    $scope.$on("AddPermission", function() {
        var basePermissions;// = $scope.$parent.newUser.basePermissions || $scope.user.basePermissions;
        if($scope.$parent.newUser) {
            basePermissions = $scope.$parent.newUser.basePermissions;
        } else {
            basePermissions = $scope.user.basePermissions;
        }

        if(basePermissions.length == 12) {
            return toast("Cannot add more than 12 permissions.", 2000);
        }

        for(var i = 0; i < basePermissions.length; i++) {
            var basePermission = basePermissions[i];
            if(basePermission.action == "" || basePermission.realm == "") {
                $scope.drawAttention("permission", i);
                return toast("Permission cannot be blank.", 2000);
            }
        }

        basePermissions.push({
            action: "",
            realm: ""
        });

        console.log(basePermissions);

        toast("New permission added!", 1000);
    });

    $scope.updateUserPermissions = function(user) {
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
    }

    $scope.i = 0;
});