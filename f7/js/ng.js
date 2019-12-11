(function(){

angular.module('ngCordova', [
  'ngCordova.plugins'
]);
angular.module('ngCordova.plugins', [	 'backgroundGeolocation',	 'geolocation',	 'device',	 'googleMap',	 'keyboard',	 'nativeAudio',	 'sqlite',	 'vibration',	 'googleAnalytic',	 'localNotification',	 'statusbar',	 'deviceOrientation',	 'network']);//#### Begin Individual Plugin Code ####// install   :      cordova plugin add https://github.com/driftyco/ionic-plugins-keyboard.git
// link      :      https://github.com/driftyco/ionic-plugins-keyboard

angular.module('ngCordova.plugins.keyboard', [])

  .factory('$cordovaKeyboard', ['$rootScope', function ($rootScope) {

    var keyboardShowEvent = function () {
      $rootScope.$evalAsync(function () {
        $rootScope.$broadcast('$cordovaKeyboard:show');
      });
    };

    var keyboardHideEvent = function () {
      $rootScope.$evalAsync(function () {
        $rootScope.$broadcast('$cordovaKeyboard:hide');
      });
    };

    document.addEventListener('deviceready', function () {
      if (cordova.plugins.Keyboard) {
        window.addEventListener('native.keyboardshow', keyboardShowEvent, false);
        window.addEventListener('native.keyboardhide', keyboardHideEvent, false);
      }
    });

    return {
      hideAccessoryBar: function (bool) {
        return cordova.plugins.Keyboard.hideKeyboardAccessoryBar(bool);
      },

      close: function () {
        return cordova.plugins.Keyboard.close();
      },

      show: function () {
        return cordova.plugins.Keyboard.show();
      },

      disableScroll: function (bool) {
        return cordova.plugins.Keyboard.disableScroll(bool);
      },

      isVisible: function () {
        return cordova.plugins.Keyboard.isVisible;
      },

      clearShowWatch: function () {
        document.removeEventListener('native.keyboardshow', keyboardShowEvent);
        $rootScope.$$listeners['$cordovaKeyboard:show'] = [];
      },

      clearHideWatch: function () {
        document.removeEventListener('native.keyboardhide', keyboardHideEvent);
        $rootScope.$$listeners['$cordovaKeyboard:hide'] = [];
      }
    };
  }]);
// install   : cordova plugin add https://github.com/sidneys/cordova-plugin-nativeaudio.git
// link      : https://github.com/sidneys/cordova-plugin-nativeaudio

angular.module('ngCordova.plugins.nativeAudio', [])

  .factory('$cordovaNativeAudio', ['$q', '$window', function ($q, $window) {

    return {
      preloadSimple: function (id, assetPath) {
        var q = $q.defer();
        $window.plugins.NativeAudio.preloadSimple(id, assetPath, function (result) {
          q.resolve(result);
        }, function (err) {
          q.reject(err);
        });

        return q.promise;
      },

      preloadComplex: function (id, assetPath, volume, voices) {
        var q = $q.defer();
        $window.plugins.NativeAudio.preloadComplex(id, assetPath, volume, voices, function (result) {
          q.resolve(result);
        }, function (err) {
          q.reject(err);
        });

        return q.promise;
      },

      play: function (id, completeCallback) {
        var q = $q.defer();
        $window.plugins.NativeAudio.play(id, completeCallback, function (err) {
          q.reject(err);
        }, function (result) {
          q.resolve(result);
        });

        return q.promise;
      },

      stop: function (id) {
        var q = $q.defer();
        $window.plugins.NativeAudio.stop(id, function (result) {
          q.resolve(result);
        }, function (err) {
          q.reject(err);
        });
        return q.promise;
      },

      loop: function (id) {
        var q = $q.defer();
        $window.plugins.NativeAudio.loop(id, function (result) {
          q.resolve(result);
        }, function (err) {
          q.reject(err);
        });

        return q.promise;
      },

      unload: function (id) {
        var q = $q.defer();
        $window.plugins.NativeAudio.unload(id, function (result) {
          q.resolve(result);
        }, function (err) {
          q.reject(err);
        });

        return q.promise;
      },

      setVolumeForComplexAsset: function (id, volume) {
        var q = $q.defer();
        $window.plugins.NativeAudio.setVolumeForComplexAsset(id, volume, function (result) {
          q.resolve(result);
        }, function (err) {
          q.reject(err);
        });

        return q.promise;
      }
    };
  }]);
// install   :      cordova plugin add https://github.com/litehelpers/Cordova-sqlite-storage.git
// link      :      https://github.com/litehelpers/Cordova-sqlite-storage

angular.module('ngCordova.plugins.sqlite', [])

  .factory('$cordovaSQLite', ['$q', '$window', function ($q, $window) {

    return {
      openDB: function (options, background) {

        if (angular.isObject(options) && !angular.isString(options)) {
          if (typeof background !== 'undefined') {
            options.bgType = background;
          }
          return $window.sqlitePlugin.openDatabase(options);
        }

        return $window.sqlitePlugin.openDatabase({
          name: options,
          bgType: background
        });
      },

      execute: function (db, query, binding) {
        var q = $q.defer();
        db.transaction(function (tx) {
          tx.executeSql(query, binding, function (tx, result) {
              q.resolve(result);
            },
            function (transaction, error) {
              q.reject(error);
            });
        });
        return q.promise;
      },

      insertCollection: function (db, query, bindings) {
        var q = $q.defer();
        var coll = bindings.slice(0); // clone collection

        db.transaction(function (tx) {
          (function insertOne() {
            var record = coll.splice(0, 1)[0]; // get the first record of coll and reduce coll by one
            try {
              tx.executeSql(query, record, function (tx, result) {
                if (coll.length === 0) {
                  q.resolve(result);
                } else {
                  insertOne();
                }
              }, function (transaction, error) {
                q.reject(error);
                return;
              });
            } catch (exception) {
              q.reject(exception);
            }
          })();
        });
        return q.promise;
      },

      nestedExecute: function (db, query1, query2, binding1, binding2) {
        var q = $q.defer();

        db.transaction(function (tx) {
            tx.executeSql(query1, binding1, function (tx, result) {
              q.resolve(result);
              tx.executeSql(query2, binding2, function (tx, res) {
                q.resolve(res);
              });
            });
          },
          function (transaction, error) {
            q.reject(error);
          });

        return q.promise;
      },

      deleteDB: function (dbName) {
        var q = $q.defer();

        $window.sqlitePlugin.deleteDatabase(dbName, function (success) {
          q.resolve(success);
        }, function (error) {
          q.reject(error);
        });

        return q.promise;
      }
    };
  }]);
// install   :      cordova plugin add cordova-plugin-vibration
// link      :      https://github.com/apache/cordova-plugin-vibration

angular.module('ngCordova.plugins.vibration', [])

  .factory('$cordovaVibration', [function () {

    return {
      vibrate: function (times) {
        return navigator.notification.vibrate(times);
      },
      vibrateWithPattern: function (pattern, repeat) {
        return navigator.notification.vibrateWithPattern(pattern, repeat);
      },
      cancelVibration: function () {
        return navigator.notification.cancelVibration();
      }
    };
  }]);
// install   :     cordova plugin add https://github.com/christocracy/cordova-plugin-background-geolocation.git
// link      :     https://github.com/christocracy/cordova-plugin-background-geolocation

angular.module('ngCordova.plugins.backgroundGeolocation', [])

  .factory('$cordovaBackgroundGeolocation', ['$q', '$window', function ($q, $window) {

    return {

      init: function () {
        $window.navigator.geolocation.getCurrentPosition(function (location) {
          return location;
        });
      },

      configure: function (options) {

        this.init();
        var q = $q.defer();

        $window.plugins.backgroundGeoLocation.configure(
          function (result) {
            q.notify(result);
            $window.plugins.backgroundGeoLocation.finish();
          },
          function (err) {
            q.reject(err);
          }, options);

        this.start();

        return q.promise;
      },

      start: function () {
        var q = $q.defer();

        $window.plugins.backgroundGeoLocation.start(
          function (result) {
            q.resolve(result);
          },
          function (err) {
            q.reject(err);
          });

        return q.promise;
      },

      stop: function () {
        var q = $q.defer();

        $window.plugins.backgroundGeoLocation.stop(
          function (result) {
            q.resolve(result);
          },
          function (err) {
            q.reject(err);
          });

        return q.promise;
      }
    };
  }

  ]);
// install   :     cordova plugin add cordova-plugin-geolocation
// link      :     https://github.com/apache/cordova-plugin-geolocation

angular.module('ngCordova.plugins.geolocation', [])

  .factory('$cordovaGeolocation', ['$q', function ($q) {

    return {
      getCurrentPosition: function (options) {
        var q = $q.defer();

        navigator.geolocation.getCurrentPosition(function (result) {
          q.resolve(result);
        }, function (err) {
          q.reject(err);
        }, options);

        return q.promise;
      },

      watchPosition: function (options) {
        var q = $q.defer();

        var watchID = navigator.geolocation.watchPosition(function (result) {
          q.notify(result);
        }, function (err) {
          q.reject(err);
        }, options);

        q.promise.cancel = function () {
          navigator.geolocation.clearWatch(watchID);
        };

        q.promise.clearWatch = function (id) {
          navigator.geolocation.clearWatch(id || watchID);
        };

        q.promise.watchID = watchID;

        return q.promise;
      },

      clearWatch: function (watchID) {
        return navigator.geolocation.clearWatch(watchID);
      }
    };
  }]);
// install   :     cordova plugin add cordova-plugin-device
// link      :     https://github.com/apache/cordova-plugin-device

/* globals device: true */
angular.module('ngCordova.plugins.device', [])

  .factory('$cordovaDevice', [function () {

    return {
      /**
       * Returns the whole device object.
       * @see https://github.com/apache/cordova-plugin-device
       * @returns {Object} The device object.
       */
      getDevice: function () {
        return device;
      },

      /**
       * Returns the Cordova version.
       * @see https://github.com/apache/cordova-plugin-device#devicecordova
       * @returns {String} The Cordova version.
       */
      getCordova: function () {
        return device.cordova;
      },

      /**
       * Returns the name of the device's model or product.
       * @see https://github.com/apache/cordova-plugin-device#devicemodel
       * @returns {String} The name of the device's model or product.
       */
      getModel: function () {
        return device.model;
      },

      /**
       * @deprecated device.name is deprecated as of version 2.3.0. Use device.model instead.
       * @returns {String}
       */
      getName: function () {
        return device.name;
      },

      /**
       * Returns the device's operating system name.
       * @see https://github.com/apache/cordova-plugin-device#deviceplatform
       * @returns {String} The device's operating system name.
       */
      getPlatform: function () {
        return device.platform;
      },

      /**
       * Returns the device's Universally Unique Identifier.
       * @see https://github.com/apache/cordova-plugin-device#deviceuuid
       * @returns {String} The device's Universally Unique Identifier
       */
      getUUID: function () {
        return device.uuid;
      },

      /**
       * Returns the operating system version.
       * @see https://github.com/apache/cordova-plugin-device#deviceversion
       * @returns {String}
       */
      getVersion: function () {
        return device.version;
      },

      /**
       * Returns the device manufacturer.
       * @returns {String}
       */
      getManufacturer: function () {
        return device.manufacturer;
      }
    };
  }]);
// install   :
// link      :

// Google Maps needs ALOT of work!
// Not for production use

angular.module('ngCordova.plugins.googleMap', [])

  .factory('$cordovaGoogleMap', ['$q', '$window', function ($q, $window) {

    var map = null;

    return {
      getMap: function (options) {
        var q = $q.defer();

        if (!$window.plugin.google.maps) {
          q.reject(null);
        } else {
          var div = document.getElementById('map_canvas');
          map = $window.plugin.google.maps.Map.getMap(options);
          map.setDiv(div);
          q.resolve(map);
        }
        return q.promise;
      },

      isMapLoaded: function () { // check if an instance of the map exists
        return !!map;
      },
      addMarker: function (markerOptions) { // add a marker to the map with given markerOptions
        var q = $q.defer();
        map.addMarker(markerOptions, function (marker) {
          q.resolve(marker);
        });

        return q.promise;
      },
      getMapTypeIds: function () {
        return $window.plugin.google.maps.mapTypeId;
      },
      setVisible: function (isVisible) {
        var q = $q.defer();
        map.setVisible(isVisible);
        return q.promise;
      },
      // I don't know how to deallocate te map and the google map plugin.
      cleanup: function () {
        map = null;
        // delete map;
      }
    };
  }]);
// install   :      cordova plugin add cordova-plugin-statusbar
// link      :      https://github.com/apache/cordova-plugin-statusbar

/* globals StatusBar: true */
angular.module('ngCordova.plugins.statusbar', [])

.factory('$cordovaStatusbar', [function () {

  return {

    /**
      * @param {boolean} bool
      */
    overlaysWebView: function (bool) {
      return StatusBar.overlaysWebView(!!bool);
    },

    STYLES: {
      DEFAULT: 0,
      LIGHT_CONTENT: 1,
      BLACK_TRANSLUCENT: 2,
      BLACK_OPAQUE: 3
    },

    /**
      * @param {number} style
      */
    style: function (style) {
      switch (style) {
        // Default
        case 0:
        return StatusBar.styleDefault();

        // LightContent
        case 1:
        return StatusBar.styleLightContent();

        // BlackTranslucent
        case 2:
        return StatusBar.styleBlackTranslucent();

        // BlackOpaque
        case 3:
        return StatusBar.styleBlackOpaque();

        default:
        return StatusBar.styleDefault();
      }
    },

    // supported names:
    // black, darkGray, lightGray, white, gray, red, green,
    // blue, cyan, yellow, magenta, orange, purple, brown
    styleColor: function (color) {
      return StatusBar.backgroundColorByName(color);
    },

    styleHex: function (colorHex) {
      return StatusBar.backgroundColorByHexString(colorHex);
    },

    hide: function () {
      return StatusBar.hide();
    },

    show: function () {
      return StatusBar.show();
    },

    isVisible: function () {
      return StatusBar.isVisible;
    }
  };
}]);
// install   :     cordova plugin add cordova-plugin-device-orientation
// link      :     https://github.com/apache/cordova-plugin-device-orientation

angular.module('ngCordova.plugins.deviceOrientation', [])

  .factory('$cordovaDeviceOrientation', ['$q', function ($q) {

    var defaultOptions = {
      frequency: 3000 // every 3s
    };

    return {
      getCurrentHeading: function () {
        var q = $q.defer();

        if(!navigator.compass) {
            q.reject('No compass on Device');
            return q.promise;
        }

        navigator.compass.getCurrentHeading(function (result) {
          q.resolve(result);
        }, function (err) {
          q.reject(err);
        });

        return q.promise;
      },

      watchHeading: function (options) {
        var q = $q.defer();

        if(!navigator.compass) {
            q.reject('No compass on Device');
            return q.promise;
        }

        var _options = angular.extend(defaultOptions, options);
        var watchID = navigator.compass.watchHeading(function (result) {
          q.notify(result);
        }, function (err) {
          q.reject(err);
        }, _options);

        q.promise.cancel = function () {
          navigator.compass.clearWatch(watchID);
        };

        q.promise.clearWatch = function (id) {
          navigator.compass.clearWatch(id || watchID);
        };

        q.promise.watchID = watchID;

        return q.promise;
      },

      clearWatch: function (watchID) {
        return navigator.compass.clearWatch(watchID);
      }
    };
  }]);
// install   :      cordova plugin add cordova-plugin-network-information
// link      :      https://github.com/apache/cordova-plugin-network-information

/* globals Connection: true */
angular.module('ngCordova.plugins.network', [])

  .factory('$cordovaNetwork', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

    /**
      * Fires offline a event
      */
    var offlineEvent = function () {
      var networkState = navigator.connection.type;
      $timeout(function () {
        $rootScope.$broadcast('$cordovaNetwork:offline', networkState);
      });
    };

    /**
      * Fires online a event
      */
    var onlineEvent = function () {
      var networkState = navigator.connection.type;
      $timeout(function () {
        $rootScope.$broadcast('$cordovaNetwork:online', networkState);
      });
    };

    document.addEventListener('deviceready', function () {
      if (navigator.connection) {
        document.addEventListener('offline', offlineEvent, false);
        document.addEventListener('online', onlineEvent, false);
      }
    });

    return {
      getNetwork: function () {
        return navigator.connection.type;
      },

      isOnline: function () {
        var networkState = navigator.connection.type;
        return networkState !== Connection.UNKNOWN && networkState !== Connection.NONE;
      },

      isOffline: function () {
        var networkState = navigator.connection.type;
        return networkState === Connection.UNKNOWN || networkState === Connection.NONE;
      },

      clearOfflineWatch: function () {
        document.removeEventListener('offline', offlineEvent);
        $rootScope.$$listeners['$cordovaNetwork:offline'] = [];
      },

      clearOnlineWatch: function () {
        document.removeEventListener('online', onlineEvent);
        $rootScope.$$listeners['$cordovaNetwork:online'] = [];
      }
    };
  }])
  .run(['$injector', function ($injector) {
    $injector.get('$cordovaNetwork'); //ensure the factory always gets initialised
  }]);
