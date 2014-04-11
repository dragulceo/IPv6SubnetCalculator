'use strict';

describe('Directive: ipv6onblur', function () {

  // load the directive's module
  beforeEach(module('ipv6App'));

  var element,
    scope,
    clicked = false;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    scope.onBlurHandler = function () {
     clicked = true;
    };
    element = angular.element('<input type="text" ng-click="onBlurHandler" />');
    element = $compile(element)(scope);
    scope.$digest();
    spyOn(scope, 'onBlurHandler');
  }));

  it('should trigger blur on blur', inject(function ($compile) {
    element.triggerHandler('click');
    //this works too
    //element[0].click();

    //It doesn't work otherwise (using $digest or $apply)
    //It may be due to the fact that the event is triggered async
    setTimeout(function () {
      expect(scope.onBlurHandler).toHaveBeenCalled();
    }, 100);
  }));
});
