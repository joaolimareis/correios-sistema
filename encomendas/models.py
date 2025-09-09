from django.db import models
from django.conf import settings

class Encomenda(models.Model):
    STATUS_CHOICES = [
        ('RECEBIDO', 'Recebido'),
        ('ENTREGUE', 'Entregue'),
        ('PENDENTE', 'Pendente'),
    ]

    nome_destinatario = models.CharField(max_length=255)
    codigo = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDENTE')
    data_chegada = models.DateTimeField(auto_now_add=True)  # preenchido na criação
    data_retirada = models.DateTimeField(null=True, blank=True)

    foto_encomenda_recebida = models.ImageField(
        upload_to="encomendas/recebidas/", 
        null=True, 
        blank=True
    )
    foto_encomenda_entregue = models.ImageField(
        upload_to="encomendas/entregues/", 
        null=True, 
        blank=True
    )

    cadastrado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="encomendas_cadastradas"
    )
    entregue_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="encomendas_entregues"
    )

    def __str__(self):
        return f"{self.codigo} - {self.nome_destinatario}"
