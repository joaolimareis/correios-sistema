from rest_framework import serializers
from .models import Encomenda

class EncomendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Encomenda
        fields = "__all__"
        read_only_fields = ["cadastrado_por", "entregue_por", "data_chegada", "data_retirada"]
