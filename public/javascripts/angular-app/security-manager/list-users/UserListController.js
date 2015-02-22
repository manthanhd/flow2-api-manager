var entitiesModule = angular.module("Users");
entitiesModule.controller("UserListController", function($scope, $http, RequestService) {
    RequestService.getUserList(onUserListSuccess, onUserListFailure);
    $scope.view = view;

    function onUserListSuccess(data, statusCode) {
        $scope.userList = data.userList;
    };

    function onUserListFailure(data, statusCode) {
        toast("Failed to load users.", 2000);
    };

    $scope.$on("RefreshUserList", function(event) {
        RequestService.getUserList(onUserListSuccess, onUserListFailure);
    });

    function view(entity) {
        if(!$scope.$parent.newUser) {
            $scope.$parent.$broadcast("ViewUser", entity);
        } else {
            toast("Cannot view user while a new user is being created.", 2000);
        }
    };

    $scope.userSearchFilter = function(user) {
        if($scope.$parent.searchUserNameText == undefined || $scope.$parent.searchUserNameText == "") {
            return true;
        }

        var lUserName = user.username.toLowerCase();
        var lSearchString = $scope.searchUserNameText.toLowerCase();
        var regex = new RegExp(lSearchString);
        if(regex.test(lUserName) == true) {
            return true;
        }
        return false;
    }
});

//entitiesModule.filter('entitySearchFilter', function() {
//    return function(entity, scope) {
//        console.log("filtering..");
//        if(!scope.$parent.searchEntityNameText) {
//            return true;
//        }
//
//        var lEntityName = entity.name.toLowerCase();
//        var lSearchString = $scope.$parent.searchEntityNameText.toLowerCase();
//        var regex = new RegExp(lSearchString);
//        if(regex.test(lEntityName) == true) {
//            return true;
//        }
//
//        return false;
//    }
//})