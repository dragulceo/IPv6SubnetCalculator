'use strict';

describe('Service: Record', function () {

  // load the service's module
  beforeEach(module('ipv6App'));

  // instantiate service
  var Record;
  beforeEach(inject(function (_Record_) {
    Record = _Record_;
  }));

  it('should do something', function () {
    expect(!!Record).toBe(true);
  });

});
