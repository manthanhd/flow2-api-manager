var mainModule = angular.module("Main");
mainModule.controller("MainController", function($scope) {
    $scope.currentSection = "entities";

    $scope.goto = function(location) {
        window.location.href = "#/".concat(location);
        $('#slide-out').sideNav('hide');
    }

    $scope.gotoUrl = function(location, newWindow) {
        if(newWindow == undefined) {
            window.open(location, '_blank');
        } else if(newWindow == false) {
            window.location.href = location;
        }
        $('#slide-out').sideNav('hide');
    }
});