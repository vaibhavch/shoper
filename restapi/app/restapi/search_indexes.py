from django.utils import timezone
from haystack import indexes
from restapi.models import Products

class ProductIndex(indexes.SearchIndex, indexes.Indexable):

    text = indexes.CharField(document=True, use_template=True)
    name = indexes.CharField(model_attr="name")
    brand = indexes.CharField(model_attr="brand")
    cat3 = indexes.CharField(model_attr="cat3")
    id = indexes.CharField(model_attr="id")

    autocomplete = indexes.EdgeNgramField()

    @staticmethod
    def prepare_autocomplete(obj):
        return " ".join((
            obj.name, obj.brand, obj.cat3, obj.id
        ))
 

    def get_model(self):
        return Products

    def index_queryset(self, using=None):
        return self.get_model().objects.all()