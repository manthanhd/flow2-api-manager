var entitiesModule = angular.module("Users");
entitiesModule.controller("UserListController", function($scope, $http, RequestService) {
    RequestService.getUserList(onUserListSuccess, onUserListFailure);
    $scope.view = view;
    $scope.enableUser = enableUser;
    $scope.disableUser = disableUser;
    $scope.makeAdmin = makeAdmin;
    $scope.unmakeAdmin = unmakeAdmin;
    $scope.resetPassword = resetPassword;
    $scope.cancelResetPassword = cancelResetPassword;

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

    function disableUser(user) {
        if(user.isEnabled == false) {
            toast("User " + user.username + " is already disabled.", 2000);
            $scope.$parent.$broadcast("RefreshUserList");
            return;
        }

        RequestService.updateUser(user._id, {isEnabled: "false"}, function(data, statusCode) {
            $scope.$parent.$broadcast("RefreshUserList");
            toast("User " + user.username + " has been disabled successfully.", 2000);
        }, function(data, statusCode) {
            if(statusCode == 403 || statusCode == 401) {
                toast("Unable to make change. Access denied due to insufficient privileges.", 2000)
            } else {
                toast("Experiencing technical difficulties at the moment. Please try again.", 2000);
            }
        });
    }

    function enableUser(user) {
        if(user.isEnabled == true) {
            toast("User " + user.username + " is already enabled.", 2000);
            $scope.$parent.$broadcast("RefreshUserList");
            return;
        }

        RequestService.updateUser(user._id, {isEnabled: "true"}, function(data, statusCode) {
            $scope.$parent.$broadcast("RefreshUserList");
            toast("User " + user.username + " has been disabled successfully.", 2000);
        }, function(data, statusCode) {
            if(statusCode == 403 || statusCode == 401) {
                toast("Unable to make change. Access denied due to insufficient privileges.", 2000)
            } else {
                toast("Experiencing technical difficulties at the moment. Please try again.", 2000);
            }
        });
    }

    function makeAdmin(user) {
        if(user.isAdmin == true) {
            toast("User " + user.username + " is already admin.", 2000);
            $scope.$parent.$broadcast("RefreshUserList");
            return;
        }

        RequestService.updateUser(user._id, {isAdmin: "true"}, function(data, statusCode) {
            $scope.$parent.$broadcast("RefreshUserList");
            toast("User " + user.username + " is now an admin.", 2000);
        }, function(data, statusCode) {
            if(statusCode == 403 || statusCode == 401) {
                toast("Unable to make change. Access denied due to insufficient privileges.", 2000)
            } else {
                toast("Experiencing technical difficulties at the moment. Please try again.", 2000);
            }
        });
    }

    function unmakeAdmin(user) {
        if(user.isAdmin == false) {
            toast("User " + user.username + " is already not admin.", 2000);
            $scope.$parent.$broadcast("RefreshUserList");
            return;
        }

        RequestService.updateUser(user._id, {isAdmin: "false"}, function(data, statusCode) {
            $scope.$parent.$broadcast("RefreshUserList");
            toast("User " + user.username + " is not admin anymore.", 2000);
        }, function(data, statusCode) {
            if(statusCode == 403 || statusCode == 401) {
                toast("Unable to make change. Access denied due to insufficient privileges.", 2000)
            } else {
                toast("Experiencing technical difficulties at the moment. Please try again.", 2000);
            }
        });
    }

    function resetPassword(user) {
        if(user.hasBeenReset == true) {
            toast("User " + user.username + " has already been marked for password reset.", 2000);
            $scope.$parent.$broadcast("RefreshUserList");
            return;
        }

        RequestService.updateUser(user._id, {hasBeenReset: "true"}, function(data, statusCode) {
            $scope.$parent.$broadcast("RefreshUserList");
            toast("User " + user.username + " has been successfully marked for password reset.", 2000);
        }, function(data, statusCode) {
            if(statusCode == 403 || statusCode == 401) {
                toast("Unable to make change. Access denied due to insufficient privileges.", 2000)
            } else {
                toast("Experiencing technical difficulties at the moment. Please try again.", 2000);
            }
        });
    }

    function cancelResetPassword(user) {
        if(user.hasBeenReset == false) {
            toast("User " + user.username + " is not marked for password reset.", 2000);
            $scope.$parent.$broadcast("RefreshUserList");
            return;
        }

        RequestService.updateUser(user._id, {hasBeenReset: "false"}, function(data, statusCode) {
            $scope.$parent.$broadcast("RefreshUserList");
            toast("User " + user.username + " will not be prompted for password reset.", 2000);
        }, function(data, statusCode) {
            if(statusCode == 403 || statusCode == 401) {
                toast("Unable to make change. Access denied due to insufficient privileges.", 2000)
            } else {
                toast("Experiencing technical difficulties at the moment. Please try again.", 2000);
            }
        });
    }

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