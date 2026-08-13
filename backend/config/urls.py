from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

from .health import HealthView

urlpatterns = [
    path("admin/", admin.site.urls),
    # Auth
    path("api/auth/", include("apps.authentication.urls")),
    # Domínio
    path("api/eventos/", include("apps.eventos.urls.evento")),
    path("api/participantes/", include("apps.eventos.urls.participante")),
    path("api/ingressos/", include("apps.eventos.urls.ingresso")),
    # OpenAPI (público)
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
    # Health check (público)
    path("api/health/", HealthView.as_view(), name="health"),
]
