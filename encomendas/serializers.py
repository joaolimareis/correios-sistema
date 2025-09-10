from rest_framework import serializers
from .models import Encomenda

class EncomendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Encomenda
        fields = "__all__"
        
