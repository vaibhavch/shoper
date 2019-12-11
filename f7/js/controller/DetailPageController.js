/*jslint browser: true*/
/*global console, MyApp*/

MyApp.angular.controller('DetailPageController', ['$scope', '$http', 'InitService', function ($scope, $http, InitService) {
  'use strict';
  
  InitService.addEventListener('ready', function () {
    // DOM ready
    console.log('DetailPageController: ok, DOM ready');

      // You can access angular like this:
    // Shoper.angular
    
    // And you can access Framework7 like this:
    // MyApp
  });
  
}]);