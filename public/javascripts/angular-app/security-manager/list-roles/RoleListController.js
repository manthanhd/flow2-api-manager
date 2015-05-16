var instanceListModule = angular.module("Users");
instanceListModule.controller("RoleListController", function($scope, RequestService) {
    $scope.$on("ViewUser", function(event, user) {
        //RequestService.getInstanceList(entity.name, successHandler, failureHandler);
        $scope.roles = user.roles;
        console.log(user);
        $scope.roleString = JSON.stringify(user.roles, null, 4);
    });
});