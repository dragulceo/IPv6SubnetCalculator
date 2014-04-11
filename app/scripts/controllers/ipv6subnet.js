'use strict';

angular.module('ipv6App')
     .controller('Ipv6subnetCtrl', ['$scope', '$routeParams', '$location', 'Ipv6util', 'Errors', 'SharedRecord',

function($scope, $routeParams, $location, ipv6util, errors, SharedRecord) {
     var validateMask;
     $scope.record = SharedRecord;

     $scope.$watch(function() {
          return $scope.record.getOneLine();
     }, function() {
          //$scope.oneLine = $scope.record.getOneLine();
          if ($scope.shouldShowSubnets()) {
               calculateSubnetsAndPages();
          }
     });

     function hasRecord() {
          return !!$scope.record && $scope.record.ipv6;
     }

     function calculateSubnetsAndPages() {
          if (!hasRecord()) {
               return;
          }
          var i = 0,
               page, pages = [],
               pagesNumber,
               record = $scope.record,
               prefixes = record.getPrefixes();
          $scope.subnets = prefixes.subnets;
          prefixes.pages = parseInt(prefixes.pages, 10);
          if (!$scope.record.page) {
               $scope.record.page = 0;
          }
          page = parseInt(record.page, 10) || 1;
          pagesNumber = prefixes.pages + 1;

          if (pagesNumber > 5) {
               if (page > 1) {
                    pages.splice(0, 0, "Prev");
               }
               pages.splice(1, 0, 1, 2);
               if (page === 1) {
                    pages.splice(pages.length, 0, '...');
               } else if (page === 2) {
                    pages.splice(pages.length, 0, page + 1, '...');
               } else if (page === 3) {
                    pages.splice(pages.length, 0, page, page + 1, '...');
               } else if (page > 2 && page < pagesNumber - 3) {
                    pages.splice(pages.length, 0, '...', page - 1, page, page + 1, '...');
               } else if (page === pagesNumber - 3) {
                    pages.splice(pages.length, 0, '...', page - 1, page);
               } else if (page === pagesNumber - 2) {
                    pages.splice(pages.length, 0, '...', page - 1);
               } else if (page === pagesNumber - 1) {
                    pages.splice(pages.length, 0, '...');
               }
               pages.splice(pages.length, 0, pagesNumber - 2, pagesNumber - 1);
               if (page < pagesNumber - 1) {
                    pages.splice(pages.length, 0, "Next");
               }
          } else if (pagesNumber > 1) {
               while (pagesNumber--) {
                    pages.push(i++);
               }
          }
          $scope.pages = pages;
     }

     $scope.ipAddress = function() {
          errors.resetErrors();
          if (hasRecord()) {
               return $scope.record.getIPv6();
          }
          return '---';
     };
     $scope.shouldShowIpAddress = function() {
          return $scope.record && $scope.record.ipv6 && $scope.record.isTypeIndex();
     };
     $scope.setPage = function(page) {
          if (page === "Next") {
               page = $scope.record.page + 1;
          } else if (page === "Prev") {
               page = Math.max($scope.record.page - 1, 1);
          } else if (page && !angular.isNumber(page)) {
               return;
          }
          $scope.record.page = page;
     };
     $scope.shouldShowSubnets = function() {
          return $scope.record && $scope.record.ipv6 && $scope.record.isTypeList();
     };

}]);
