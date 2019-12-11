from django.contrib.auth.models import User, Group
from restapi.models import Products, Orders, Foods, Restaurants, DailyCategory, DailyProducts, UserAddress, Coupons, UserInfo, DeliveryBoyInfo, Shops
from rest_framework import serializers
from drf_haystack.serializers import HaystackSerializer
from restapi.search_indexes import ProductIndex


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')

class ProductsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Products
        fields = ('id', 'cat3', 'name', 'brand', 'sp', 'mrp', 'quantity', 'PercentOff', 'image')
		
class DailyProductsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = DailyProducts
        fields = ('id','name','sp','quantity','text')
		
class FoodsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Foods
        fields = ('id', 'cat2', 'cat3', 'name', 'brand', 'sp', 'quantity', 'PercentOff')
		

class MeatsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Products
        fields = ('id', 'cat2', 'cat3', 'name', 'brand', 'sp', 'quantity', 'PercentOff')

		
		
class ResSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Restaurants
        fields = ('name', 'id', 'image', 'isoffer')
		
		
class ShopsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Shops
        fields = ('name', 'id',)
		
		
class DailySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = DailyCategory
        fields = ('name', 'id', 'image')


class PastOrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orders
        fields = ('id', 'productidarray', 'quantityidarray', 'total', 'discount', 'datentime', 'address', 'status', 'type', 'lat', 'lon')
		

class ProductsFetchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = ('id', 'name', 'sp', 'image', 'quantity')
		

class AmountFetchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orders
        fields = ('id', 'total')
		
		
		
		
class AddressFetchSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAddress
        fields = ('id', 'name', 'house', 'area1', 'area2', 'landmark')
		
		
		

class AddressSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UserAddress
        fields = ('id', 'house', 'area1', 'area2', 'landmark')
		
		
		
class WalletSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UserInfo
        fields = ('id', 'wallet')
		

class CouponsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Coupons
        fields = ('id', 'off')
		

class LatLonSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = DeliveryBoyInfo
        fields = ('lat', 'lon')
		
		
class ActiveOrderSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Orders
        fields = ('lat', 'lon', 'status')

		
class AutocompleteSerializer(HaystackSerializer):

    class Meta:
        index_classes = [ProductIndex]
        fields = ["name", "id", "autocomplete"]
        ignore_fields = ["autocomplete"]

        # The `field_aliases` attribute can be used in order to alias a
        # query parameter to a field attribute. In this case a query like
        # /search/?q=oslo would alias the `q` parameter to the `autocomplete`
        # field on the index.
        field_aliases = {
            "q": "autocomplete"
        }
