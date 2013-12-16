'use strict';

angular.module('ipv6App')
     .factory('record', ['Ipv6util', function(ipv6util) {

     var Record = function(init) {
          this.initFromObject(init);
     };

     Record.prototype.initFromObject = function(init) {
          var props = ['ipv6', 'mask1', 'mask2', 'page', 'index', 'result'],
               ints = {
                    page: true,
                    index: true
               },
			   key,
               n = props.length;
          while (n--) {
               key = props[n];
               if (key in init) {
                    if (key in ints) {
                         this[key] = parseInt(init[key], 10);
                    } else {
                         this[key] = init[key];
                    }
               }
          }
		  if(this.page === 0 || isNaN(this.page)) {
			this.page = 1;
		  }
     };
     Record.prototype.exportObject = function() {
          return {
               ipv6: this.ipv6,
               mask1: this.mask1,
               mask2: this.mask2,
               index: this.index,
               page: this.page,
               result: this.index ? this.getIPv6() : 0
          };
     };
     Record.prototype.getIPv6 = function() {
          return ipv6util.getSubnet(this.ipv6, this.mask1, this.mask2, this.index); //.replace(/(:0){2,}/, "::");
     };
     Record.prototype.getUrl = function() {
          var path;
          path = 'ip/' + this.ipv6 + '/' + this.mask1 + '/' + this.mask2;
          if (this.index) {
               path = path + '/index/' + this.index;
          } else if (this.page) {
               path = path + '/page/' + this.page;
          }
          return path;
     };
     Record.prototype.getOneLine = function() {
          return this.ipv6 + "/" + this.mask1 + " " + this.mask2 + (this.index ? (" " + this.index) : "");
     };
     Record.prototype.fromOneLine = function(str) {
          var sub, elems = str.split(" ");
          sub = (elems[0] || "").split("/");
          angular.extend(this, {
               ipv6: sub[0] || "0::0",
               mask1: parseInt(sub[1], 10) || 1,
               mask2: parseInt(elems[1], 10) || 1,
               page: 1,
               index: elems[2] //parseInt(elems[2], 10) || 0
          });
     };
     Record.prototype.getPrefixes = function() {
          return ipv6util.getListOfPrefixes(this.ipv6, this.mask1, this.mask2, this.page);
     };

     // Public API here
     return Record;
}]);
