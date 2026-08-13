from django.urls import include, path
from rest_framework.routers import DefaultRouter

from ..views.ingresso import IngressoViewSet

router = DefaultRouter()
router.register(r"", IngressoViewSet, basename="ingresso")

urlpatterns = [path("", include(router.urls))]
