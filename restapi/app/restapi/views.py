import random, math
import urllib.request
import urllib.parse
from operator import mul
from django.shortcuts import render
from django.contrib.auth.models import User, Group
from restapi.models import Products, UserInfo, UserAddress, Orders, Feedback, Foods, Restaurants, DailyCategory, DailyProducts, UserAddress, Coupons, OrdersDelivery, DeliveryBoyInfo, DailySubscriptions, Shops, EbsPayments
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import authentication
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import permissions
from restapi.serializers import UserSerializer, GroupSerializer, ProductsSerializer, FoodsSerializer, ProductsFetchSerializer, PastOrdersSerializer, AutocompleteSerializer, ResSerializer, DailySerializer, DailyProductsSerializer, AddressSerializer, WalletSerializer, CouponsSerializer, AddressFetchSerializer, AmountFetchSerializer, LatLonSerializer, ActiveOrderSerializer, ShopsSerializer, MeatsSerializer
from rest_framework.response import Response
from rest_framework import generics

from rest_framework.authtoken.models import Token
from drf_haystack.filters import HaystackAutocompleteFilter

from drf_haystack.viewsets import HaystackViewSet


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

# Create your views here.
class ProductsList(generics.ListAPIView):
      serializer_class = ProductsSerializer

      def get_queryset(self):
        queryset = Products.objects.all()
        products = self.request.query_params.get('cat', None)
        if products is not None:
           queryset = queryset.filter(cat2=products)
        return queryset


class DailyProductsList(generics.ListAPIView):
      serializer_class = DailyProductsSerializer

      def get_queryset(self):
        queryset = DailyProducts.objects.all()
        products = self.request.query_params.get('cat', None)
        if products is not None:
           queryset = queryset.filter(cat2=products)
        return queryset


class FoodsList(generics.ListAPIView):
      serializer_class = FoodsSerializer

      def get_queryset(self):
        queryset = Foods.objects.all()
        foods = self.request.query_params.get('res', None)
        if foods is not None:
           queryset = queryset.filter(brand=foods)
        return queryset
		
		
class MeatsList(generics.ListAPIView):
      serializer_class = MeatsSerializer

      def get_queryset(self):
        queryset = Products.objects.all()
        meats = self.request.query_params.get('shop', None)
        if meats is not None:
           queryset = queryset.filter(brand=meats)
        return queryset


class ResList(generics.ListAPIView):
      serializer_class = ResSerializer

      def get_queryset(self):
        queryset = Restaurants.objects.all()
        return queryset
		

class ShopsList(generics.ListAPIView):
      serializer_class = ShopsSerializer

      def get_queryset(self):
        queryset = Shops.objects.all()
        return queryset


class DailyList(generics.ListAPIView):
      serializer_class = DailySerializer

      def get_queryset(self):
        queryset = DailyCategory.objects.all()
        return queryset



class PastOrdersList(generics.ListAPIView):
      serializer_class = PastOrdersSerializer

      def get_queryset(self):
        queryset = Orders.objects.filter(user = self.request.user, status='DL')
        return queryset


class ActiveOrdersList(generics.ListAPIView):
      serializer_class = PastOrdersSerializer

      def get_queryset(self):
        queryset = Orders.objects.filter(user = self.request.user, status__in=['PL','DS'])
        return queryset


class DeliveryActiveOrdersList(generics.ListAPIView):
      serializer_class = PastOrdersSerializer

      def get_queryset(self):
        orders = OrdersDelivery.objects.filter(user = self.request.user).values_list('order', flat=True)
        queryset = Orders.objects.filter(id__in=orders, status='PL')
        return queryset



class AutocompleteSearchViewSet(HaystackViewSet):

    index_models = [Products]
    serializer_class = AutocompleteSerializer
    filter_backends = [HaystackAutocompleteFilter]



class AddressList(generics.ListAPIView):
      serializer_class = AddressSerializer

      def get_queryset(self):
        user = self.request.user
        queryset = UserAddress.objects.filter(user = user)
        return queryset
		
		
		
