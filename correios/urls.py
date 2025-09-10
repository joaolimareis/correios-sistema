from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),

    # API
    path("api/pessoas/", include("pessoas.urls")),        # rotas do app pessoas
    path("api/encomendas/", include("encomendas.urls")),  # rotas do app encomendas

    # JWT Auth
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)