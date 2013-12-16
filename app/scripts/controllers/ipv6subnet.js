'use strict';

angular.module('ipv6App')
     .controller('Ipv6subnetCtrl', ['$scope', '$routeParams', '$location', 'History', 'Ipv6util', 'Errors', 'record',

function($scope, $routeParams, $location, history, ipv6util, errors, Record) {
     var validateMask;

     function hasRecord() {
          return !!$scope.record;
     }

     function updateLocation(page) {
          if (hasRecord()) {
               if (page) {
                    $scope.record.page = parseInt(page, 10);
               }
               $location.path($scope.record.getUrl());
               //$location.replace();
          }
     }

     function getSubnets() {
          if (!hasRecord()) {
               return;
          }
          var i = 0,
               page, pages = [], pagesNumber,
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
console.log(pages);
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
          return $scope.record && $scope.record.ipv6 && $scope.record.index;
     };
     $scope.updateAddress = function() {
          if ($scope.shouldShowIpAddress()) {

          } else {
               //$scope.setPage(0);
          }
          if (hasRecord()) {
              updateLocation();
          }
     };
     $scope.setPage = function(page) {
          if (page === "Next") {
               page = $scope.record.page + 1;
          } else if (page === "Prev") {
               page = Math.max($scope.record.page - 1, 1);
          } else if (page && !angular.isNumber(page)) {
               return;
          }
          updateLocation(page);
     };
     $scope.getPageNumber = function(n) {
          if (angular.isNumber(n)) {
               return n;
          }
          return n;
     };
     $scope.shouldShowSubnets = function() {
          var ret = $scope.record && $scope.record.ipv6 && !$scope.record.index;
          if (ret) {
               getSubnets();
          }
          return ret;
     };
     $scope.setOneLine = function(record) {
          record = record || $scope.record;
          $scope.oneLine = record.getOneLine();
     };
     $scope.onOneLineChange = function(noLocation) {
          $scope.record.fromOneLine($scope.oneLine);
          //if (noLocation) {
          //     updateLocation();
          //}
          //$scope.setPage(0);
     };
     $scope.saveToHistory = function() {
          $scope.saveError = !history.addRecord($scope.record.exportObject());
          $scope.saveOk = !$scope.saveError;
     };

     if ($routeParams.ipv6) {
          /*     $scope.record = {
               ipv6: $routeParams.ipv6,
               mask1: parseInt($routeParams.mask1, 10),
               mask2: parseInt($routeParams.mask2, 10),
               index: parseInt($routeParams.index, 10)
          };
	 */
          if (!$scope.record) {
               $scope.record = new Record($routeParams);
          } else {
               $scope.record.initFromObject($routeParams);
          }
          $scope.setOneLine($scope.record);

          if (0) {
               $scope.onOneLineChange(true);
               if ($routeParams.index) {
                    $scope.ipAddress();
               } else {
                    getSubnets();
               }
          }
     }

}]);
