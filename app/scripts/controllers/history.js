'use strict';

angular.module('ipv6App')
     .controller('HistoryCtrl', ['$scope', '$location','History', 'record', function($scope, $location, history, Record) {

     $scope.deleteFromHistory = function(record) {
          if (confirm('Are you sure you want to delete the record?')) {
               history.removeRecord(record);
          }
     };

     $scope.loadFromHistory = function(record) {
          $location.path((new Record(record)).getUrl());
     };

     $scope.history = history.getRecords();


}]);
