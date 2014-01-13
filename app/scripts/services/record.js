'use strict';

angular.module('ipv6App')
     .factory('record', ['Ipv6util', function(ipv6util) {

     var Record,
     FORMAT = /[a-f0-9:]+\/[0-9]+ [0-9]+( ([0-9]+|p[0-9]+)){1}/i,
          FORMAT_LIST = / p[0-9]+\s*$/i,
          TYPE_LIST = 1,
          TYPE_INDEX = 2;

     Record = function(init) {
          this.initFromObject(init || {});
     };

     Record.prototype.initFromObject = function(init) {
          var props = ['ipv6', 'mask1', 'mask2', 'page', 'index', 'result', 'type'],
               ints = {
                    page: true,
                    index: true,
                    type: true
               },
               key,
               value,
               n = props.length;
          while (n--) {
               key = props[n];
               if (key in init) {
                    value = init[key];
               } else {
                    value = 0;
               }
               if (key in ints) {
                    this[key] = parseInt(value, 10);
               } else {
                    this[key] = value || "";
               }
          }
          if (this.type === 0) {
               if ('page' in init) {
                    this.type = TYPE_LIST;
					if(this.page === 0) {
						this.page = 1;
					}
               } else {
                    this.type = TYPE_INDEX;
               }
          }
     };
     Record.prototype.exportObject = function() {
          return {
               ipv6: this.ipv6,
               mask1: this.mask1,
               mask2: this.mask2,
               index: this.index,
               page: this.page,
               type: this.type,
               result: this.index ? this.getIPv6() : 0
          };
     };
     Record.prototype.getIPv6 = function() {
          return ipv6util.getSubnet(this.ipv6 || '', this.mask1, this.mask2, this.index); //.replace(/(:0){2,}/, '::');
     };
     Record.prototype.getUrl = function(full) {
          var path;
          path = 'ip/' + this.ipv6 + '/' + this.mask1 + '/' + this.mask2;
          if (this.type === TYPE_LIST) {
               path = path + '/page/' + this.page;
          } else {
               //if (this.type === TYPE_INDEX) {
               path = path + '/index/' + this.index;
          }
          if (full) {
               path = '/' + path;
          }
          return path;
     };
     Record.prototype.getOneLine = function() {
          var path = '';
          if (this.ipv6) {
               path = this.ipv6 + '/' + this.mask1 + ' ' + this.mask2;
               if (this.type === TYPE_LIST) {
                    path += ' p' + this.page;
               } else {
                    path += ' ' + this.index;
               }
          }
          return path;
     };

     Record.prototype.isTypeList = function() {
          return this.type === TYPE_LIST;
     }

     Record.prototype.isTypeIndex = function() {
          return this.type === TYPE_INDEX;
     }

     /**
      * Accepted string formats : ip::v6::/mask1 mask2 index|pPage
      * Eg:  2001:0db8:85a3::/16 32 10 or 2001:0db8:85a3::/16 32 p1
      */
     Record.prototype.fromOneLine = function(str) {
          var sub, elems = str.split(' '),
               n = elems.length,
               page = 0,
               index = 0,
               lastIndex = n - 1,
               type;
          if (str.match(FORMAT)) {
               sub = (elems[0] || '').split('/');
               if (str.match(FORMAT_LIST)) {
                    elems[lastIndex] = elems[lastIndex].replace(/^p/, '');
                    page = parseInt(elems[lastIndex], 10);
                    type = TYPE_LIST;
               } else {
                    index = parseInt(elems[2], 10) || 0;
                    type = TYPE_INDEX;
               }
               this.initFromObject({
                    ipv6: sub[0] || '0::0',
                    mask1: parseInt(sub[1], 10) || 1,
                    mask2: parseInt(elems[1], 10) || 1,
                    page: page,
                    index: index,
                    type: type
               });
          }
     };
     Record.prototype.getPrefixes = function() {
          return ipv6util.getListOfPrefixes(this.ipv6, this.mask1, this.mask2, this.page);
     };

     // Public API here
     return Record;
}]);
