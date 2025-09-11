from django.urls import path
from . import views

urlpatterns = [
    path("", views.listar_encomendas, name="listar_encomendas"),
    path("criar/", views.criar_encomenda, name="criar_encomenda"),
    path("buscar/", views.buscar_encomenda, name="buscar_encomenda"),
    path("filtrar/", views.filtrar_encomendas, name="filtrar_encomendas"),

    path("entregar/<int:pk>/", views.entregar_encomenda, name="entregar_encomenda"),
    path("editar/<int:pk>/", views.editar_encomenda, name="editar_encomenda"),
    path("deletar/<int:pk>/", views.deletar_encomenda, name="deletar_encomenda"),
]
