var instanceListModule = angular.module("Users");
instanceListModule.controller("RoleListController", function($scope, RequestService) {
    $scope.$on("ViewUser", function(event, user) {
        //RequestService.getInstanceList(entity.name, successHandler, failureHandler);
        $scope.roles = user.roles;
        console.log(user);
        $scope.roleString = JSON.stringify(user.roles, null, 4);
    });

    //$scope.$on("Refresh", function(event, entity) {
    //    //RequestService.getInstanceList(entity.name, successHandler, failureHandler);
    //});
    //
    //
    //function successHandler(data, statusCode) {
    //    $scope.instances = data.instanceList;
    //    $scope.instanceString = JSON.stringify(data.instanceList, null, 4);
    //}
    //
    //function failureHandler(data, statusCode) {
    //
    //}
});