'use strict';

describe('Service: SharedRecord', function () {

  // load the service's module
  beforeEach(module('ipv6App'));

  // instantiate service
  var SharedRecord;
  beforeEach(inject(function (_SharedRecord_) {
    SharedRecord = _SharedRecord_;
  }));

  it('should have the shared record', function () {
    expect(!!SharedRecord).toBe(true);
  });

});
