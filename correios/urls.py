
from . import views
from django.contrib import admin
from django.urls import path, include



urlpatterns = [
    path('admin/', admin.site.urls),
    path('pessoas/', include('pessoas.urls')),
    path('', views.home, name='home'),  # página inicial
]