// install   :     cordova plugin add https://github.com/danwilson/google-analytics-plugin.git
// link      :     https://github.com/danwilson/google-analytics-plugin

angular.module('ngCordova.plugins.googleAnalytics', [])

  .factory('$cordovaGoogleAnalytics', ['$q', '$window', function ($q, $window) {

    return {
      startTrackerWithId: function (id) {
        var d = $q.defer();

        $window.analytics.startTrackerWithId(id, function (response) {
          d.resolve(response);
        }, function (error) {
          d.reject(error);
        });

        return d.promise;
      },

      setUserId: function (id) {
        var d = $q.defer();

        $window.analytics.setUserId(id, function (response) {
          d.resolve(response);
        }, function (error) {
          d.reject(error);
        });

        return d.promise;
      },

      debugMode: function () {
        var d = $q.defer();

        $window.analytics.debugMode(function (response) {
          d.resolve(response);
        }, function () {
          d.reject();
        });

        return d.promise;
      },

      trackView: function (screenName) {
        var d = $q.defer();

        $window.analytics.trackView(screenName, function (response) {
          d.resolve(response);
        }, function (error) {
          d.reject(error);
        });

        return d.promise;
      },

      addCustomDimension: function (key, value) {
        var d = $q.defer();

        $window.analytics.addCustomDimension(key, value, function () {
          d.resolve();
        }, function (error) {
          d.reject(error);
        });

        return d.promise;
      },

      trackEvent: function (category, action, label, value) {
        var d = $q.defer();

        $window.analytics.trackEvent(category, action, label, value, function (response) {
          d.resolve(response);
        }, function (error) {
          d.reject(error);
        });

        return d.promise;
      },

      trackException: function (description, fatal) {
        var d = $q.defer();

        $window.analytics.trackException(description, fatal, function (response) {
          d.resolve(response);
        }, function (error) {
          d.reject(error);
        });

        return d.promise;
      },

      trackTiming: function (category, milliseconds, variable, label) {
        var d = $q.defer();

        $window.analytics.trackTiming(category, milliseconds, variable, label, function (response) {
          d.resolve(response);
        }, function (error) {
          d.reject(error);
        });

        return d.promise;
      },

      addTransaction: function (transactionId, affiliation, revenue, tax, shipping, currencyCode) {
        var d = $q.defer();

        $window.analytics.addTransaction(transactionId, affiliation, revenue, tax, shipping, currencyCode, function (response) {
          d.resolve(response);
        }, function (error) {
          d.reject(error);
        });

        return d.promise;
      },

      addTransactionItem: function (transactionId, name, sku, category, price, quantity, currencyCode) {
        var d = $q.defer();

        $window.analytics.addTransactionItem(transactionId, name, sku, category, price, quantity, currencyCode, function (response) {
          d.resolve(response);
        }, function (error) {
          d.reject(error);
        });

        return d.promise;
      }
    };
  }]);
