from django.urls import path
from . import views

urlpatterns = [
    path('', views.listar_pessoas, name='api_pessoas'),
    path('adicionar/', views.adicionar_pessoa, name='api_adicionar_pessoa'),
    path('editar/<int:pessoa_id>/', views.editar_pessoa, name='api_editar_pessoa'),
    path('excluir/<int:pessoa_id>/', views.excluir_pessoa, name='api_excluir_pessoa'),
]
