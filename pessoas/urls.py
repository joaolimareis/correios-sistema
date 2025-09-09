# pessoas/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.listar_pessoas, name='pessoas'),
    path('adicionar/', views.adicionar_pessoa, name='adicionar_pessoa'),
    path('editar/<int:pessoa_id>/', views.editar_pessoa, name='editar_pessoa'),
    path('excluir/<int:pessoa_id>/', views.excluir_pessoa, name='excluir_pessoa'),
]
