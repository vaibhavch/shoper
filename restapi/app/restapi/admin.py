from django.contrib import admin
from restapi.models import Products, UserInfo, Orders, UserAddress, Foods, OrdersDelivery

admin.site.site_title = 'shoPer admin'
admin.site.site_header = 'shoPer administration'

# Register your models here.
class ProductsAdmin(admin.ModelAdmin):
    list_display = ('name', 'cat2', 'cat3', 'brand', 'sp', 'quantity')
    search_fields = ['name','brand']

class UserAddressAdmin(admin.ModelAdmin):
    list_display = ('name', 'area1', 'area2', 'landmark')
    search_fields = ['name', 'area1', 'area2', 'landmark']

class UserInfoAdmin(admin.ModelAdmin):
    list_display = ('mobile', 'model', 'man', 'wallet')
    search_fields = ['mobile']

class OrderdeliveryInline(admin.TabularInline):
    model = OrdersDelivery

class OrdersAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'productidarray', 'quantityidarray', 'total', 'address', 'type', 'status', 'paytype')
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
    
    def status_highlight(self):
        return '<span style="color: green;">%s %s</span>' % (product_name, product_name)
    status_highlight.allow_tags = True
    status_highlight.admin_order_field = 'status_highlight'


class OrdersDeliveryAdmin(admin.ModelAdmin):
    list_display = ('user', 'order')
    search_fields = ['user']
	
	
admin.site.register(Products, ProductsAdmin)
admin.site.register(UserAddress, UserAddressAdmin)
admin.site.register(UserInfo, UserInfoAdmin)
admin.site.register(Orders, OrdersAdmin)
admin.site.register(OrdersDelivery, OrdersDeliveryAdmin)
