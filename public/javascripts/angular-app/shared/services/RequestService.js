var sharedModule = angular.module("Shared");
sharedModule.service("RequestService", function($http) {

    function getAuthToken($http) {

        $http.get('/user/authenticate')
    }

    this.getEntityList = function(onSuccess, onFailure) {
        $http.get("/entity").success(function(data, statusCode) {
            onSuccess(data, statusCode);
        }).error(function(data, statusCode) {
            if(statusCode == 403 && data && data.errorCode == 403 && data.error == "AuthenticationRequired") {
                window.location.href = "/user/login";
            } else {
                onFailure(data, statusCode);
            }
        });
    };

    this.getInstanceList = function(entityName, onSuccess, onFailure) {
        $http.get("/instance/" + entityName).success(function(data, statusCode) {
            onSuccess(data, statusCode);
        }).error(function(data, statusCode) {
            if(statusCode == 403 && data && data.errorCode == 403 && data.error == "AuthenticationRequired") {
                window.location.href = "/user/login";
            } else {
                onFailure(data, statusCode);
            }
        });
    }

    this.createEntity = function(entity, onSuccess, onFailure) {
        $http.post("/entity", entity).success(function(data, statusCode) {
            onSuccess(data, statusCode);
        }).error(function(data, statusCode) {
            if(statusCode == 403 && data && data.errorCode == 403 && data.error == "AuthenticationRequired") {
                window.location.href = "/user/login";
            } else {
                onFailure(data, statusCode);
            }
        });
    }

    this.getUserList = function(onSuccess, onFailure) {
        $http.get("/user").success(function(data, statusCode) {
            onSuccess(data, statusCode);
        }).error(function(data, statusCode) {
            if(statusCode == 403 && data && data.errorCode == 403 && data.error == "AuthenticationRequired") {
                window.location.href = "/user/login";
            } else {
                onFailure(data, statusCode);
            }
        });
    };

    this.createUser = function(user, onSuccess, onFailure) {
        $http.post("/user", user).success(function(data, statusCode) {
            onSuccess(data, statusCode);
        }).error(function(data, statusCode) {
            if(statusCode == 403 && data && data.errorCode == 403 && data.error == "AuthenticationRequired") {
                window.location.href = "/user/login";
            } else {
                onFailure(data, statusCode);
            }
        });
    }

    this.createInstance = function(entityName, instanceObject, onSuccess, onFailure) {
        $http.post("/instance/" + entityName, instanceObject).success(function(data, statusCode) {
            onSuccess(data, statusCode);
        }).error(function(data, statusCode) {
            if(statusCode == 403 && data && data.errorCode == 403 && data.error == "AuthenticationRequired") {
                window.location.href = "/user/login";
            } else {
                onFailure(data, statusCode);
            }
        });
    }

    this.updateEntity = function(entityId, updateAttributeObject, onSuccess, onFailure) {
        $http.put("/entity/" + entityId, updateAttributeObject).success(function(data, statusCode) {
            onSuccess(data, statusCode);
        }).error(function(data, statusCode) {
            if(statusCode == 403 && data && data.errorCode == 403 && data.error == "AuthenticationRequired") {
                window.location.href = "/user/login";
            } else {
                onFailure(data, statusCode);
            }
        });
    }

    this.deleteEntity = function(entityId, onSuccess, onFailure) {
        $http.delete("/entity/" + entityId).success(function(data, statusCode) {
            onSuccess(data, statusCode);
        }).error(function(data, statusCode) {
            if(statusCode == 403 && data && data.errorCode == 403 && data.error == "AuthenticationRequired") {
                window.location.href = "/user/login";
            } else {
                onFailure(data, statusCode);
            }
        });
    }

    this.updateUser = function(userId, updateAttributeObject, onSuccess, onFailure) {
        $http.put("/user/" + userId, updateAttributeObject).success(function(data, statusCode) {
            onSuccess(data, statusCode);
        }).error(function(data, statusCode) {
            if(statusCode == 403 && data && data.errorCode == 403 && data.error == "AuthenticationRequired") {
                window.location.href = "/user/login";
            } else {
                onFailure(data, statusCode);
            }
        });
    }

    this.deleteUser = function(userId, onSuccess, onFailure) {
        $http.delete("/user/" + userId).success(function(data, statusCode) {
            onSuccess(data, statusCode);
        }).error(function(data, statusCode) {
            if(statusCode == 403 && data && data.errorCode == 403 && data.error == "AuthenticationRequired") {
                window.location.href = "/user/login";
            } else {
                onFailure(data, statusCode);
            }
        });
    }

});