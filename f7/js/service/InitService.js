/*jslint browser: true*/
/*global console, Framework7, MyApp, $document*/

Shoper.angular.factory('InitService', ['$document', function ($document) {

  'use strict';

  var pub = {},
    eventListeners = {
      'ready' : []
    };

  pub.addEventListener = function (eventName, listener) {
    eventListeners[eventName].push(listener);
  };

  function onReady() {
    var fw7 = myApp;
    var i;
    //myApp.app.loginScreen();

    //fw7.views.push(fw7.app.addView('.view-main', fw7.options));
    //fw7.views.push(mainView);

    for (i = 0; i < eventListeners.ready.length; i = i + 1) {
      eventListeners.ready[i]();
    }
  }


  function backKeyDown() {
    if(mainView.activePage.name === "activeorder" || mainView.activePage.name === "dailysuccess") {
      mainView.router.back({url: 'index.html', force: true})
    }
    else {
       mainView.router.back();
    }
  }

  function onDeviceReady() {
    //myApp.app.loginScreen();


 // Register the event listener
 document.addEventListener("backbutton", backKeyDown, false);

//cordova.plugins.locationAccuracy.request(onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);


   }


  // Init
  (function () {
    $document.ready(function () {

      if (document.URL.indexOf("http://") === -1 && document.URL.indexOf("https://") === -1) {
        // Cordova
        console.log("Using Cordova/PhoneGap setting");
        document.addEventListener("deviceready", onDeviceReady, false);


      } else {
        // Web browser
        console.log("Using web browser setting");
        onReady();
      }

    });
  }());


  return pub;

}]);

Shoper.angular.factory('ProductService', ['$document', function ($document) {

  var pname;

  return {
        pName: function () {
           return pname;
         },
         pSetName: function (e) {
           pname = e;
         }
      };

    }]);
