var app = angular.module("APIKeys", []);
app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    if(scope[attr.onFinishRender]) {
                        scope[attr.onFinishRender]();
                    }
                });
            }
        }
    }
});