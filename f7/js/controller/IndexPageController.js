/*jslint browser: true*/
/*global console, MyApp*/


Shoper.angular.controller('IndexPageController', ['$controller', '$rootScope', '$compile', '$timeout', '$scope', '$http', 'InitService', 'ProductService', '$window', '$cordovaDevice', '$cordovaGeolocation', '$cordovaSQLite', '$interval', '$q', '$cordovaInAppBrowser',  function ($controller, $rootScope, $compile, $timeout, $scope, $http, InitService, ProductService, $window, $cordovaDevice, $cordovaGeolocation, $cordovaSQLite, $interval, $q, $cordovaInAppBrowser) {
  'use strict';

  var container = $$('body');
     if (container.children('.progressbar, .progressbar-infinite').length) return;



     var options = {
         location: 'no',
         clearcache: 'yes',
         toolbar: 'no'
       };

 $scope.wallet = 0;
  $scope.tel = '';
  $scope.four = '';
  $scope.tokenvalue = '';
 $scope.lat = '0.00';
 $scope.long  = '0.00';

 $scope.ongps = function() {

   document.addEventListener("deviceready", function () {
    var posOptions = {timeout: 10000, enableHighAccuracy: true};
    var SposOptions = {timeout: 1000, enableHighAccuracy: true};

    function onRequestSuccess(success){

      $cordovaGeolocation.getCurrentPosition(SposOptions)
        .then(function (position) {
          $scope.lat  = position.coords.latitude
          $scope.long = position.coords.longitude
          $window.alert($scope.lat+$scope.long);
        }, function(err) {

        });

   }

   function onRequestFailure(error){
    if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
            cordova.plugins.diagnostic.switchToLocationSettings();
    }
   }

   cordova.plugins.locationAccuracy.request(onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);

  $cordovaGeolocation.getCurrentPosition(posOptions)
    .then(function (position) {
      $scope.lat  = position.coords.latitude
      $scope.long = position.coords.longitude
      $window.alert($scope.lat+$scope.long);
    }, function(err) {

    });

 });
}

   document.addEventListener("deviceready", function () {

    $scope.umodel = $cordovaDevice.getModel();

    $scope.uuuid = $cordovaDevice.getUUID();

    $scope.uversion = $cordovaDevice.getVersion();

    $scope.uman = $cordovaDevice.getManufacturer();

    var posOptions = {timeout: 10000, enableHighAccuracy: true};
    var SposOptions = {timeout: 1000, enableHighAccuracy: true};

    function onRequestSuccess(success){

      $cordovaGeolocation.getCurrentPosition(SposOptions)
        .then(function (position) {
          $scope.lat  = position.coords.latitude
          $scope.long = position.coords.longitude
          $window.alert($scope.lat+$scope.long);
        }, function(err) {

        });

   }

   function onRequestFailure(error){
    if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
            cordova.plugins.diagnostic.switchToLocationSettings();
    }
   }

   cordova.plugins.locationAccuracy.request(onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);

  $cordovaGeolocation.getCurrentPosition(posOptions)
    .then(function (position) {
      $scope.lat  = position.coords.latitude
      $scope.long = position.coords.longitude
      $window.alert($scope.lat+$scope.long);
    }, function(err) {

    });

  var db = $cordovaSQLite.openDB({ name: "shoper12.db" });
    db.executeSql("CREATE TABLE IF NOT EXISTS token_table (name, value)");

      var selectquery = "SELECT value FROM token_table LIMIT 1";
   $cordovaSQLite.execute(db, selectquery, []).then(function(res) {
       //$window.alert("token: " + res.rows.item(0)['value']);
       //console.log(res.rows.item(0).value);
        $scope.tokenvalue = res.rows.item(0).value;
       console.log($scope.tokenvalue);
          }, function (err) {
             console.log(err);
       });


    $scope.createtoken = function() {
      var createquery = "INSERT INTO token_table (name, value) VALUES (?,?)";
       $cordovaSQLite.execute(db, createquery, ["token", $scope.token]).then(function(res) {
         console.log(res);

         $cordovaSQLite.execute(db, selectquery, []).then(function(res) {
         //$window.alert("token: " + res.rows.item(0)['value']);
         //console.log(res.rows.item(0).value);
          $scope.tokenvalue = res.rows.item(0).value;
         //console.log(tokenvalue);
            }, function (err) {
               console.log(err);
         });

       //$window.alert("insertId: " + res.insertId);
       }, function (err) {
       console.log(err);
       });
    }


  }, false);



  function phonenumber(inputtxt)
  {
     var mbool = true;
    var phoneno =  /^[789]\d{9}$/;
    if(inputtxt.match(phoneno))
    {
        mbool = true;
    }
    else
    {
      mbool = false;
    }
    return mbool
  }


 var mobilehtml =   '<form id="mobileform">' +
             '<div class="list-block">' +
               '<div class="item-content">' +
                  '<div class="item-media"><i class="icon icon-form-tel"></i></div>' +
                       '<div class="item-input item-input-field">' +
                          '<input type="tel" name="num" class="" autofocus="true" ng-model="tel">' +
                       '</div>' +
               '</div>' +
           '</div>' +
           '</form>';

  var otphtml =  '<form id="otpform">' +
               '<div class="list-block">' +
                  '<div class="item-content">' +
                   '<div class="item-input item-input-field">' +
                   '<input type="tel" name="num" ng-model="four" class="">' +
              '</div>' +
             '</div>' +
            '</div>' +
            '</form>';

  var mobilehtmlcom = $compile(mobilehtml);
  var otphtmlcom = $compile(otphtml);

  var mobilehtmlele = mobilehtmlcom($scope)[0];
  var otphtmlele = otphtmlcom($scope)[0];

  $scope.processcart = function() {
    if($scope.tokenvalue === '') {
      $scope.askmobile();
    }
    else {
      $scope.addresspageload();
    }


  }

  function findIndexInData(data, property, value) {
    var result = -1;
    data.some(function (item, i) {
        if (item[property] === value) {
            result = i;
            return true;
        }
    });
    return result;
}

  $scope.dailyprocesscart = function() {
    $scope.carttype = 'DL';
    var DailyData = myApp.app.formToJSON('#dailyproductform');

    $scope.dailydays = '';
    $scope.dailycustomdate = '';

    if($scope.dailydatetype === "CT") {
      var spliti = DailyData.daterange.split(',');
      //var dailydates = DailyData.daterange.split(' - ');
      //var oneDay = 24 * 60 * 60 * 1000;
      //var dif = Math.round(Math.abs((Date.parse(dailydates[1]) - Date.parse(dailydates[0])) / (oneDay)));

      $scope.dailydays = spliti.length;
      $scope.dailycustomdate = DailyData.daterange;
    }


    var num = findIndexInData($scope.dailyproducts, 'name', DailyData.brand)
    //$scope.dailyproductid  = $scope.dailyproducts[num].id
    if($scope.dailyproducts[0].id === 1){
      $scope.dailyproductid = 1;
      var tot = $scope.dailyproducts[0].sp;
      $scope.total = tot * DailyData.quantity;
    }
    else {
      if(DailyData.qtyradio == '500 ml') {
        $scope.dailyproductid  = $scope.dailyproducts[num].id
        var tot = $scope.dailyproducts[num].sp;
          if($scope.dailydatetype === "CT") {
              $scope.total = (tot * DailyData.quantity) * $scope.dailydays;
          }
          else {
            $scope.total = (tot * DailyData.quantity) * 30;
          }
      }
      else if(DailyData.qtyradio == '1000 ml') {
        $scope.dailyproductid  = $scope.dailyproducts[num+1].id
        var tot = $scope.dailyproducts[num+1].sp;
        if($scope.dailydatetype === "CT") {
            $scope.total = (tot * DailyData.quantity) * $scope.dailydays;
        }
        else {
          $scope.total = (tot * DailyData.quantity) * 30;
        }
      }
    }


    if($scope.tokenvalue === '') {
      $scope.askmobile();
    }
    else {
      $scope.addresspageload();
    }



  }



  function listSMS() {

    var filter = {
           box : 'inbox',
           indexFrom : 0,
           maxCount : 10,
       };

      if(SMS) SMS.listSMS(filter, function(data){
      $scope.readotp = "";
        if(Array.isArray(data)) {
          for(var i in data) {
            var sms = data[i];
            smsList.push(sms);

            if(sms.address.search("SHOPER") === 3) {
              $scope.readotp =  sms.body.match(/\d+/)[0];
            }

          }
        }

      }, function(err){
        //updateStatus('error list sms: ' + err);
      });
  }



  $scope.askmobile = function() {
    var modal = myApp.app.modal({
      title: '',
      text: 'Enter your 10 digit Mobile Number',
      afterText: mobilehtmlele.outerHTML,
    buttons: [
      {
        text: 'Submit',
        bold: true,

        onClick: function () {
          var mobileData = myApp.app.formToJSON('#mobileform');
          $scope.tel= mobileData.num;

          phonenumber($scope.tel);
          if(phonenumber($scope.tel) == true) {

            myApp.app.showProgressbar(container, 'multi');

          $http.get('http://'+domain+':8000/verify/?phone='+$scope.tel+'&uuid='+$scope.uuuid+'&model='+$scope.umodel+'&version='+$scope.uversion+'&man='+$scope.uman+'&format=json').
          success(function(data, status, headers, config) {
            $scope.token = data;
            //$window.alert($scope.token);

            $scope.createtoken();

           myApp.app.hideProgressbar();

            $interval( function(){
                listSMS();
           }, 1000);

           $interval( function(){
             if($scope.readotp.length  > 0) {
               var url = 'http://'+domain+':8000/otp/?four='+$scope.readotp+'&format=json';
               $http({method: 'GET', url, headers: {Authorization: 'Token '+$scope.tokenvalue}}).
               success(function(data, status, headers, config) {
                 if(data == "true") {
                   myApp.app.alert('verified');
                   $scope.addresspageload();

                   myApp.app.hideProgressbar();

                 }

             });
        }

      }, 1500);



         myApp.app.modal({
           title: '',
           text: 'Enter your 4 digit number',
           afterText:  otphtmlele.outerHTML ,
         buttons: [
           {
             text: 'Submit',
             bold: true,
             onClick: function () {
                myApp.app.showProgressbar(container, 'multi');
               var otpData = myApp.app.formToJSON('#otpform');
               $scope.four= otpData.num;
               console.log($scope.tokenvalue);

               var url = 'http://'+domain+':8000/otp/?four='+$scope.four+'&format=json';
               $http({method: 'GET', url, headers: {Authorization: 'Token '+$scope.tokenvalue}}).
               success(function(data, status, headers, config) {
                 if(data == "true") {
                   myApp.app.alert('yeah, verified');
                   $scope.addresspageload();

                   myApp.app.hideProgressbar();

                 }
                 else {
                   myApp.app.alert('that is fucking wrong');

                   myApp.app.hideProgressbar();

                 }

             });
             }
           },
         ]
       })

      });

    }
    else {
        myApp.app.alert('Are you Kidding? :P Its not a valid mobile number');

        myApp.app.hideProgressbar();

    }

  }

      },
    ]
  })

}

  $scope.addresspageload = function() {

     myApp.app.showProgressbar(container, 'multi');

    var url = 'http://'+domain+':8000/getalladdress/?'+'format=json';
    $http({method: 'GET', url, headers: {Authorization: 'Token '+$scope.tokenvalue}}).
    success(function(data, status, headers, config) {
      $scope.addressdata = data;
      if($scope.addressdata.length == 0) {
         $scope.addressdatashow = false;
      }
      else {
         $scope.addressdatashow = true;
      }
   });

    $http.get('address.html').
    success(function(data, status, headers, config) {

      var linkFn = $compile(data);
      var element = linkFn($scope);
      $timeout(function() {
        //$("#index").append(element);
        var addresstext = element[0];
        mainView.router.loadContent(addresstext);

        myApp.app.hideProgressbar();

      });
    });

  }



  $scope.paymentpageload = function() {

    myApp.app.showProgressbar(container, 'multi');

    var productids = [];
    var quantityids = [];
    var type = $scope.carttype;
    var addressData = myApp.app.formToJSON('#addressform');
    var addressid = $$('#addressform .list-block input:checked').val();
    if(addressid == undefined) {
      var addresstype = 'new';
    }
    else {
      var addresstype = 'old';
    }
    var name = addressData.name;
    var address1 = addressData.address1;
    var address2 = addressData.address2;
    var landmark = addressData.landmark;

    if(type == 'DL') {

      var url = 'http://'+domain+':8000/dailyorder/?name='+name+'&area1='+address1+'&area2='+address2+'&landmark='+landmark+'&productid='+$scope.dailyproductid+'&qty='+$scope.dailyproductqty+'&adrtype='+addresstype+'&type='+type+'&addressid='+addressid+'&lat='+$scope.lat+'&long='+$scope.long+'&datetype='+$scope.dailydatetype+'&customdate='+$scope.dailycustomdate+'&days='+$scope.dailydays+'&format=json';
      $http({method: 'GET', url, headers: {Authorization: 'Token '+$scope.tokenvalue}}).
      success(function(data, status, headers, config) {
        $scope.dailyorderid= data;

     });

          $scope.paytotal = $scope.total;

      $http.get('payment.html').
      success(function(data, status, headers, config) {
        var linkFn = $compile(data);
        var element = linkFn($scope);
        $timeout(function() {
          //$("#index").append(element);
          var text = element[0];
          mainView.router.loadContent(text);
          myApp.app.hideProgressbar();

        });
      });


    }
    else {

      if(type == 'GR') {
        angular.forEach($scope.invoice.items, function (x) {
                    productids.push(x.id);
                    quantityids.push(x.qty);
                });
      }
      else  {
        angular.forEach($scope.foodinvoice.items, function (x) {
                    productids.push(x.id);
                    quantityids.push(x.qty);
                });

                var walleturl = 'http://'+domain+':8000/wallet/?format=json';
                $http({method: 'GET', url, headers: {Authorization: 'Token '+$scope.tokenvalue}}).
                success(function(data, status, headers, config) {
                  $scope.wallet= data.wallet;
               });

      }

      var url = 'http://'+domain+':8000/order/?name='+name+'&area1='+address1+'&area2='+address2+'&landmark='+landmark+'&products='+productids+'&quantity='+quantityids+'&adrtype='+addresstype+'&type='+type+'&addressid='+addressid+'&lat='+$scope.lat+'&long='+$scope.long+'&format=json';
      $http({method: 'GET', url, headers: {Authorization: 'Token '+$scope.tokenvalue}}).
      success(function(data, status, headers, config) {
        $scope.orderid= data;

     });

      $http.get('payment.html').
      success(function(data, status, headers, config) {

       if(type == 'FO') {
         $scope.showcoupon = true;
         $scope.paytotal = $scope.foodtotal() - $scope.wallet;
        }
       else {
         $scope.showcoupon = false;
         $scope.paytotal = $scope.total();
       }
        var linkFn = $compile(data);
        var element = linkFn($scope);
        $timeout(function() {
          //$("#index").append(element);
          var text = element[0];
          mainView.router.loadContent(text);
          myApp.app.hideProgressbar();

        });
      });

    }



  }

$scope.couponoff = 0;

  $scope.couponapply = function() {

    myApp.app.showProgressbar(container, 'multi');

    var coupon = myApp.app.formToJSON('#paymentform');
    var code = coupon.coupon;
    var url = 'http://'+domain+':8000/foodcoupon/?orderid='+$scope.orderid+'&code='+code+'&format=json';
    $http({method: 'GET', url, headers: {Authorization: 'Token '+$scope.tokenvalue}}).
    success(function(data, status, headers, config) {
      if(!isNaN(data)) {
        $scope.couponoff = data;
        $scope.paytotal = $scope.foodtotal() - $scope.couponoff;
       myApp.app.addNotification({
        message: 'Coupon Successfully Added'
       });
           myApp.app.hideProgressbar();
      }
      else {
        myApp.app.addNotification({
         message: data,
        });

           myApp.app.hideProgressbar();
      }

   });

  }

 //$scope.orderstatus = "PL";

 $scope.processorder = function() {

  myApp.app.showProgressbar(container, 'multi');

   var paymenttype = $$('#paymentform .list-block input:checked').val();
   if(paymenttype == 'CS') {

     if($scope.carttype == 'DL') {
       $http.get('dailysuccess.html').
       success(function(data, status, headers, config) {
           mainView.router.loadContent(data);
           myApp.app.hideProgressbar();
         });

     }
     else {

       var url = 'http://'+domain+':8000/orderstatus/?'+'orderid='+$scope.orderid+'&paytype='+paymenttype+'&format=json';
       $http({method: 'GET', url, headers: {Authorization: 'Token '+$scope.tokenvalue}}).
       success(function(data, status, headers, config) {
         $scope.orderstatus = data;
           mainView.history = ["#index"];

      });

       $http.get('activeorder.html').
       success(function(data, status, headers, config) {

         var linkFn = $compile(data);
         var element = linkFn($scope);
         $timeout(function() {
           //$("#index").append(element);
           var text = element[0];
           mainView.router.loadContent(text);
           myApp.app.hideProgressbar();

         });
       });

     }


   }

   else if(paymenttype == 'ON') {
     // do soomething nasty

     var url = 'http://'+domain+':8000/amountget/?id='+$scope.orderid+'&format=json';
     $http({method: 'GET', url, headers: {Authorization: 'Token '+$scope.tokenvalue}}).
     success(function(data, status, headers, config) {
       $scope.amount = data;

      document.addEventListener("deviceready", function () {
      $cordovaInAppBrowser.open('http://blankbot.net/payment.html', '_blank', options)
        .then(function(event) {
          // success
        })
        .catch(function(event) {
          // error
        });
      //$cordovaInAppBrowser.close();
    }, false);

    });

   }

 }

 $rootScope.$on('$cordovaInAppBrowser:loadstart', function(e, event){

   });

 $rootScope.$on('$cordovaInAppBrowser:loadstop', function(e, event){

   var codeinject = 'letsstart('+$scope.orderid+','+$scope.amount+');';
  // insert Javascript via code / file
  $cordovaInAppBrowser.executeScript({
    code: codeinject,
  });

  if(event.url == "http://blankbot.net/success.php") {

    $cordovaInAppBrowser.executeScript({
       code: "response()",
       function( values ) {
                $scope.responsecode = values[0];
                $scope.transactionid = values[1];
                $scope.refno = values[2];
                $scope.securehash = values[3];
                $scope.pamount = values[4];

              },
    });
    var url = 'http://'+domain+':8000/ebs/?'+'orderid='+$scope.orderid+'&responsecode='+$scope.responsecode+'&transactionid='+$scope.transactionid+'&referenceno='+$scope.refno+'&securehash='+$scope.securehash+'&amount='+$scope.pamount+'&format=json';
    $http({method: 'GET', url, headers: {Authorization: 'Token '+$scope.tokenvalue}}).
    success(function(data, status, headers, config) {
        //ok
   });

     //sucess
     var url = 'http://'+domain+':8000/orderstatus/?'+'orderid='+$scope.orderid+'&paytype=ON&format=json';
     $http({method: 'GET', url, headers: {Authorization: 'Token '+$scope.tokenvalue}}).
     success(function(data, status, headers, config) {
         $scope.orderstatus = data;
         mainView.history = ["#index"];

    });

    if($scope.carttype == 'DL') {
      $http.get('dailysuccess.html').
      success(function(data, status, headers, config) {
          mainView.router.loadContent(data);
          myApp.app.hideProgressbar();
        });
    }
    else {
        $scope.activeorder($scope.orderid);
    }

  }


});




 $scope.activeorder = function(orderid) {
    myApp.app.showProgressbar(container, 'multi');

    $scope.orderstatus = '';
    $scope.orderdata = '';
    $scope.dorderdata = '';

    $scope.invoice.items = [];
    $scope.foodinvoice.items = [];

       var url = 'http://'+domain+':8000/orderstatusrep/?orderid='+orderid+'&format=json';
       $http({method: 'GET', url, headers: {Authorization: 'Token '+$scope.tokenvalue}}).
       success(function(data, status, headers, config) {
         $scope.orderstatus = data;
      });

      var url = 'http://'+domain+':8000/activeorder/?orderid='+orderid+'&format=json';
      $http({method: 'GET', url, headers: {Authorization: 'Token '+$scope.tokenvalue}}).
      success(function(data, status, headers, config) {
        $scope.orderdata = data;

        if($scope.orderdata.lat === 0) {

           $scope.showmap = false;
        }
        else {

          $scope.showmap = true;

          $interval( function(){
            var url = 'http://'+domain+':8000/dlatlon/?orderid='+orderid+'&format=json';
            $http({method: 'GET', url, headers: {Authorization: 'Token '+$scope.tokenvalue}}).
            success(function(data, status, headers, config) {
              $scope.dorderdata = data;

                var map = new GMaps({
                  el: '#map',
                  lat: $scope.orderdata.lat,
                  lng: $scope.orderdata.lon,
                  zoom: 17,
                });

                map.drawRoute({
                  origin: [$scope.dorderdata.lat,$scope.dorderdata.lon],
                  destination: [$scope.orderdata.lat,$scope.orderdata.lon],
                  travelmode: 'driving',

               });


                map.addMarker({
                  lat: $scope.orderdata.lat,
                  lng: $scope.orderdata.lon,
                  icon: "../../img/home.png",
                  size: 'small',
                 title: 'customer',

               });
               map.addMarker({
                lat: $scope.dorderdata.lat,
                lng: $scope.dorderdata.lon,
                icon: "../../img/boy.png",
                title: 'delivery man',
                size: 'small',

              });

              map.fitZoom();

           });

         }, 15000);


        }


     });

     $http.get('activeorder.html').
     success(function(data, status, headers, config) {

       var linkFn = $compile(data);
       var element = linkFn($scope);
       $timeout(function() {
         //$("#index").append(element);
         var text = element[0];
         mainView.router.loadContent(text);

         myApp.app.hideProgressbar();
       });
     });

 }



   $scope.subpageload = function(cat) {
     myApp.app.showProgressbar(container, 'multi');

     $http.get('js/sub.json').
     success(function(data, status, headers, config) {
          $scope.subdata = data;

   });

      $scope.maincat = cat;
      $scope.maincatno = cat.replace(/ /g,'');

     $http.get('sub.html').
     success(function(data, status, headers, config) {

       var linkFn = $compile(data);
       var element = linkFn($scope);
       $timeout(function() {
         //$("#index").append(element);
         var subtext = element[0];
         mainView.router.loadContent(subtext);
         myApp.app.hideProgressbar();
       });
     });

   }


   $scope.reslistpageload = function() {
     myApp.app.showProgressbar(container, 'multi');

     $http.get('restaurants.html').
     success(function(data, status, headers, config) {
          $scope.reshtml = data;
      });
     $http.get('http://'+domain+':8000/res/?format=json').
     success(function(data, status, headers, config) {
       $scope.reslist = data;
       var linkFn = $compile($scope.reshtml);
       var element = linkFn($scope);
       $timeout(function() {
         //$("#index").append(element);
         var restext = element[0];
         mainView.router.loadContent(restext);
         myApp.app.hideProgressbar();
       });

   });

   }


   $scope.dailylistpageload = function() {
      myApp.app.showProgressbar(container, 'multi');
     $http.get('dailysub.html').
     success(function(data, status, headers, config) {
          $scope.dailyhtml = data;
      });
     $http.get('http://'+domain+':8000/daily/?format=json').
     success(function(data, status, headers, config) {
       $scope.dailysubdata = data;
       var linkFn = $compile($scope.dailyhtml);
       var element = linkFn($scope);
       $timeout(function() {
         //$("#index").append(element);
         var dailytext = element[0];
         mainView.router.loadContent(dailytext);
         myApp.app.hideProgressbar();
       });

   });

   }



     $scope.foodPageload = function(resname) {

       myApp.app.showProgressbar(container, 'multi');

        $scope.resname = resname;
       $http.get('http://'+domain+':8000/foods/?res='+resname+'&format=json').
       success(function(data, status, headers, config) {

         $scope.foods = data;
         var i;
           $scope.fooduniqueNames = [];
       for(i = 0; i< $scope.foods.length; i++){
           if($scope.fooduniqueNames.indexOf($scope.foods[i].cat2) === -1){
               $scope.fooduniqueNames.push($scope.foods[i].cat2);
           }
       }

       $http.get('foods.html').
       success(function(data, status, headers, config) {

         var linkFn = $compile(data);
         var element = linkFn($scope);

         $timeout(function() {
           //$("#index").append(element);
           var foodtext = element[0];

           mainView.router.loadContent(foodtext);
           myApp.app.hideProgressbar();
         });
       });

       }).
       error(function(data, status, headers, config)  {
         myApp.app.alert('Sorry! No food');
         // log error
       });



     }


   $scope.searchpicker = function(id) {

     myApp.app.showProgressbar(container, 'multi');

     $http.get('searchproducts.html').
     success(function(data, status, headers, config) {
          $scope.searchhtml = data;

          $http.get('http://'+domain+':8000/getproduct/?id='+id+'&format=json').
          success(function(data, status, headers, config) {
            $scope.searchproduct = data;

            var linkFn = $compile($scope.searchhtml);
            var element = linkFn($scope);
            $timeout(function() {
              //$("#index").append(element);
              var text = element[0];
              $$('#searchpicker').append(text);
              myApp.app.pickerModal('.picker-modal')
              myApp.app.hideProgressbar();

            });

             }).
          error(function(data, status, headers, config)  {
            // log error
             });

         });

 }






   $scope.searchproduct = [];

$scope.invoice = {
    items : [],
   };

  $scope.foodinvoice = {
       items : [],
      };

var added = false;



$scope.grocerycheck = function() {
   var really = false;
   if($scope.invoice.items.length != 0) {
     really =  true;
   }
   else {
     really = false;
   }
  return really;
}


$scope.foodcheck = function() {
   var really = false;
   if($scope.foodinvoice.items.length === 0) {
     really =  false;
   }
   else {
     really = true;
   }
  return really;
}


$scope.addItem = function(product) {
  console.log(product.id);

   $scope.foodinvoice.items = [];

  var inCart = $scope.checkItem(product.id);

  if (typeof inCart === 'object'){

    angular.forEach($scope.invoice.items, function (x) {
                if  (x.id === product.id) {
                    x.qty++;

                }
            });

     }
     else {
       $scope.invoice.items.push({
               id:product.id,
               quantity:product.quantity,
               qty:1,
               name:product.name,
               sp:product.sp,
               img:product.image,
           });

     }

  }


  $scope.minusItem = function(product) {

    var inCart = $scope.checkItem(product.id);

    if (typeof inCart === 'object'){

      angular.forEach($scope.invoice.items, function (x) {
                  if  (x.id === product.id) {
                    if(x.qty === 1) {
                       $scope.removeItem(product);
                    }
                    else {
                      x.qty--;

                    }

                  }
              });

       }

   }


  $scope.checkItem = function (product) {
           var build = false;
           angular.forEach($scope.invoice.items, function (x) {
               if  (x.id === product) {
                   build = x;
               }
           });
           return build;
       }

$scope.removeItem = function(index) {
$scope.invoice.items.splice(index, 1);
}

$scope.total = function() {
var total = 0;
angular.forEach($scope.invoice.items, function(item) {
total += item.qty * item.sp;
})
return Math.round(total * 100) / 100;
}

   $scope.checkCart = function (product) {
      var already = false;
     angular.forEach($scope.invoice.items, function (x) {
                 if  (x.id === product.id) {
                      already = true;
                 }
             });
             return already;

     }


     $scope.checkQty = function(product) {
         var counter= 0;
         angular.forEach($scope.invoice.items, function (x) {
                     if  (x.id === product.id) {
                          counter = x.qty;
                     }
                 });

          return counter;
     }


   // Food cart

   $scope.foodaddItem = function(product) {
     console.log(product.id);

     $scope.invoice.items = [];

     var inCart = $scope.foodcheckItem(product.id);

     if (typeof inCart === 'object'){

       angular.forEach($scope.foodinvoice.items, function (x) {
                   if  (x.id === product.id) {
                       x.qty++;

                   }
               });

        }
        else {
          $scope.foodinvoice.items.push({
                  id: product.id,
                  quantity: product.quantity,
                  qty: 1,
                  name: product.name,
                  sp: product.sp,
              });

        }

     }


     $scope.foodminusItem = function(product) {

       var inCart = $scope.foodcheckItem(product.id);

       if (typeof inCart === 'object'){

         angular.forEach($scope.foodinvoice.items, function (x) {
                     if  (x.id === product.id) {
                       if(x.qty === 1) {
                          $scope.foodremoveItem(product);
                       }
                       else {
                         x.qty--;

                       }

                     }
                 });

          }

      }


     $scope.foodcheckItem = function (product) {
              var build = false;
              angular.forEach($scope.foodinvoice.items, function (x) {
                  if  (x.id === product) {
                      build = x;
                  }
              });
              return build;
          }

   $scope.foodremoveItem = function(index) {
   $scope.foodinvoice.items.splice(index, 1);
   }

   $scope.foodtotal = function() {
   var total = 0;
   angular.forEach($scope.foodinvoice.items, function(item) {
   total += item.qty * item.sp;
   })
   return total;
   }

      $scope.foodcheckCart = function (product) {
         var already = false;
        angular.forEach($scope.foodinvoice.items, function (x) {
                    if  (x.id === product.id) {
                         already = true;
                    }
                });
                return already;

        }


        $scope.foodcheckQty = function(product) {
            var counter= 0;
            angular.forEach($scope.foodinvoice.items, function (x) {
                        if  (x.id === product.id) {
                             counter = x.qty;
                        }
                    });

             return counter;
        }

// normal cart page
   $scope.cartPage = function() {
     myApp.app.showProgressbar(container, 'multi');

     $scope.carttype = "GR";
     $http.get('cart.html').
     success(function(data, status, headers, config) {

       var linkFn = $compile(data);
       var element = linkFn($scope);
       //var mainView = myApp.app.addView('.view-main');
       //mainView.router.loadContent(element);
       $timeout(function() {

         var text = element[0];

         //mainView.router.load({pageName: 'products'});
         mainView.router.loadContent(text);
         myApp.app.hideProgressbar();
       });
     });

   }

// food cart page

$scope.foodcartPage = function() {
  myApp.app.showProgressbar(container, 'multi');

$scope.carttype = "FO";
  $http.get('foodcart.html').
  success(function(data, status, headers, config) {

    var linkFn = $compile(data);
    var element = linkFn($scope);
    //var mainView = myApp.app.addView('.view-main');
    //mainView.router.loadContent(element);
    $timeout(function() {

      var text = element[0];

      //mainView.router.load({pageName: 'products'});
      mainView.router.loadContent(text);
      myApp.app.hideProgressbar();
    });
  });

}


$rootScope.$on("CallParentMethod", function() {
           $scope.parentmethod();
        });

        $scope.parentmethod = function() {

          myApp.app.showProgressbar(container, 'multi');

          var name = ProductService.pName();
          $scope.catname = name;

           $http.get('http://'+domain+':8000/products/?cat='+name+'&format=json').
           success(function(data, status, headers, config) {
             if(data.length == 0) {
               myApp.app.alert('Sorry! No product');
             }
             $scope.products = data;
             var i;
               $scope.uniqueNames = [];
           for(i = 0; i< $scope.products.length; i++){
               if($scope.uniqueNames.indexOf($scope.products[i].cat3) === -1){
                   $scope.uniqueNames.push($scope.products[i].cat3);
               }
           }

           $http.get('products.html').
           success(function(data, status, headers, config) {

             var linkFn = $compile(data);
             var element = linkFn($scope);

             $timeout(function() {
               //$("#index").append(element);
               var text = element[0];

               mainView.router.loadContent(text);
               myApp.app.hideProgressbar();
             });
           });

           }).
           error(function(data, status, headers, config)  {
             myApp.app.alert('Sorry! No product');
             // log error
           });

    }


    $scope.load = function (name) {
      console.log(name);
      ProductService.pSetName(name);
     // $scope.$broadcast("fuck");

      $rootScope.$emit("CallParentMethod", {});
     // var newScope = $scope.$new();
      //execute controller
     // var ppcInstance = $controller('ProductsPageController', {$scope: newScope});


/*
      var scope = angular.element(document.getElementById("products")).scope();
         scope.$root$apply(function () {
         scope.get();
         });
         */

    }



    $scope.dailyproductload = function(e) {
     console.log(e);

     $scope.dailyproductname = e;

      myApp.app.showProgressbar(container, 'multi');

     $scope.dailyshowpicker = false;

      $http.get('http://'+domain+':8000/dailyproducts/?cat='+e+'&format=json').
      success(function(data, status, headers, config) {
        if(data.length == 0) {
          myApp.app.alert('Sorry! No product');
        }
        $scope.dailyproducts = data;
        $scope.dailyproductstext = data[0].text;

        if($scope.dailyproducts.length > 2) {
           $scope.dailyshowpicker = true;

           var i;
             $scope.dailyuniqueQty = [];
             $scope.dailynames = [];

         for(i = 0; i< $scope.dailyproducts.length; i++){
             if($scope.dailyuniqueQty.indexOf($scope.dailyproducts[i].quantity) === -1){
                 $scope.dailyuniqueQty.push($scope.dailyproducts[i].quantity);
             }
               $scope.dailynames.push($scope.dailyproducts[i].name);
         }

        console.log($scope.dailyuniqueQty);
        console.log($scope.dailynames);

        }


      $http.get('dailyproduct.html').
      success(function(data, status, headers, config) {

        var linkFn = $compile(data);
        var element = linkFn($scope);

        $timeout(function() {
          //$("#index").append(element);
          var text = element[0];

          mainView.router.loadContent(text);
          myApp.app.hideProgressbar();

          var pickerDevice =   myApp.app.picker({
               input: '#picker-device',
               cols: [
                   {
                       textAlign: 'center',
                       values: $scope.dailynames
                   }
               ]
           });


           var calendarMultiple = myApp.app.calendar({
               input: '#ks-calendar-multiple',
               dateFormat: 'dd M yyyy',
               //rangePicker: true,
               multiple: true,
           });

            var DailyData = myApp.app.formToJSON('#dailyproductform');

            $$('input[type="range"]').on('input change', function(){
              $scope.dailyproductqty = this.value;
              $$('#qtynum')[0].innerHTML = this.value
            });

            //var DailyData = myApp.app.formToJSON('#dailyproductform');

            $$('#defaultdate').on('click', function(){
              console.log('yes');
              $scope.dailydatetype = '';
              $scope.dailydatetype = 'DF';

              $scope.dailydates = '';
              $scope.dailycustomdate = '';
            });

            $$('#customdate').on('click', function(){
              console.log('yes');
              $scope.dailydatetype = '';
              $scope.dailydatetype = 'CT';

              $scope.dailydefaultdate = '';
            });

        });
      });

      }).
      error(function(data, status, headers, config)  {
        myApp.app.alert('Sorry! No products');
        // log
    })

   }



   $scope.loadSearchPage = function() {


    console.log('search page loaded');
     myApp.app.autocomplete({
         openIn: 'page', //open in page
         opener: $$('#searchbox'), //link that opens autocomplete
         valueProperty: 'id', //object's "value" property name
         textProperty: 'name', //object's "text" property name
         limit: 50,
         preloader: true, //enable preloader
         preloaderColor: 'white', //preloader color
         updateInputValueOnSelect: true,
         source: function (autocomplete, query, render) {
             var results = [];
             if (query.length < 3) {
                 render(results);
                 return;
             }
             // Show Preloader
             autocomplete.showPreloader();
             // Do Ajax request to Autocomplete data
             $$.ajax({
                 url: 'http://'+domain+':8000/search/',
                 method: 'GET',
                 dataType: 'json',
                 //send "query" to server. Useful in case you generate response dynamically
                 data: {
                     q: query
                 },
                 success: function (data) {
                     // Find matched items
                     for (var i = 0; i < data.length; i++) {
                         if (data[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i]);

                     }
                     // Hide Preoloader
                     autocomplete.hidePreloader();
                     // Render items by passing array with result items
                     render(results);

                     $$('.label-radio .item-media').remove();

                 }
             });

         },
         onChange: function (autocomplete, value) {

           var scope = angular.element(document.getElementById("index")).scope();
              scope.$apply(function () {
              scope.searchpicker(value[0].id);
              });


               console.log(value[0].id);

               // Add item text value to item-after
             $$('#autocomplete-standalone').find('.item-after').text(value[0].name);
             // Add item value to input value
             $$('#autocomplete-standalone').find('input').val(value[0].id);
         }

     });

     $$('.searchbar-input input').focus();


   }

$scope.formatdate = function(x) {
   return Date.parse(x);

}

   $scope.pastorders = function() {

     if($scope.tokenvalue != "") {
       myApp.app.showProgressbar(container, 'multi');

      var url = 'http://'+domain+':8000/pastorders/?format=json';
      $http({method: 'GET', url, headers: {Authorization: 'Token '+$scope.tokenvalue}}).
      success(function(data, status, headers, config) {
        var pastordersdata = data;

        $scope.pastordersnested = [];
        if(pastordersdata[0].type == 'FO') {
           $scope.productcattype = 'FO';
        }
        else {
           $scope.productcattype = 'GR';
        }

         angular.forEach(pastordersdata, function(value, key) {
             var addressdatac = [];
              var productsnes = [];
              var valuec = value.productidarray.replace(/[\[\]']+/g,'').split(',');
              var valueqc = value.quantityidarray.replace(/[\[\]']+/g,'').split(',');

              angular.forEach(valuec , function(x) {
                //console.log('yeah')
                 var url = 'http://'+domain+':8000/getproductcat/?id='+x.trim()+'&type='+$scope.productcattype+'&format=json';
                 $http({method: 'GET', url, headers: {Authorization: 'Token '+$scope.tokenvalue}}).
                 success(function(data, status, headers, config) {
                    productsnes.push(data);
                });
               });

                  var url = 'http://'+domain+':8000/getaddress/?id='+value.address+'&format=json';
                  $http({method: 'GET', url, headers: {Authorization: 'Token '+$scope.tokenvalue}}).
                  success(function(data, status, headers, config) {
                    addressdatac.push(data);
                 });

                 var cleandate = moment(value.datentime).calendar();
                 console.log(cleandate);

                 $timeout(function() {


                   $scope.pastordersnested.push({
                     dateNtime : cleandate,
                     total: value.total,
                     address: addressdatac,
                     products: {
                       product: productsnes,
                       qty: valueqc,
                     },
                     status: value.status,
                   });
                 });


              });


                $http.get('pastorders.html').
                success(function(data, status, headers, config) {
                  console.log($scope.pastordersnested);
                  var linkFn = $compile(data);
                  var element = linkFn($scope);

                  $timeout(function() {
                    //$("#index").append(element);
                    var text = element[0];

                    mainView.router.loadContent(text);
                    myApp.app.hideProgressbar();
                  });
                });


     });

   } else {
     $http.get('no.html').
     success(function(data, status, headers, config) {
         mainView.router.loadContent(data);
         myApp.app.hideProgressbar();

     });
   }



 }

$scope.showactivetab = false;

$scope.ActiveOrdersPage = function() {

  if($scope.tokenvalue != "") {

    $scope.activeordersnested = [];


     angular.forEach($scope.activeordersdata, function(value, key) {

       if(value.type == 'FO') {
          var cattype = 'FO';
       }
       else {
          var cattype = 'GR';
       }

         var orderid = value.id;
         var addressdatac = [];
          var productsnes = [];
          var valuec = value.productidarray.replace(/[\[\]']+/g,'').split(',');
          var valueqc = value.quantityidarray.replace(/[\[\]']+/g,'').split(',');

          angular.forEach(valuec , function(x) {
            //console.log('yeah')
             var url = 'http://'+domain+':8000/getproductcat/?id='+x.trim()+'&type='+cattype+'&format=json';
             $http({method: 'GET', url, headers: {Authorization: 'Token '+$scope.tokenvalue}}).
             success(function(data, status, headers, config) {
                productsnes.push(data);
            });
           });

              var url = 'http://'+domain+':8000/getaddress/?id='+value.address+'&format=json';
              $http({method: 'GET', url, headers: {Authorization: 'Token '+$scope.tokenvalue}}).
              success(function(data, status, headers, config) {
                addressdatac.push(data);
             });

             var cleandate = moment(value.datentime).calendar();
             console.log(cleandate);

             $timeout(function() {


               $scope.activeordersnested.push({
                 id: orderid,
                 dateNtime : cleandate,
                 total: value.total,
                 address: addressdatac,
                 products: {
                   product: productsnes,
                   qty: valueqc,
                 },
                 status: value.status,
               });
             });


          });

    $http.get('activeorders.html').
    success(function(data, status, headers, config) {
      var linkFn = $compile(data);
      var element = linkFn($scope);

      $timeout(function() {
        //$("#index").append(element);
        var text = element[0];

        mainView.router.loadContent(text);
        myApp.app.hideProgressbar();
      });
    });

  } else {
    $http.get('no.html').
    success(function(data, status, headers, config) {
        mainView.router.loadContent(data);
        myApp.app.hideProgressbar();

    });
  }

}


       $interval( function(){

         if($scope.tokenvalue != "") {
         var url = 'http://'+domain+':8000/activeorders/?format=json';
         $http({method: 'GET', url, headers: {Authorization: 'Token '+$scope.tokenvalue}}).
         success(function(data, status, headers, config) {
           $scope.activeordersdata = data;
           console.log($scope.activeordersdata);
           if($scope.activeordersdata  != '[]') {
             $scope.showactivetab = true;
           }

         });
        }

       }, 5000);



$interval( function(){

   if(Offline.state === "down") {
     myApp.app.alert('Seems you are not connected to the Internet :(');
   }

}, 5000);

$scope.createfeedback = function() {
   var modal = myApp.app.modal({
     title: 'What do you think about this order?',
     text: '',
     buttons: [
       {
         text: 'Bad :('
       },
       {
         text: 'Ok :|'
       },
       {
         text: 'Awesome :)',
         bold: true,
       },
     ]
   })


}





  InitService.addEventListener('ready', function () {
    // DOM ready
    console.log('IndexPageController: ok, DOM ready');
    // You can access angular like this:
    // Shoper.angular

    // And you can access Framework7 like this:
    // MyApp
  });

}]);