@api_view(['GET'])
def order(request):
  sprices = []
  mprices = []
  if request.method == 'GET':
    uname = request.GET.get('name','')
    #uproducts = request.GET.get('products', '')
    #uquantity = request.GET.get('quantity', '')
    uhouse = request.GET.get('house','')
    uarea1 = request.GET.get('area1','')
    uarea2 = request.GET.get('area2','')
    ulandmark = request.GET.get('landmark','')
    uadrtype = request.GET.get('adrtype','')
    type = request.GET.get('type','')
    uaddressid = request.GET.get('addressid','')
    lat = request.GET.get('lat','')
    long = request.GET.get('long','')
    uproducts = [int(x) for x in request.GET.get('products',[]).split(',')]
    uquantity = [int(x) for x in request.GET.get('quantity',[]).split(',')]
       
    for v in uproducts:
      if type == "FO":
         sp = Foods.objects.get(pk = v).sp
      if type == "GR":
         sp = Products.objects.get(pk = v).sp
      spc = int(float(sp))
      sprices.append(spc)
     
    multiply = [a*b for a,b in zip(uquantity,sprices)]
    utotal = sum(multiply)
    #pricedif = list(map(operator.sub, mprices, sprices))
    #udiscount = sum(pricedif)


    if uadrtype == "old":
        uaddress = UserAddress.objects.get(id = uaddressid)
                   
        createorder = Orders(user=request.user, productidarray=uproducts, quantityidarray=uquantity, total=utotal, address =uaddress, type= type, lat = lat, lon = long, status= 'IN')
        createorder.save()
        return Response(createorder.id)

    if uadrtype == "new":
        useraddress = UserAddress(user=request.user, name = uname, house=uhouse, area1=uarea1, area2=uarea2, landmark=ulandmark)
        useraddress.save()
    
        createorder = Orders(user=request.user, productidarray=uproducts, quantityidarray=uquantity, total=utotal, address =useraddress,  type= type, lat = lat, lon = long, status= 'IN')
        createorder.save()
        return Response(createorder.id)
       


@api_view(['GET'])
def pre_verify(request):
    uphone = request.GET.get('phone','')
    uuuid =  request.GET.get('uuid','')
    umodel = request.GET.get('model','')
    uversion = request.GET.get('version','')
    uman = request.GET.get('man','')
    uemail = 'jujubi@shoper.in'
    random_password = User.objects.make_random_password(length=10, allowed_chars='123456789')
    random_username = 'shoper' + str(random.randint(1000,9999))
    random_otp = str(random.randint(1000,9999))
    #random_otp = '1234';
    isalready = UserInfo.objects.filter(uuid=uuuid, uuid__isnull=False)
    if isalready:
       userid = UserInfo.objects.get(uuid=uuuid)
       token = Token.objects.get(user=userid.user)
       return Response(token.key)
    else:
       user = User.objects.create_user(random_username, uemail, random_password)
       user.save()
       userinfo = UserInfo(user=user, mobile=uphone, uuid=uuuid, model=umodel, version=uversion, man=uman, otp=random_otp, otpstatus=0)
       userinfo.save()
       token = Token.objects.create(user=user)
       #send sms to mobile phone using sms gateway
       
       headers = { 'Content-Type': 'application/json' }
       values = {'method' : 'sms',
                 'api_key' : 'Aa0bcb8adeb7b52c3ae8dd9d3ec16b64a',
                 'to' : uphone,
                 'sender' : 'SHOPER',
                 'message' : 'Your Shoper verification code is '+random_otp+' Enjoy :)',
                 'format' : 'json',
                 'flash' : '0',
                 }

       data = urllib.parse.urlencode(values)
       fullurl = "http://api.alerts.solutionsinfini.com/v3/?" + data
       urllib.request.urlopen(fullurl)
       return Response(token.key)

	
