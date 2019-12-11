from django.db import models
from django.contrib.auth.models import User

class Products(models.Model):
    cat1 = models.CharField(max_length=300, blank=True, null=True)
    cat2 = models.CharField(max_length=300, blank=True, null=True)
    cat3 = models.CharField(max_length=300, blank=True, null=True)
    name = models.CharField(max_length=300, blank=True, null=True)
    brand = models.CharField(max_length=300, blank=True, null=True)
    sp = models.CharField(max_length=300, blank=True, null=True)
    mrp = models.CharField(max_length=300, blank=True, null=True)
    PercentOff = models.DecimalField(max_digits=5, decimal_places=1,blank=True, null=True)
    quantity = models.CharField(max_length=300, blank=True, null=True)
    image = models.IntegerField(blank=True,null=True,editable=False)
    enable = models.BooleanField()

def sample_upload(instance, filename):
    extension = filename.split('.')[-1]
    return "images/%s.%s" %(instance.id, extension)

class Productsnew(models.Model):
    cat1 = models.CharField(max_length=300, blank=True, null=True)
    cat2 = models.CharField(max_length=300, blank=True, null=True)
    cat3 = models.CharField(max_length=300, blank=True, null=True)
    name = models.CharField(max_length=300, blank=True, null=True)
    brand = models.CharField(max_length=300, blank=True, null=True)
    mrp = models.CharField(max_length=300, blank=True, null=True)
    sp = models.CharField(max_length=300, blank=True, null=True)
    quantity = models.CharField(max_length=300, blank=True, null=True)
    photo = models.ImageField(upload_to =sample_upload, blank=True, null=True)
    image = models.IntegerField(blank=True,null=True,editable=False)
    enable = models.BooleanField(editable=False)

    class Meta:
        verbose_name_plural = "Products"


	
class Foods(models.Model):
    cat1 = models.CharField(max_length=300, blank=True, null=True)
    cat2 = models.CharField(max_length=300, blank=True, null=True)
    cat3 = models.CharField(max_length=300, blank=True, null=True)
    name = models.CharField(max_length=300, blank=True, null=True)
    brand = models.CharField(max_length=300, blank=True, null=True)
    sp = models.CharField(max_length=300, blank=True, null=True)
    mrp = models.CharField(max_length=300, blank=True, null=True)
    quantity = models.CharField(max_length=300, blank=True, null=True)
    PercentOff = models.DecimalField(max_digits=5, decimal_places=1,blank=True, null=True)
    enable = models.BooleanField()
	
	
class Restaurants(models.Model):
    name = models.CharField(max_length=100)
    isoffer = models.BooleanField()
    image = models.CharField(max_length=100)

    def __str__(self):
       return self.name

	

class DailyCategory(models.Model):
    name = models.CharField(max_length=100)
    image = models.CharField(blank=True,null=True,editable=False,max_length=10)


class UserInfo(models.Model):
    user = models.OneToOneField(User)
    mobile = models.CharField(max_length=10)
    email = models.EmailField(max_length=254, null=True)
    otp = models.CharField(max_length=4, null=True)
    otpstatus = models.BooleanField()
    model = models.CharField(max_length=100, null=True)
    version = models.CharField(max_length=100, null=True)
    uuid = models.CharField(max_length=100, null=True)
    man = models.CharField(max_length=100, null=True)
    wallet = models.IntegerField(blank=True,null=True)

    def __str__(self):
       return self.mobile
	
	
class DeliveryBoyInfo(models.Model):
    user = models.OneToOneField(User, limit_choices_to={'groups__name': "Delivery Boy"}, verbose_name='Delivery Man')
    mobile = models.CharField(max_length=10, null=True, blank=True)
    lat = models.FloatField(null=True, blank=True, default='12.8351384')
    lon = models.FloatField(null=True, blank=True, default='77.656235')


class Coupons(models.Model):
    name = models.CharField(max_length=300)
    code = models.CharField(max_length=30)
    desc = models.CharField(max_length=1000, null=True)
    off = models.IntegerField(editable=False)

class UserAddress(models.Model):
    user = models.ForeignKey(User)
    name = models.CharField(max_length=100, blank=True)
    house = models.CharField(max_length=100, blank=True)
    area1 = models.CharField(max_length=100, blank=True)
    area2 = models.CharField(max_length=100, blank=True)
    landmark = models.CharField(max_length=100, blank=True)

    def __str__(self):
       return self.name+ ","+self.house+","+self.area1+","+self.area2+","+self.landmark
	

