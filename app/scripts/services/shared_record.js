'use strict';

angular.module('ipv6App')
     .service('SharedRecord', ['record', function SharedRecord(Record) {
     return new Record();
}]);
