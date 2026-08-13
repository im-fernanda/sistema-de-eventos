from django.urls import include, path
from rest_framework.routers import DefaultRouter

from ..views.participante import ParticipanteViewSet

router = DefaultRouter()
router.register(r"", ParticipanteViewSet, basename="participante")

urlpatterns = [path("", include(router.urls))]