@api_view(['GET'])
def otp_verify(request):
    four = request.GET.get('four')
    currentuser = UserInfo.objects.get(user = request.user)
    if request.user.is_authenticated():
      if currentuser.otp == four:
        currentuser.otpstatus = 1
        currentuser.save()
        return Response("true")
      else:
        return Response("false")



@api_view(['GET'])
def order_status(request):
     orderid = request.GET.get('orderid','')
     paytype = request.GET.get('paytype','')
     currentorder = Orders.objects.get(id= orderid)
     currentorder.status = 'PL';
     currentorder.save()
     currentorder.paytype = paytype
     currentorder.save()
     return Response(currentorder.status)
	 
	 
@api_view(['GET'])
def delivery_order_status(request):
     orderid = request.GET.get('orderid','')
     status = request.GET.get('status','')
     currentorder = Orders.objects.get(id= orderid)
     currentorder.status = status;
     currentorder.save()
     return Response(currentorder.status)
	 
	 
@api_view(['GET'])
def order_status_repeat(request):
     orderid = request.GET.get('orderid','')
     currentorder = Orders.objects.get(id= orderid)
     return Response(currentorder.status)


@api_view(['GET'])
def create_feedback(request):
     orderid = request.GET.get('orderid','')
     rate = request.GET.get('rate','')
     ucomments = request.GET.get('comments','')
     if request.user.is_authenticated():
         uorder = Orders.objects.get(id=orderid)
         feedback = Feedback(user=request.user, order = uorder, ratetype=rate, comments = ucomments)
         feedback.save()
           
 
 
 
@api_view(['GET'])
def daily_order(request):
  if request.method == 'GET':
    uname = request.GET.get('name','')
    uhouse = request.GET.get('house','')
    uarea1 = request.GET.get('area1','')
    uarea2 = request.GET.get('area2','')
    ulandmark = request.GET.get('landmark','')
    uadrtype = request.GET.get('adrtype','')
    type = request.GET.get('type','')
    uaddressid = request.GET.get('addressid','')
    lat = request.GET.get('lat','')
    long = request.GET.get('long','')
    uproductid = request.GET.get('productid', '')
    uquantity = request.GET.get('qty', '')
    udatetype = request.GET.get('datetype', '')
    ucustomdate = request.GET.get('customdate', '')
    udays = request.GET.get('days', '')
       
    sp = DailyProducts.objects.get(pk = uproductid).sp
    spc = int(sp)

    if udatetype == "DF":
       if uproductid == '1':
          utotal = spc*int(uquantity)
       else:
          utotal = (spc*int(uquantity))*30
    elif udatetype == "CT":
       utotal = (spc*int(uquantity))*int(udays)

    dailyproduct = DailyProducts.objects.get(pk = uproductid)

    if uadrtype == "old":
        uaddress = UserAddress.objects.get(id = uaddressid)
        
        createorder = DailySubscriptions(user=request.user, productid=dailyproduct, quantity=int(uquantity), total=utotal, address =uaddress, lat = lat, lon = long, paytype='X', datetype=udatetype, customdate=ucustomdate, days=udays)
        createorder.save()
        return Response(createorder.id)

    if uadrtype == "new":
        useraddress = UserAddress(user=request.user, name = uname, house=uhouse, area1=uarea1, area2=uarea2, landmark=ulandmark)
        useraddress.save()
    
        createorder = DailySubscriptions(user=request.user, productid=dailyproduct, quantity=uquantity, total=utotal, address =useraddress, lat = lat, lon = long, paytype='X', datetype=udatetype, customdate=ucustomdate, days=udays)
        createorder.save()
        return Response(createorder.id)


@api_view(['GET'])
def past_orders(request):
    orders = Orders.objects.get(user=request.user)
    serializer = PastOrdersSerializer(orders)
    return Response(serializer.data)
	
	
	
@api_view(['GET'])
def active_orders(request):
    orders = Orders.objects.filter(user=request.user)
    placedorders = orders.objects.filter(status = 'PL')
    serializer = PastOrdersSerializer(placedorders)
    return Response(serializer.data)
	
	
