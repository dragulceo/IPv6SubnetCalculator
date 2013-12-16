'use strict';

describe('Service: Ipv6util', function () {

  // load the service's module
  beforeEach(module('ipv6App'));

  // instantiate service
  var Ipv6util;
  beforeEach(inject(function (_Ipv6util_) {
    Ipv6util = _Ipv6util_;
  }));

  it('should do something', function () {
    expect(!!Ipv6util).toBe(true);
  });

});
