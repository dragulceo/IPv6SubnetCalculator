'use strict';

angular.module('ipv6App')
     .directive('ipv6onblur', ['$parse', function($parse) {
     return {
          restrict: 'A',
          link: function postLink(scope, element, attrs) {
               var fn = $parse(attrs.ipv6onblur);
               element.bind('blur', function(event) {
                    scope.$apply(function() {
                         fn(scope, {
                              $event: event
                         });
                    });
               });
          }
     };
}]);
