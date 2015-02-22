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

    //$scope.$evalAsync(function() {
    //    $('select').material_select();
    //});
    $scope.i = 0;

    //$scope.$on("AddProperty", function() {
    //    $scope.$parent.newEntity.properties.push({
    //        name: "",
    //        type: "string",
    //        required: true
    //    });
    //
    //    //$timeout(function() {   // Runs after DOM has been rendered.
    //    //    console.log($scope.i++);
    //    //    $('select').material_select();
    //    //});
    //
    //    toast("New property added!", 1000);
    //});

    //$scope.removePropertyAt = function(index) {
    //    if($scope.$parent.newEntity.properties.length == 1) {
    //        toast("An entity must have at least one property.", 3000);
    //        return;
    //    }
    //
    //    $scope.$parent.newEntity.properties.splice(index, 1);
    //    toast("Property removed.", 1000);
    //}

    //$scope.getTypes = function() {
    //    $http.get('/entity/metadata/types').success(function(data, statusCode) {
    //        if(statusCode == 200) {
    //            $scope.supportedTypes = data.typeList;
    //        }
    //        console.log($scope.supportedTypes);
    //
    //        //$scope.resetNewEntity();
    //    });
    //}
    //
    //$scope.getTypes();
});