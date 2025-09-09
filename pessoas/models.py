# pessoas/models.py
from django.db import models

class Pessoa(models.Model):
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    cpf = models.CharField(max_length=14, unique=True)  # formato: 000.000.000-00
    senha = models.CharField(max_length=128)
    TIPO_ACESSO_CHOICES = [
        ('SECRETARIA', 'Secretaria'),
        ('FUNCIONARIO', 'Funcionário'),
        ('ADMINISTRADOR', 'Administrador'),
    ]
    tipo_acesso = models.CharField(max_length=20, choices=TIPO_ACESSO_CHOICES)

    def __str__(self):
        return f"{self.nome} {self.sobrenome}"
