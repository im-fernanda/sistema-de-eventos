from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views.evento import EventoViewSet

router = DefaultRouter()
router.register(r"", EventoViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
