from django.contrib import admin
from restapi.models import Products, UserInfo, Orders, UserAddress, Foods, OrdersDelivery, Productsnew, DailyProducts, DailySubscriptions
import urllib.request
import urllib.parse

admin.site.site_title = 'shoPer admin'
admin.site.site_header = 'shoPer administration'

def stringstatus(self):
   string = self
   length = len(string)
   string += " "*(11-length)
   return string

def stringamount(self):
   string = str(self)
   length = len(string)
   string += " "*(4-length)
   return string

def stringid(self):
   string = str(self)
   length = len(string)
   string += " "*(5-length)
   return string

# Register your models here.
class ProductsAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'quantity', 'cat2', 'cat3', 'brand', 'sp')
    search_fields = ['name','brand']

class FoodsAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'quantity', 'cat2', 'cat3', 'brand', 'sp')
    search_fields = ['name','brand']

class ProductsnewAdmin(admin.ModelAdmin):
    list_display = ('name', 'cat2', 'cat3', 'brand', 'sp', 'quantity')
    search_fields = ['name','brand']

class UserAddressAdmin(admin.ModelAdmin):
    list_display = ('name', 'area1', 'area2', 'landmark')
    search_fields = ['name', 'area1', 'area2', 'landmark']

class UserInfoAdmin(admin.ModelAdmin):
    list_display = ('mobile', 'model', 'man', 'version','wallet')
    search_fields = ['mobile']

class DailySubscriptionsAdmin(admin.ModelAdmin):
    list_display = ('mobile', 'product_cat', 'product_name', 'quantity', 'address', 'datetype', 'days', 'paytype', 'total')

    def product_name(self, obj):
       name = DailyProducts.objects.get(id = obj.productid.id).name
       return name

    def product_cat(self, obj):
       name = DailyProducts.objects.get(id = obj.productid.id).cat2
       return name

    def mobile(self, obj):
        user = obj.user
        return UserInfo.objects.get(user = user).mobile



class OrderdeliveryInline(admin.TabularInline):
    model = OrdersDelivery

class OrdersAdmin(admin.ModelAdmin):
    list_display = ( 'mobile', 'total', 'address', 'type', 'status', 'paytype','print_link', 'open_map')
    readonly_fields=('lat', 'lon', 'network')
    search_fields = ['status']
    inlines = [
        OrderdeliveryInline,
    ]

    def product_name(self, obj):
       names = []
       type = obj.type
       uproducts = [int(x) for x in obj.productidarray.strip("[]").split(',')]
       uquantity = [int(x) for x in obj.quantityidarray.strip("[]").split(',')]   
       for v in uproducts:
         if type == "FO":
            products = Foods.objects.get(pk = v).name
            names.append(products)
         if type == "GR":
            products = Products.objects.get(pk = v).name
            names.append(products)
       return names

    def print_link(self, obj):
        return '<a href="%s%s" target="_blank">%s</a>' % ('http://dev9.shoper.in/pdf/?id=', obj.id, 'Print Invoice')
    print_link.allow_tags = True
    print_link.short_description = 'Print Invoice'

    def open_map(self, obj):
        return '<a href="%s" target="_blank">%s</a>' % ('http://maps.google.com/?q='+str(obj.lat)+','+str(obj.lon), 'Locate')
    open_map.allow_tags = True
    open_map.short_description = 'Open Map'

    def mobile(self, obj):
        user = obj.user
        return UserInfo.objects.get(user = user).mobile
    
    def status_highlight(self):
        return '<span style="color: green;">%s %s</span>' % (product_name, product_name)
    status_highlight.allow_tags = True
    status_highlight.admin_order_field = 'status_highlight'

    def save_model(self, request, obj, form, change):
      sprices = []
      mprices = []
      uproducts = [int(x) for x in obj.productidarray.replace('[','').replace(']','').split(',')]
      uquantity = [int(x) for x in obj.quantityidarray.replace('[','').replace(']','').split(',')]       
      for v in uproducts:
        if obj.type == "FO":
          sp = Foods.objects.get(pk = v).sp
        if obj.type == "GR":
          sp = Products.objects.get(pk = v).sp
        spc = int(sp)
        sprices.append(spc)
     
      multiply = [a*b for a,b in zip(uquantity,sprices)]
      utotal = sum(multiply)
      obj.total = utotal
      obj.save()
      if obj.status == 'DS' or obj.status == 'DL':
         if obj.status == 'DS':
            status = 'Dispatched'
         if obj.status == 'DL':
            status = 'Delivered'
         user = obj.user
         phone = UserInfo.objects.get(user = user).mobile
         headers = { 'Content-Type': 'application/json' }
         values = {'method' : 'sms',
                 'api_key' : 'Aa0bcb8adeb7b52c3ae8dd9d3ec16b64a',
                 'to' : phone,
                 'sender' : 'SHOPER',
                 'message' : 'Your Order no.'+str(obj.id)+' of amount Rs.'+str(obj.total)+' is '+str(status)+'. Thanks for using SHOPER.',
                 'format' : 'json',
                 'flash' : '0',
                 }
         data = urllib.parse.urlencode(values)
         fullurl = "http://api.alerts.solutionsinfini.com/v3/?" + data
         urllib.request.urlopen(fullurl)


class OrdersDeliveryAdmin(admin.ModelAdmin):
    list_display = ('user', 'order')
    search_fields = ['user']
	
	
admin.site.register(Products, ProductsAdmin)
admin.site.register(Foods, FoodsAdmin)
admin.site.register(Productsnew, ProductsnewAdmin)
admin.site.register(UserAddress, UserAddressAdmin)
admin.site.register(UserInfo, UserInfoAdmin)
admin.site.register(Orders, OrdersAdmin)
admin.site.register(OrdersDelivery, OrdersDeliveryAdmin)
admin.site.register(DailySubscriptions, DailySubscriptionsAdmin)
