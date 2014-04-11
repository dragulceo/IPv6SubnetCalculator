'use strict';

describe('Controller: HistoryCtrl', function() {

     // load the controller's module
     beforeEach(module('ipv6App'));

     var HistoryCtrl,
     scope, Record, history, record, location;

     // Initialize the controller and a mock scope
     beforeEach(inject(function($controller, $rootScope) {
          scope = $rootScope.$new();
          Record = function() {
               this.getUrl = function() {
                    return 'url';
               };
          };
          history = {
               removeRecord: function() {},
               getRecords: function() {
                    return [0, 1, 2, 3, 4];
               }
          };
          record = {};
          location = {
               path: function() {
                    return true;
               }
          };
          HistoryCtrl = $controller('HistoryCtrl', {
               $scope: scope,
               $location: location,
               record: Record,
               History: history
          });
          spyOn(location, 'path');
          spyOn(history, 'removeRecord');
          spyOn(window, 'confirm').andReturn(true);
     }));

     it('should have history elems', function() {
          expect(scope.history.length).toBe(5);
     });

     it('should load some history', function() {
          scope.loadFromHistory(record);
          expect(location.path).toHaveBeenCalledWith('url');
     });

     it('should delete from history', function() {
          scope.deleteFromHistory(record);
          expect(window.confirm).toHaveBeenCalled();
          expect(history.removeRecord).toHaveBeenCalledWith(record);
     });
});
