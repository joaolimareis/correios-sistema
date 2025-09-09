from django.urls import path
from . import views

urlpatterns = [
    path("", views.listar_encomendas, name="listar_encomendas"),
    path("nova/", views.criar_encomenda, name="criar_encomenda"),
    path("editar/<int:pk>/", views.editar_encomenda, name="editar_encomenda"),
    path("deletar/<int:pk>/", views.deletar_encomenda, name="deletar_encomenda"),
]