class Orders(models.Model):
    user = models.ForeignKey(User)
    productidarray = models.CharField(max_length=300)
    quantityidarray = models.CharField(max_length=300)
    total = models.DecimalField(max_digits=10, decimal_places=0,null=True, blank=True)
    discount = models.DecimalField(max_digits=10, decimal_places=0, null=True, blank=True)
    datentime = models.DateTimeField(auto_now=True)
    address = models.ForeignKey(UserAddress)
    ACCEPTED = 'AC'
    DISPATCHED = 'DS'
    DELIVERED = 'DL'
    CANCELLED = 'CN'
    PLACED = 'PL'
    INITIATED = 'IN'
    FAILED = 'PF'
    STATUS_CHOICES = (
        (ACCEPTED, 'Accepted'),
        (DISPATCHED, 'Dispatched'),
        (DELIVERED, 'Delivered'),
        (CANCELLED, 'Cancelled'),
        (PLACED, 'Placed'),
        (INITIATED, 'Initiated'),
        (FAILED, 'Payment Failed'),
    )
    FOOD = 'FO'
    GROCERY = 'GR'
   
    TYPE_CHOICES = (
        (FOOD, 'Food'),
        (GROCERY, 'Groceries'),
    )
    DEBIT = 'debit'
    CREDIT = 'credit'
    NET = 'net'
    CASH = 'ca'
    NOTYET = 'X'
   
    PAY_CHOICES = (
        (DEBIT, 'Debit Card'),
        (CREDIT, 'Credit Card'),
         (NET, 'Net Banking'),
        (CASH, 'Cash On Delivery'),
        (NOTYET, 'Not Yet'),
    )
    paytype = models.CharField(max_length=2, choices=PAY_CHOICES, default=NOTYET)
    type = models.CharField(max_length=2, choices=TYPE_CHOICES, default=GROCERY)
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default=PLACED)
    lat = models.FloatField(null=True, blank=True)
    lon = models.FloatField(null=True, blank=True)
    network = models.CharField(max_length=100, null=True, blank=True)



class OrdersDelivery(models.Model):
    user = models.ForeignKey(User, limit_choices_to={'groups__name': "Delivery Boy"}, verbose_name='Delivery Boy')
    order = models.OneToOneField(Orders)


class EbsPayments(models.Model):
    user = models.ForeignKey(User)
    order = models.OneToOneField(Orders)
    responsecode = models.CharField(max_length=30)
    transactionid = models.CharField(max_length=30)
    refno = models.CharField(max_length=30)
    hash = models.CharField(max_length=30)
    amount = models.CharField(max_length=30)



class Feedback(models.Model):
    user = models.ForeignKey(User)
    order = models.ForeignKey(Orders)
    ratetype = models.CharField(max_length=1)
    comments = models.CharField(max_length=500, blank=True)



class Shops(models.Model):
    name = models.CharField(max_length=50)
    info = models.CharField(max_length=50)


class DailyProducts(models.Model):
    cat1 = models.CharField(max_length=300, blank=True, null=True)
    cat2 = models.CharField(max_length=300, blank=True, null=True)
    cat3 = models.CharField(max_length=300, blank=True, null=True)
    name = models.CharField(max_length=300, blank=True, null=True)
    text = models.CharField(max_length=1000, blank=True, null=True)
    sp = models.CharField(max_length=300, blank=True, null=True)
    mrp = models.CharField(max_length=300, blank=True, null=True)
    quantity = models.CharField(max_length=300, blank=True, null=True)
    PercentOff = models.DecimalField(max_digits=5, decimal_places=1,blank=True, null=True)
    image = models.IntegerField(blank=True,null=True,editable=False)
    enable = models.BooleanField()


class DailySubscriptions(models.Model):
    user = models.ForeignKey(User)
    productid = models.ForeignKey(DailyProducts)
    quantity = models.IntegerField(blank=True,null=True,editable=False)
    total = models.DecimalField(max_digits=10, decimal_places=0)
    discount = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    datentime = models.DateTimeField(auto_now=True)
    address = models.ForeignKey(UserAddress)
    DEFAULT = 'DF'
    CUSTOM = 'CT'
    DATETYPE_CHOICES = (
        (DEFAULT, 'Default'),
        (CUSTOM, 'Custom'),
    )

    ONLINE = 'ON'
    CASH = 'CS'
    NOTYET = 'X'
    PAY_CHOICES = (
        (ONLINE, 'Online Payment'),
        (CASH, 'Cash On Delivery'),
        (NOTYET, 'Not Yet'),
    )

    customdate = models.CharField(max_length=300, blank=True, null=True)
    datetype = models.CharField(max_length=2, choices=DATETYPE_CHOICES, default=DEFAULT)
    days = models.CharField(max_length=10, blank=True, null=True)
    paytype = models.CharField(max_length=2, choices=PAY_CHOICES, default=NOTYET)
    lat = models.FloatField(null=True, blank=True)
    lon = models.FloatField(null=True, blank=True)
    network = models.CharField(max_length=100, null=True, blank=True)



class DailyOrdersLog(models.Model):
    user = models.ForeignKey(User)
    order = models.ForeignKey(DailySubscriptions)
    datentime = models.DateTimeField(auto_now=True)
    DISPATCHED = 'DS'
    DELIVERED = 'DL'
    CANCELLED = 'CN'
    STATUS_CHOICES = (
        (DISPATCHED, 'Dispatched'),
        (DELIVERED, 'Delivered'),
        (CANCELLED, 'Cancelled'),
    )
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default=DISPATCHED)
	
	
class DailyOrdersDelivery(models.Model):
    user = models.ForeignKey(User, limit_choices_to={'groups__name': "Delivery Boy"}, verbose_name='Delivery Boy')
    order = models.OneToOneField(DailyOrdersLog)

