var app = angular.module("EAG_Home", ["Controllers", "angular-loading-bar"]);

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13 || event.which == 9) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                if(event.which != 9)
                  event.preventDefault();
            }
        });
    };
});