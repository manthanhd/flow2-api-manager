var propertiesModule = angular.module("Users");
propertiesModule.controller("UserPropertyController", function($scope, $timeout, $http, RequestService) {

    $scope.$on("NewUserCreateStart", function(event) {
        $scope.user = $scope.$parent.newUser;
    })

    $scope.$on("ViewUser", function(event, user) {
        $scope.user = user;
    });

    $scope.initializeMaterialSelect = function() {
        $('select').material_select();
    };

    $scope.i = 0;
});