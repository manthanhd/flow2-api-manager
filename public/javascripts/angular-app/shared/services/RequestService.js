var sharedModule = angular.module("Shared");
sharedModule.service("RequestService", function($http) {
    this.getEntityList = function(onSuccess, onFailure) {
        $http.get("/entity").success(function(data, statusCode) {
            onSuccess(data, statusCode);
        }).error(function(data, statusCode) {
            if(statusCode == 403 && data && data.errorCode == 403 && data.error == "LoginRequired") {
                window.location.href = "/user/login";
            } else {
                onFailure(data, statusCode);
            }
        });
    };

    this.getInstanceList = function(entityName, onSuccess, onFailure) {
        $http.get("/EAG/access/" + entityName).success(function(data, statusCode) {
            onSuccess(data, statusCode);
        }).error(function(data, statusCode) {
            if(statusCode == 403 && data && data.errorCode == 403 && data.error == "LoginRequired") {
                window.location.href = "/user/login";
            } else {
                onFailure(data, statusCode);
            }
        });
    }
});