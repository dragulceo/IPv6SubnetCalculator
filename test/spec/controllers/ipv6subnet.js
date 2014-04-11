'use strict';

describe('Controller: Ipv6subnetCtrl', function() {

    // load the controller's module
    beforeEach(module('ipv6App'));

    var Ipv6subnetCtrl,
        scope, rootScope, location,
        tests = [{
            ipv6: "2a02::",
            mask1: 8,
            mask2: 64,
            index: "211126",
            result: "2a00:0:3:38b6::"
        }, {
            ipv6: "2a02::",
            mask1: 8,
            mask2: 64,
            index: "21112611111111111",
            result: "2a4b:1ce:d58f:9c6::"
        }, {
            ipv6: "2a02::",
            mask1: 8,
            mask2: 9,
            index: "0",
            result: "2a00::"
        }],
        n = tests.length,
        record;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($location, $rootScope, $controller) {
        location = $location;
        scope = $rootScope.$new();
        record = angular.copy(tests[0]);
        Ipv6subnetCtrl = $controller('Ipv6subnetCtrl', {
            $scope: scope,
            $location: $location
        });
    }));

    it('should have a record', function() {
        expect(scope.record).not.toBe(null);
    });

    it('should get the ip address', function() {
        var m = n;
        while (m--) {
            scope.record.initFromObject(tests[m]);
            expect(scope.ipAddress()).toBe(tests[m].result);
        }
    });

    it('should show ip address when record is set', function() {
        scope.record.initFromObject(record);
        expect(scope.shouldShowIpAddress()).toBe(true);
    });

    it('should not show ip address when record is missing', function() {
        expect(scope.shouldShowIpAddress()).toBeFalsy();
    });

    it('should not show ip address when record is null', function() {
        scope.record = null;
        expect(scope.shouldShowIpAddress()).toBeFalsy();
    });

    it('should not show ip address when record is empty', function() {
        scope.record = {};
        expect(scope.shouldShowIpAddress()).toBeFalsy();
    });

    it('should set next page', function() {
        var prevPage;
        record.page = 10;
        scope.record.initFromObject(record);
        prevPage = scope.record.page;
        scope.setPage("Next");
        expect(scope.record.page).toBe(prevPage + 1);
    });

    it('should set prev page', function() {
        var prevPage;
        record.page = 10;
        scope.record.initFromObject(record);
        prevPage = scope.record.page;
        scope.setPage("Prev");
        expect(scope.record.page).toBe(prevPage - 1);
    });

    it('should maintain page to 0 if prev page is requested', function() {
        record.page = 1;
        scope.record.initFromObject(record);
        scope.setPage("Prev");
        expect(scope.record.page).toBe(1);
    });

    it('should set page to number', function() {
        scope.record.initFromObject(record);
        scope.setPage(10);
        expect(scope.record.page).toBe(10);
    });

    it('should not set page if invalid number', function() {
        var prevPage;
        record.page = 11;
        scope.record.initFromObject(record);
        prevPage = scope.record.page;
        scope.setPage("sd10");
        expect(scope.record.page).toBe(prevPage);
    });

    it('should show subnets if record type is approiate', function() {
        record.page = 10;
        scope.record.initFromObject(record);
        expect(scope.shouldShowSubnets()).toBe(true);
    });

    it('should not show subnets if record type is not approiate', function() {
        scope.record.initFromObject(record);
        expect(scope.shouldShowSubnets()).toBeFalsy();
    });

    it('should not show subnets if record is not set', function() {
        expect(scope.shouldShowSubnets()).toBeFalsy();
    });
});
