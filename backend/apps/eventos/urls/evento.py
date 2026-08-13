from django.urls import include, path
from rest_framework.routers import DefaultRouter

from ..views.evento import EventoViewSet

router = DefaultRouter()
router.register(r"", EventoViewSet, basename="evento")

urlpatterns = [path("", include(router.urls))]
