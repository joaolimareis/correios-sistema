from rest_framework import serializers
from .models import Encomenda

class EncomendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Encomenda
        fields = "__all__"
        read_only_fields = ["cadastrado_por", "entregue_por", "data_chegada", "data_retirada"]

    def validate_foto_encomenda_recebida(self, value):
        if value and not value.content_type.startswith("image/"):
            raise serializers.ValidationError(
                "O arquivo enviado para 'foto_encomenda_recebida' deve ser uma imagem (jpg, png, etc)."
            )
        return value

    def validate_foto_encomenda_entregue(self, value):
        if value and not value.content_type.startswith("image/"):
            raise serializers.ValidationError(
                "O arquivo enviado para 'foto_encomenda_entregue' deve ser uma imagem (jpg, png, etc)."
            )
        return value

    def validate_observacao(self, value):
        if value and len(value) > 500:
            raise serializers.ValidationError("A observação não pode ter mais de 500 caracteres.")
        return value
