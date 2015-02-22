var entitiesModule = angular.module("Users");

entitiesModule.controller("UserController", function($scope, RequestService) {
    $scope.$on("ViewUser", function(event, user) {
        $scope.user = user;
    });

    //$scope.showEntityDocumentationModal = function() {
    //    $("#entityDocumentationModal").openModal();
    //}

    $scope.showAddUser = function(force) {
        $scope.cancelSearchBar();
        if($scope.newUser) {  // This will happen if the user flicks to the search screen and then decides to head back to the add screen.
            $scope.enableUserAdd = true;
            return;
        }

        if($scope.newUser && !force) {
            //toast("<span>Reset</span><a class='btn-flat yellow-text' href='#'>Confirm<a>", 5000)
            $('#confirmResetUser').openModal();
            return;
        }
        $scope.newUser = {
            username: "",
            password: "change1t",
            hasBeenReset: true,
            isAdmin: false,
            isEnabled: true,
            roles: []
        };
        $scope.user = undefined;
        $scope.enableUserAdd = true;
    };

    $scope.hideAddUser = function(force) {
        if($scope.enableUserSearch) {
            $scope.enableUserAdd = undefined;
            return;
        }

        if($scope.newUser && !force) {
            $("#confirmCancelUserCreation").openModal();
            return;
        }

        $scope.newUser = undefined;
        $scope.enableUserAdd = undefined;
    };

    $scope.showSearchBar = function() {
        $scope.enableUserSearch = true;
        $scope.searchUserNameText = "";
        $scope.hideAddUser();
    };

    $scope.cancelSearchBar = function() {
        if(!$scope.enableUserSearch) {
            return;
        }
        $scope.enableUserSearch = undefined;
        $scope.searchUserNameText = undefined;

        if($scope.newUser) {
            $scope.showAddUser();
        }
    };

    $scope.saveUser = function(force) {
        var alphaNumericUnderscoreRegex = new RegExp("^[A-Za-z0-9_]+$");
        if(alphaNumericUnderscoreRegex.test($scope.newUser.username) != true) {
            toast("Username cannot contain spaces or special characters. A-Z, a-z, 0-9 and _ allowed.", 2000);
            return;
        } else if($scope.newUser.password == "" || $scope.newUser.password.length < 6) {
            toast("Password must be at least 6 characters in length.", 2000);
            return;
        }

        //// Thorough property validation.
        //for(var i = 0; i < $scope.newEntity.properties.length; i++) {
        //    var property = $scope.newEntity.properties[i];
        //    console.log("'" + property.name + "'");
        //    if(property.name == "") {
        //        toast("Property name of property " + (i + 1) + " cannot be blank.", 2000);
        //        return;
        //    } else if(alphaNumericUnderscoreRegex.test(property.name) != true) {
        //        toast(property.name + " is an invalid property name.", 2000);
        //        return;
        //    } else if(property.type != "string" && property.type != "number" && property.type != "date") {
        //        toast(property.type + " is an invalid property value.", 2000);
        //        return;
        //    }
        //}
        if(!force) {
            $("#confirmAddModal").openModal();
        } else {
            $scope.confirmSave();
        }
    };

    $scope.retryCount = 0;

    $scope.confirmSave = function() {
        toast("Saving...", 1000);
        RequestService.createUser($scope.newUser, onSuccess, onFailure);

        function onSuccess(entity, statusCode) {
            if(statusCode == 200) {
                $scope.$broadcast("RefreshUserList");
                $scope.$broadcast("ViewUser", entity);
                $scope.hideAddUser(true);
                toast("User saved!", 1000);
                $("#confirmAddModal").closeModal();
            }
        }

        function onFailure(data, statusCode) {
            if($scope.retryCount == 5) {
                toast("We failed 5th time. Something's really wrong.", 2000);
                return;
            }
            toast("Oops... Something went wrong. We'll try again in a moment.", 2000);
            setTimeout($scope.confirmSave, 2000);
            $scope.retryCount++;
        }
    };

    //$scope.broadcastAddProperty = function() {
    //    if($scope.newUser) {
    //        $scope.$parent.$broadcast("AddProperty");
    //    }
    //}
});