// install   :  cordova plugin add https://github.com/katzer/cordova-plugin-local-notifications.git
// link      :  https://github.com/katzer/cordova-plugin-local-notifications

angular.module('ngCordova.plugins.localNotification', [])

  .factory('$cordovaLocalNotification', ['$q', '$window', '$rootScope', '$timeout', function ($q, $window, $rootScope, $timeout) {
    document.addEventListener('deviceready', function () {
      if ($window.cordova &&
        $window.cordova.plugins &&
        $window.cordova.plugins.notification &&
        $window.cordova.plugins.notification.local) {
        // ----- "Scheduling" events

        // A local notification was scheduled
        $window.cordova.plugins.notification.local.on('schedule', function (notification, state) {
          $timeout(function () {
            $rootScope.$broadcast('$cordovaLocalNotification:schedule', notification, state);
          });
        });

        // A local notification was triggered
        $window.cordova.plugins.notification.local.on('trigger', function (notification, state) {
          $timeout(function () {
            $rootScope.$broadcast('$cordovaLocalNotification:trigger', notification, state);
          });
        });

        // ----- "Update" events

        // A local notification was updated
        $window.cordova.plugins.notification.local.on('update', function (notification, state) {
          $timeout(function () {
            $rootScope.$broadcast('$cordovaLocalNotification:update', notification, state);
          });
        });

        // ----- "Clear" events

        // A local notification was cleared from the notification center
        $window.cordova.plugins.notification.local.on('clear', function (notification, state) {
          $timeout(function () {
            $rootScope.$broadcast('$cordovaLocalNotification:clear', notification, state);
          });
        });

        // All local notifications were cleared from the notification center
        $window.cordova.plugins.notification.local.on('clearall', function (state) {
          $timeout(function () {
            $rootScope.$broadcast('$cordovaLocalNotification:clearall', state);
          });
        });

        // ----- "Cancel" events

        // A local notification was cancelled
        $window.cordova.plugins.notification.local.on('cancel', function (notification, state) {
          $timeout(function () {
            $rootScope.$broadcast('$cordovaLocalNotification:cancel', notification, state);
          });
        });

        // All local notifications were cancelled
        $window.cordova.plugins.notification.local.on('cancelall', function (state) {
          $timeout(function () {
            $rootScope.$broadcast('$cordovaLocalNotification:cancelall', state);
          });
        });

        // ----- Other events

        // A local notification was clicked
        $window.cordova.plugins.notification.local.on('click', function (notification, state) {
          $timeout(function () {
            $rootScope.$broadcast('$cordovaLocalNotification:click', notification, state);
          });
        });
      }
    }, false);
    return {
      schedule: function (options, scope) {
        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.schedule(options, function (result) {
          q.resolve(result);
        }, scope);

        return q.promise;
      },

      add: function (options, scope) {
        console.warn('Deprecated: use "schedule" instead.');

        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.schedule(options, function (result) {
          q.resolve(result);
        }, scope);

        return q.promise;
      },

      update: function (options, scope) {
        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.update(options, function (result) {
          q.resolve(result);
        }, scope);

        return q.promise;
      },

      clear: function (ids, scope) {
        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.clear(ids, function (result) {
          q.resolve(result);
        }, scope);

        return q.promise;
      },

      clearAll: function (scope) {
        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.clearAll(function (result) {
          q.resolve(result);
        }, scope);

        return q.promise;
      },

      cancel: function (ids, scope) {
        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.cancel(ids, function (result) {
          q.resolve(result);
        }, scope);

        return q.promise;
      },

      cancelAll: function (scope) {
        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.cancelAll(function (result) {
          q.resolve(result);
        }, scope);

        return q.promise;
      },

      isPresent: function (id, scope) {
        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.isPresent(id, function (result) {
          q.resolve(result);
        }, scope);

        return q.promise;
      },

      isScheduled: function (id, scope) {
        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.isScheduled(id, function (result) {
          q.resolve(result);
        }, scope);

        return q.promise;
      },

      isTriggered: function (id, scope) {
        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.isTriggered(id, function (result) {
          q.resolve(result);
        }, scope);

        return q.promise;
      },

      hasPermission: function (scope) {
        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.hasPermission(function (result) {
          if (result) {
            q.resolve(result);
          } else {
            q.reject(result);
          }
        }, scope);

        return q.promise;
      },

      registerPermission: function (scope) {
        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.registerPermission(function (result) {
          if (result) {
            q.resolve(result);
          } else {
            q.reject(result);
          }
        }, scope);

        return q.promise;
      },

      promptForPermission: function (scope) {
        console.warn('Deprecated: use "registerPermission" instead.');

        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.registerPermission(function (result) {
          if (result) {
            q.resolve(result);
          } else {
            q.reject(result);
          }
        }, scope);

        return q.promise;
      },

      getAllIds: function (scope) {
        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.getAllIds(function (result) {
          q.resolve(result);
        }, scope);

        return q.promise;
      },

      getIds: function (scope) {
        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.getIds(function (result) {
          q.resolve(result);
        }, scope);

        return q.promise;
      },

      getScheduledIds: function (scope) {
        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.getScheduledIds(function (result) {
          q.resolve(result);
        }, scope);

        return q.promise;
      },

      getTriggeredIds: function (scope) {
        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.getTriggeredIds(function (result) {
          q.resolve(result);
        }, scope);

        return q.promise;
      },

      get: function (ids, scope) {
        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.get(ids, function (result) {
          q.resolve(result);
        }, scope);

        return q.promise;
      },

      getAll: function (scope) {
        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.getAll(function (result) {
          q.resolve(result);
        }, scope);

        return q.promise;
      },

      getScheduled: function (ids, scope) {
        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.getScheduled(ids, function (result) {
          q.resolve(result);
        }, scope);

        return q.promise;
      },

      getAllScheduled: function (scope) {
        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.getAllScheduled(function (result) {
          q.resolve(result);
        }, scope);

        return q.promise;
      },

      getTriggered: function (ids, scope) {
        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.getTriggered(ids, function (result) {
          q.resolve(result);
        }, scope);

        return q.promise;
      },

      getAllTriggered: function (scope) {
        var q = $q.defer();
        scope = scope || null;

        $window.cordova.plugins.notification.local.getAllTriggered(function (result) {
          q.resolve(result);
        }, scope);

        return q.promise;
      },

      getDefaults: function () {
        return $window.cordova.plugins.notification.local.getDefaults();
      },

      setDefaults: function (Object) {
        $window.cordova.plugins.notification.local.setDefaults(Object);
      }
    };
  }]);

})();
