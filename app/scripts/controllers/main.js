'use strict';

angular.module('ipv6App')
     .controller('MainCtrl', ['$scope', '$routeParams', '$location', '$timeout', 'History', 'SharedRecord',

function($scope, $routeParams, $location, $timeout, history, SharedRecord) {
     $scope.record = SharedRecord;

     $scope.$watch(function() {
          return $scope.record.getOneLine();
     }, function() {
          $scope.oneLine = $scope.record.getOneLine();
     });

     $scope.$watch(function() {
          return $scope.record.getUrl();
     }, function() {
          if ($scope.record.ipv6) {
               var $url = $scope.record.getUrl(true);
               $location.path($url);
          }
     });

	 /*$scope.$watch(function () {
		 return $location.path();
	 }, function () {
          $scope.record.initFromObject($routeParams);
	 });*/
     $scope.onOneLineChange = function() {
          $scope.record.fromOneLine($scope.oneLine);
     };
     $scope.saveToHistory = function() {
          $scope.saveError = !history.addRecord($scope.record.exportObject());
          $scope.saveOk = !$scope.saveError;
     };
     if ($routeParams.ipv6) {
          $scope.record.initFromObject($routeParams);
     }
}]);
