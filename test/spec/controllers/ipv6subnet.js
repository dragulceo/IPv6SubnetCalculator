'use strict';

describe('Controller: Ipv6subnetCtrl', function () {

  // load the controller's module
  beforeEach(module('ipv6App'));

  var Ipv6subnetCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Ipv6subnetCtrl = $controller('Ipv6subnetCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
