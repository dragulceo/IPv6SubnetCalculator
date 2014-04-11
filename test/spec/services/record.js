'use strict';

describe('Service: Record', function () {

  // load the service's module
  beforeEach(module('ipv6App'));

  // instantiate service
  var Record,
  tests = [{
    ipv6: "2a02::",
    mask1: 8,
    mask2: 64,
    index: "211126",
    result: "2a00:0:3:38b6::",
    url: "ip/2a02::/8/64/index/211126",
    oneLine: "2a02::/8 64 211126"
  }, {
    ipv6: "2a02::",
    mask1: 8,
    mask2: 64,
    page: 21,
    result: "2a00::",
    url: "ip/2a02::/8/64/page/21",
    oneLine: "2a02::/8 64 p21"
  }, {
    ipv6: "2a02::",
    mask1: 8,
    mask2: 64,
    index: "21112611111111111",
    result: "2a4b:1ce:d58f:9c6::",
    url: "ip/2a02::/8/64/index/21112611111111110",
    oneLine: "2a02::/8 64 21112611111111110"
  }, {
    ipv6: "2a02::",
    mask1: 8,
    mask2: 9,
    index: "0",
    result: "2a00::",
    url: "ip/2a02::/8/9/index/0",
    oneLine: "2a02::/8 9 0"
  }],
  n = tests.length;

  // For testing factories
  beforeEach(function () {
    inject(function ($injector) {
      Record = $injector.get('record');
    });
  });

 // beforeEach(inject(function (_Record_) {
 //   Record = _Record_;
 // }));

  it('should create default record', function () {
    var record = new Record();
    expect(record).not.toBe(null);
  });


  it('should create default record with params', function () {
    var record = new Record();
    expect(record.mask1).not.toBe(0);
    expect(record.mask2).not.toBe(0);
    expect(record.index).toBe(0);
    expect(record.page).toBe(0);
  });

  it('should create record from object with index', function () {
    var testIndex = 0,
    record = new Record(tests[testIndex]);
    expect(record.ipv6).toBe(tests[testIndex].ipv6);
    expect(record.mask1).toBe(parseInt(tests[testIndex].mask1));
    expect(record.mask2).toBe(parseInt(tests[testIndex].mask2));
    expect(record.index).toBe(parseInt(tests[testIndex].index));
    expect(record.page).toBe(0);
  });

  it('should create record from object with page', function () {
    var testIndex = 1,
    record = new Record(tests[testIndex]);
    expect(record.ipv6).toBe(tests[testIndex].ipv6);
    expect(record.mask1).toBe(parseInt(tests[testIndex].mask1));
    expect(record.mask2).toBe(parseInt(tests[testIndex].mask2));
    expect(record.index).toBe(0);
    expect(record.page).toBe(parseInt(tests[testIndex].page));
  });

  it('should export object correctly', function () {
    var testIndex = 1, exp,
    record = new Record(tests[testIndex]);
    exp = record.exportObject();

    expect(exp.ipv6).toBe(tests[testIndex].ipv6);
    expect(exp.mask1).toBe(tests[testIndex].mask1);
    expect(exp.mask2).toBe(tests[testIndex].mask2);
    expect(exp.index).toBe(tests[testIndex].index || 0);
    expect(exp.page).toBe(tests[testIndex].page);
  });

  it('should return ipv6 correctly', function () {
    var testIndex, record;
    for(testIndex = 0; testIndex < n; testIndex++) {
      record = new Record(tests[testIndex]);
      expect(record.getIPv6()).toBe(tests[testIndex].result);
    }
  });

  it('should return oneLine correctly', function () {
    var testIndex, record;
    for(testIndex = 0; testIndex < n; testIndex++) {
      record = new Record(tests[testIndex]);
      expect(record.getOneLine()).toBe(tests[testIndex].oneLine);
    }
  });

  it('should return url correctly', function () {
    var testIndex, record;
    for(testIndex = 0; testIndex < n; testIndex++) {
      record = new Record(tests[testIndex]);
      expect(record.getUrl()).toBe(tests[testIndex].url);
    }
  });

  it('should be corect list type', function () {
    var testIndex = 1,
    record = new Record(tests[testIndex]);
    expect(record.isTypeList()).toBe(true);
    expect(record.isTypeIndex()).toBe(false);
  });

  it('should be corect page type', function () {
    var testIndex = 0,
    record = new Record(tests[testIndex]);
    expect(record.isTypeList()).toBe(false);
    expect(record.isTypeIndex()).toBe(true);
  });

  it('should parse correctly one line index', function () {
    var testIndex = 0,
    record = new Record();
    record.fromOneLine(tests[testIndex].oneLine);
    expect(record.ipv6).toBe(tests[testIndex].ipv6);
    expect(record.mask1).toBe(parseInt(tests[testIndex].mask1));
    expect(record.mask2).toBe(parseInt(tests[testIndex].mask2));
    expect(record.index).toBe(parseInt(tests[testIndex].index));
    expect(record.page).toBe(0);
    expect(record.isTypeIndex()).toBe(true);
  });

  it('should parse correctly one line page', function () {
    var testIndex = 1,
    record = new Record();
    record.fromOneLine(tests[testIndex].oneLine);
    expect(record.ipv6).toBe(tests[testIndex].ipv6);
    expect(record.mask1).toBe(parseInt(tests[testIndex].mask1));
    expect(record.mask2).toBe(parseInt(tests[testIndex].mask2));
    expect(record.page).toBe(parseInt(tests[testIndex].page));
    expect(record.index).toBe(0);
    expect(record.isTypeList()).toBe(true);
  });

  it('should return prefixes', function () {
    var testIndex = 2,
    record = new Record();
    record.fromOneLine(tests[testIndex].oneLine);
    expect((record.getPrefixes()).length).toBe(2);
  });
});
