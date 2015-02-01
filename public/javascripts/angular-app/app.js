var apiFactoryApp = angular.module("APIFactoryWeb", ["ngRoute", "Shared", "Main", "Entities"]);

apiFactoryApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/entities', {
                templateUrl: 'partials/entities.partial.html',
                controller: 'EntityController'
            }).
            otherwise({
                redirectTo: '/entities'
            });
    }
]);

apiFactoryApp.directive('materialDropdown',  ['$rootScope', function($rootScope) {
    return {
        restrict: 'EA',
        link: function(scope, iElement, attrs) {
            var element = $(iElement);
            element.dropdown({
                    constrain_width: false, // Does not change width of dropdown to that of the activator
                    hover: false // Activate on click
                }
            );
            element.click(function() {
                console.log("Clicked!");
                var dropdown = element.next();
                dropdown.show();
                var height = dropdown.css('height');
                dropdown.css('height', '0');
                dropdown.animate({
                    'opacity': '1',
                    'height': height
                });
            })
            console.log("Applied");
        }
    };
}]);