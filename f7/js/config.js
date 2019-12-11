/*jslint browser: true*/
/*global console, MyApp, angular, Framework7*/

// Init angular

var domain = '192.168.0.2';

var Shoper = {};

Shoper.config = {
};

Shoper.angular = angular.module('MyApp', ['ngCordova']);


// Initialize your app

myApp = {
  app : new Framework7({
    material: true,
    swipePanel: 'left',
    materialRipple:true,
    animatePages:true,
    dynamicPageUrl: 'content-{{name}}',
    modalTitle : "Shoper",
    materialPageLoadDelay: 500,
    fastClicks: true,

    //uniqueHistory: true,
  }),


  options : {

  },
  views : []
  };


// Export selectors engine
var $$ = Dom7;

var mainView = myApp.app.addView('.view-main', {
    domCache: true,
});




// Later add callback
/*
mySwiper.on('slideChangeStart', function () {
    console.log('slide change start');
    $$('.toolbar-inner').scrollLeft(200,1)
});
*/


myApp.app.onPageInit('products', function (page) {

var galleryTop = new Swiper('.tabs-swipeable-wrap', {

});
var galleryThumbs = new Swiper('.tabbar-scrollable', {

 //centeredSlides: true,
 slidesPerView: 'auto',
 touchRatio: 0.2,
 slideToClickedSlide: true
});
galleryTop.params.control = galleryThumbs;
galleryThumbs.params.control = galleryTop;

})


myApp.app.onPageInit('foods', function (page) {

var galleryTop = new Swiper('.tabs-swipeable-wrap', {

});
var galleryThumbs = new Swiper('.tabbar-scrollable', {

 //centeredSlides: true,
 slidesPerView: 'auto',
 touchRatio: 0.2,
 slideToClickedSlide: true
});
galleryTop.params.control = galleryThumbs;
galleryThumbs.params.control = galleryTop;

})



/*
myApp.app.onPageBeforeAnimation('products', function (page) {
  // "page" variable contains all required information about loaded and initialized page
  var scope = angular.element(document.getElementById("products")).scope();
     scope.$apply(function () {
     scope.get();
     });
})

myApp.app.onPageReinit('products', function (page) {
  // "page" variable contains all required information about loaded and initialized page

  var scope = angular.element(document.getElementById("products")).scope();
     scope.$apply(function () {
     scope.get();
     });
})
*/
/*
$$('html').on('click', function (e) {
    if ($$(e.target).is('.picker-modal') || $$(e.target).parents('.picker-modal').length > 0) {
        myApp.app.closeModal('.picker-modal');
    }
});
*/
$$('#searchpicker').on('click', function (e) {
  if ($$(e.target).is('#noclick') ) {
   //
  }
  else {
    myApp.app.closeModal('.picker-modal');
  }


});
