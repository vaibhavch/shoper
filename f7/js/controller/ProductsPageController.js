

     Shoper.angular.controller('SubPageController', ['$scope', '$rootScope', '$controller', '$http', 'InitService', 'ProductService', '$window', function ($scope, $rootScope, $controller, $http, InitService, ProductService, $window) {

       'use strict';

       $scope.alert = function() {
          $window.alert('angular click');
        }

      


       InitService.addEventListener('ready', function () {
         // DOM ready
         console.log('SubPageController: ok, DOM ready');

         // And you can access Framework7 like this:
         // MyApp
       });

     }]);