@api_view(['GET'])
def active_order(request):
    orderid = request.GET.get('orderid','')
    order = Orders.objects.get(user=request.user, id=orderid)
    serializer = ActiveOrderSerializer(order)
    return Response(serializer.data)
	
	
	
	
@api_view(['GET'])
def wallet_money(request):
    if request.user.is_authenticated():
       money = UserInfo.objects.get(user=request.user).wallet   
       return Response(money)
	   
	  
	
	
@api_view(['GET'])
def products_fetch(request):
    uid = request.GET.get('id','')
    products = Products.objects.get(id=uid)
    serializer = ProductsFetchSerializer(products)
    return Response(serializer.data)
	
	
@api_view(['GET'])
def ebs_payment(request):
    orderid = request.GET.get('orderid','')
    responsecode = request.GET.get('responsecode','')
    referenceno = request.GET.get('referenceno','')
    transactionid = request.GET.get('transactionid','')
    securehash = request.GET.get('securehash','')
    amount = request.GET.get('amount','')
    createebs = EbsPayments(user=request.user, responsecode=responsecode, transactionid=transactionid, refno=referenceno, hash=securehash, amount=amount)
    createebs.save()
    return Response("Ok")
	
	
@api_view(['GET'])
def products_fetch_cat(request):
    uid = request.GET.get('id','')
    type = request.GET.get('type','')
    if type == 'GR':
       products = Products.objects.get(id=uid)
       serializer = ProductsFetchSerializer(products)
       return Response(serializer.data)
    else:
       foods = Foods.objects.get(id=uid)
       serializer = FoodsSerializer(foods)
       return Response(serializer.data)
	
	
@api_view(['GET'])
def address_fetch(request):
    uid = request.GET.get('id','')
    address = UserAddress.objects.get(id=uid)
    serializer = AddressFetchSerializer(address)
    return Response(serializer.data)
	
	
@api_view(['GET'])
def delivery_latlon(request):
    orderid = request.GET.get('orderid','')
    duseris = OrdersDelivery.objects.filter(order=orderid, order__isnull=False)
    if duseris:
       duser = OrdersDelivery.objects.get(order=orderid).user
       duserinfo = DeliveryBoyInfo.objects.get(user=duser)
       serializer = LatLonSerializer(duserinfo)
       return Response(serializer.data)
    else:
       return Response('no')

    
@api_view(['GET'])
def orderamount_fetch(request):
    uid = request.GET.get('id','')
    order = Orders.objects.get(id=uid).total
    return Response(order)
	
	
	
firstorderoff = 150
firstordercashback = 50
normaloff = 0
normalcashback = 150


@api_view(['GET'])
def FoodCoupon(request):
    ucode = request.GET.get('code','')
    orderid = request.GET.get('orderid','')
    couponyes = Coupons.objects.filter(code=ucode, code__isnull=False)
    if couponyes:
       currentuser = UserInfo.objects.get(user = request.user)
       currentwallet = currentuser.wallet
       orderfirst = Orders.objects.filter(user = request.user).exists()
       currentorder = Orders.objects.get(id = orderid)
       ordertotal = currentorder.total
       if orderfirst:
         if(ordertotal > 449):
            currentorder.discount = firstorderoff
            currentorder.save()
            currentorder.total - firstorderoff
            currentorder.save()
            return Response(firstorderoff)
         else:
            return Response("Order Amount Should be minimum Rs.450")

       else:
         if(ordertotal > 449):
            currentorder.total - currentwallet
            currentorder.save()
            return Response("Rs."+normalcashback+ " will be Added to your Wallet")
         else:
            return Response("Order Amount Should be minimum Rs.450")
    else:
       return Response("Coupon Invalid")
   
   

@api_view(['GET'])
def delivery_assign(request):
    orderid = request.GET.get('orderid','')
    orderlat = Orders.objects.get(id=orderid).lat
    if orderlat == 0:       
       return Response("false")
    else:
       return Response("true")


