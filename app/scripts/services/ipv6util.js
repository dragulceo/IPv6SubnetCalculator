'use strict';

angular.module('ipv6App')
     .service('Ipv6util', function Ipv6util() {
     var minimizeIPv6,
     getIPAddressArray8FromString, getIPv6StrFromBytesArray, getSubnetAddress, getListOfPrefixes;

     minimizeIPv6 = function(ipv6str) {
          return ipv6str.replace(/(:0(:(0))+(:|$))/, "::");
     };

     getIPAddressArray8FromString = function(ipv6str) {
          var isShortened = ipv6str.match(/::/),
               i, n, repl, ret = [],
               ipArray = [];
          if (isShortened) {
               ipv6str = ipv6str.replace(/::/, ":_:");
               ipv6str = ipv6str.replace(/:$/, ":0");
               n = 9 - ipv6str.split(":").length;
               repl = [];
               while (n--) {
                    repl.push("0");
               }
               ipv6str = ipv6str.replace("_", repl.join(":"));
          }
          ipArray = ipv6str.split(":");
          for (i = 0, n = ipArray.length; i < n; i++) {
               ipArray[i] = parseInt(ipArray[i], 16);
               ret[2 * i + 1] = ipArray[i] & 0xff;
               ret[2 * i] = ipArray[i] >> 8;
          }
          return ret;
     };

     getIPv6StrFromBytesArray = function(ipArray8, minimized) {
          var ret = [],
               retStr,
               num, i, n;
          //fix the case when the byteArray length is 17 
          ipArray8 = ipArray8.splice(-16);
          while (ipArray8.length < 16) {
               ipArray8.push(0);
          }
          n = ipArray8.length;
          for (i = 0; i < n; i++) {
               if (ipArray8[i] < 0) {
                    ipArray8[i] += 256;
               }
          }
          for (i = 0; i < n / 2; i++) {
               ret.push(((ipArray8[i * 2] << 8) + ipArray8[i * 2 + 1]).toString(16));
          }
          retStr = ret.join(":");
          if (minimized) {
               return minimizeIPv6(retStr);
          }
          return retStr;
     };

     getSubnetAddress = function(strIPv6Address, mask1, mask2, index) {
          var i, n, step, ip, prefix, mask,
          maxLocal, ipArray32 = [];

          ip = new BigInteger(getIPAddressArray8FromString(strIPv6Address)); //.shiftRight(64);


          mask = new BigInteger("ffffffffffffffff", 16).shiftLeft(128 - mask1);
          prefix = ip.and(mask);
          index = new BigInteger("" + index, 10);
          index = index.multiply((new BigInteger("1")).shiftLeft(128 - mask2));
          prefix = prefix.add(index);
          //          return prefix.toByteArray(); //ip32to16(ipArray32);
          return getIPv6StrFromBytesArray(prefix.toByteArray(), true);
     };


     /* page starts from 1 */
     getListOfPrefixes = function(strIPv6Address, mask1, mask2, page) {
          var subnets = [],
               mask, prefix, n, adder, index, pageSize = 32,
               maxValue,
               ip = new BigInteger(getIPAddressArray8FromString(strIPv6Address));
          mask1 = parseInt(mask1, 10);
          mask2 = parseInt(mask2, 10);
          if (!mask1 || isNaN(mask1) || !mask2 || isNaN(mask2)) {
               return false;
          }
          if (mask2 < mask1 || mask2 > 64) {
               return false;
          }

          mask = new BigInteger("ffffffffffffffff", 16).shiftLeft(128 - mask1);
          prefix = ip.and(mask);

          maxValue = (new BigInteger("1")).shiftLeft(mask2 - mask1).intValue();
          adder = (new BigInteger("1")).shiftLeft(128 - mask2);
          page = parseInt(page, 10);
          if (page > 0) {
               page = page - 1;
          }
          n = Math.min((page + 1) * pageSize, maxValue);
          prefix = prefix.add(adder.multiply(new BigInteger((page * pageSize).toString())));
          for (index = page * pageSize; index < n; index++) {
               subnets.push(getIPv6StrFromBytesArray(prefix.toByteArray(), true));
               prefix = prefix.add(adder);
          }
          return {
               subnets: subnets,
               pages: maxValue / pageSize
          };
     };

     return {
          getSubnet: getSubnetAddress,
          getListOfPrefixes: getListOfPrefixes

     };
});
