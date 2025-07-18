from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views.participante import ParticipanteViewSet

router = DefaultRouter()
router.register(r"", ParticipanteViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
