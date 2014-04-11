'use strict';

describe('Service: History', function() {

     // load the service's module
     beforeEach(module('ipv6App'));

     // instantiate service
     var History, record, initialRecordsNumber;
     beforeEach(inject(function(_History_) {
          History = _History_;
          record = {
               ipv6: '2001:0DB8::',
               mask1: 35,
               mask2: 32,
               index: 0,
               page: 0,
               type: 1
          };
          History.removeRecord(record);
		  initialRecordsNumber = History.getRecords().length;
	 }));

     it('should add to history', function() {
          History.addRecord(record);
          expect(initialRecordsNumber + 1 === History.getRecords().length).toBe(true);
     });

	 it('should remove from history', function () {
          History.addRecord(record);
          expect(initialRecordsNumber + 1 === History.getRecords().length).toBe(true);
		  History.removeRecord(record);
          expect(initialRecordsNumber === History.getRecords().length).toBe(true);
	 });

	 it('should add only once to history', function () {
          History.addRecord(record);
          History.addRecord(record);
          expect(initialRecordsNumber + 1 === History.getRecords().length).toBe(true);
	 });

});
