
from . import views
from django.contrib import admin
from django.urls import path, include
from .views import LoginView
from rest_framework_simplejwt.views import TokenRefreshView



urlpatterns = [
    path('admin/', admin.site.urls),
    path('pessoas/', include('pessoas.urls')),
    path('', views.home, name='home'),  # página inicial
    path("encomendas/", include("encomendas.urls")),
    path('api/login/', LoginView.as_view(), name='token_obtain_pair'),
    path('api/refresh/', TokenRefreshView.as_view(), name='token_refresh')

]
