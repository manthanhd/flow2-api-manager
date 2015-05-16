var mainModule = angular.module("Main");
mainModule.controller("MainController", function($scope) {
    $scope.currentSection = "entities";

    $scope.goto = function(location) {
        window.location.href = "#/".concat(location);
        $('#slide-out').sideNav('hide');
    }

    $scope.gotoUrl = function(location) {
        window.open(location, '_blank');
        $('#slide-out').sideNav('hide');
    }
});