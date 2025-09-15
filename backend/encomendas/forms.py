from django import forms
from .models import Encomenda

class EncomendaForm(forms.ModelForm):
    class Meta:
        model = Encomenda
        fields = [
            "nome_destinatario",
            "codigo",
            "status",
            "foto_encomenda_recebida",
        ]
