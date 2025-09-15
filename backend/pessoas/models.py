from django.db import models
from django.contrib.auth.models import User

class Pessoa(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    cpf = models.CharField(max_length=14, unique=True)

    TIPO_ACESSO_CHOICES = [
        ('SECRETARIA', 'Secretaria'),
        ('FUNCIONARIO', 'Funcionário'),
        ('ADMINISTRADOR', 'Administrador'),
    ]
    tipo_acesso = models.CharField(max_length=20, choices=TIPO_ACESSO_CHOICES)

    def __str__(self):
        return f"{self.user.username} - {self.tipo_acesso}"
