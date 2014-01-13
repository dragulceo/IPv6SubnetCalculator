'use strict';

angular.module('ipv6App')
     .service('History', ["$cookieStore", function History($cookieStore) {
     var save, find, history = $cookieStore.get("history") || [];
     if (!angular.isArray(history)) {
          history = [];
     }
     save = function() {
          $cookieStore.put("history", history);
     };
     find = function(record) {
          var n = history.length,
               item;
          while (n--) {
               item = history[n];
               if (item.ipv6 === record.ipv6 && item.mask1 === record.mask1 && item.mask2 === record.mask2 && item.index === record.index && item.page === record.page && item.type === record.type) {
                    return n;
               }
          }
          return -1;
     };
     return {
          getRecords: function() {
               return history;
          },
          addRecord: function(record) {
               if (find(record) === -1) {
                    history.push(record);
                    save();
                    return true;
               }
               return false;
          },
          removeRecord: function(record) {
               var index = find(record);
               if (index != -1) {
                    history.splice(index, 1);
                    save();
               }
          }
     };
}]);
