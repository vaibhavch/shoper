"""app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from rest_framework import routers
from push_notifications.api.rest_framework import APNSDeviceAuthorizedViewSet, GCMDeviceAuthorizedViewSet
from restapi import views


urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
]

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register("search", views.AutocompleteSearchViewSet, base_name="product-search")
router.register(r'device/apns', APNSDeviceAuthorizedViewSet)
router.register(r'device/gcm', GCMDeviceAuthorizedViewSet)


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^pdf/$', views.pdf, name="pdf"),
    url(r'^time/$', views.time, name="time"),
    url(r'^stafflogin/$', views.staff_login, name="staff_login"),
    url(r'^userinfo/$', views.userinfo, name="userinfo"),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^products/$', views.ProductsList.as_view()),
    url(r'^dailyproducts/$', views.DailyProductsList.as_view()),
    url(r'^foods/$', views.FoodsList.as_view()),
    url(r'^meats/$', views.MeatsList.as_view()),
    url(r'^res/', views.ResList.as_view()),
    url(r'^shops/', views.ShopsList.as_view()),
    url(r'^daily/', views.DailyList.as_view()),
    url(r'^getproduct/$', views.products_fetch, name="get_product"),
    url(r'^getproductcat/$', views.products_fetch_cat, name="get_product_cat"),
    url(r'^getaddress/$', views.address_fetch, name="get_alladdress"),
    url(r'^order/$', views.order, name='order'),
    url(r'^dailyorder/$', views.daily_order, name='daily_order'),
    url(r'^otp/$', views.otp_verify, name='otp'),
    url(r'^verify/$', views.pre_verify, name='preverify'),
    url(r'^logout/$', views.logout, name='logout'),
    url(r'^getalladdress/$',  views.AddressList.as_view()),
    url(r'^wallet/$',  views.wallet_money, name='wallet'),
    url(r'^foodcoupon/$',  views.FoodCoupon, name='foodcoupon'),
    url(r'^orderstatus/$',  views.order_status, name='order_status'),
    url(r'^deliveryorderstatus/$',  views.delivery_order_status, name='delivery_order_status'),
    url(r'^amountget/$',  views.orderamount_fetch, name='orderamount_fetch'),
    url(r'^ebs/$',  views.ebs_payment, name='ebs'),
    url(r'^orderstatusrep/$',  views.order_status_repeat, name='order_status_repeat'),
    url(r'^pastorders/$',  views.PastOrdersList.as_view()),
    url(r'^activeorders/$',  views.ActiveOrdersList.as_view()),
    url(r'^activeorder/$',  views.active_order, name='active_order'),
    url(r'^deliveryorders/$',  views.DeliveryActiveOrdersList.as_view()),
    url(r'^dlatlon/$',  views.delivery_latlon, name='delivery_latlon'),
    url(r'^deliverycheck/$',  views.delivery_assign, name='delivery_assign'),
    url(r'^device/apns/?$', APNSDeviceAuthorizedViewSet.as_view({'post': 'create'}), name='create_apns_device'),
]
