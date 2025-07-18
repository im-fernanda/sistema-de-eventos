from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views.ingresso import IngressoViewSet

router = DefaultRouter()
router.register(r"", IngressoViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
