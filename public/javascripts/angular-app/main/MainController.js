var mainModule = angular.module("Main");
mainModule.controller("MainController", function($scope, RequestService) {

    RequestService.getMyUserObject(function(user) {
        $scope.myuser = user;
        console.log(user);
    }, function(data, statusCode) {

    });

    $scope.currentSection = "entities";

    $scope.goto = function(location) {
        window.location.href = "#/".concat(location);
        $('#slide-out').sideNav('hide');
    };

    $scope.gotoUrl = function(location, newWindow) {
        if(newWindow == undefined) {
            window.open(location, '_blank');
        } else if(newWindow == false) {
            window.location.href = location;
        }
        $('#slide-out').sideNav('hide');
    }
});