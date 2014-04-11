'use strict';

describe('Service: Ipv6util', function() {

     // load the service's module
     beforeEach(module('ipv6App'));

     // instantiate service
     var Ipv6util, record, records_indexes, records_pages;
     beforeEach(inject(function(_Ipv6util_) {
          Ipv6util = _Ipv6util_;
          record = {
               ipv6: '2001:0db8:85a3::',
               mask1: 16,
               mask2: 32,
               index: 10,
               page: 1,
               result: '2001:a::'
          };

          records_indexes = [
               [record.ipv6, record.mask1, record.mask2, record.index, record.result],
               ['2001:0db8:85a3::8a2e:0370:7334', 64, 2, 2, 'a001:db8:85a3::'],
               ['2002::021b:63ff:feb4:aa0f', 16, 23, 24, '2002:3000::'],
               ['2001:db8:c001:ba00::', 58, 64, 2, '2001:db8:c001:ba02::']
          ];

          records_pages = [
               [record.ipv6, record.mask1, record.mask2, record.page, record.index, record.result, 2048],
               ['2001:0db8:85a3::8a2e:0370:7334', 64, 64, 1, 0, '2001:db8:85a3::', 1],
               ['2002::021b:63ff:feb4:aa0f', 16, 23, 3, 2, '2002:8400::', 4],
               ['2001:db8:c001:ba00::', 58, 64, 2, 2, '2001:db8:c001:ba22::', 2]
          ]
     }));

     it('should return subnet address', function() {
          expect(Ipv6util.getSubnet(record.ipv6, record.mask1, record.mask2, record.index)).toBe(record.result);
     });

     it('should return the list of prefixes', function() {
          var ret = Ipv6util.getListOfPrefixes(record.ipv6, record.mask1, record.mask2, record.page);
          expect(ret.pages).toBe(2048);
          expect(ret.subnets[0]).toBe('2001::');
          expect(ret.subnets[10]).toBe('2001:a::');
     });

     it('should return the correct subnet address', function() {
          var rec, n = records_indexes.length;
          while (n--) {
               rec = records_indexes[n];
               expect(Ipv6util.getSubnet(rec[0], rec[1], rec[2], rec[3])).toBe(rec[4]);
          }
     });


     it('should return the correct list of prefixes', function() {
          var rec, ret, n = records_pages.length;
          while (n--) {
               rec = records_pages[n];
               ret = Ipv6util.getListOfPrefixes(rec[0], rec[1], rec[2], rec[3]);
               expect(Math.ceil(ret.pages)).toBe(rec[6]);
               expect(ret.subnets[rec[4]]).toBe(rec[5]);
          }
     });
});
