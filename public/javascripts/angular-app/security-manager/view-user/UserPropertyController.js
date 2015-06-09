var propertiesModule = angular.module("Users");
propertiesModule.controller("UserPropertyController", function($scope, $timeout, $http, RequestService) {

    $scope.allowedActions = ["read", "create", "update", "delete"];
    $scope.allowedRealms = ["entity", "user", "instance"];

    $scope.$on("NewUserCreateStart", function(event) {
        $scope.user = $scope.$parent.newUser;
    })

    $scope.$on("ViewUser", function(event, user) {
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

    $scope.removePropertyAt = function(index) {
        if($scope.$parent.newUser.basePermissions.length == 1) {
            toast("A standard user must have at least one permission.", 3000);
            return;
        }

        $scope.$parent.newUser.basePermissions.splice(index, 1);
        toast("Permission removed.", 1000);
    };

    $scope.drawAttention = function(item, index) {
        if(item == "permission") {
            $scope.$parent.newUser.basePermissions[index].attention = true;
            $timeout(function() {
                $scope.$parent.newUser.basePermissions[index].attention = undefined;
            }, 300);
        }
    }

    $scope.$on("AddPermission", function() {
        var basePermissions = $scope.$parent.newUser.basePermissions;
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

        $scope.$parent.newUser.basePermissions.push({
            action: "",
            realm: ""
        });

        toast("New property added!", 1000);
    });

    $scope.i = 0;
});