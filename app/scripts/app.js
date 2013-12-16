'use strict';

angular.module('ipv6App', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
     $routeProvider.when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
     }).when('/ip/:ipv6/:mask1/:mask2/index/:index', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
     }).when('/ip/:ipv6/:mask1/:mask2/page/:page', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
     }).when('/ip/:ipv6/:mask1/:mask2', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
     }).otherwise({
          redirectTo: '/'
     }); 
  });
