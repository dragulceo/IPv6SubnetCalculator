'use strict';

describe('Controller: MainCtrl', function() {

    // load the controller's module
    beforeEach(module('ipv6App'));

    var MainCtrl,
        scope, routeParams, location;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        routeParams = {
            ipv6: '2001:0DB8::',
            mask1: '32',
            mask2: '35',
            index: '0'
        };
        location = {
            path: function() {}
        };
        MainCtrl = $controller('MainCtrl', {
            $scope: scope,
            $routeParams: routeParams,
            $location: location
        });
        spyOn(location, 'path');
    }));

    it('should init record with routeParams', function() {
        expect(scope.record.ipv6).toBe(routeParams.ipv6);
        expect(scope.record.mask1).toBe(routeParams.mask1);
        expect(scope.record.mask2).toBe(routeParams.mask2);
        expect(scope.record.index).toBe(0);
    });

    it('should update the oneLine model when record changes', function() {
        scope.record.ipv6 = '2001:0DB9::';
        scope.$digest();
        expect(scope.oneLine).toBe(scope.record.getOneLine());
    });

    it('should update the location when record changes', function() {
        scope.record.ipv6 = '2001:0DB9::';
        scope.$digest();
        expect(location.path).toHaveBeenCalledWith(scope.record.getUrl(true));
    });
});
