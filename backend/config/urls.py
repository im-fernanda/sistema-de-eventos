from django.urls import path, include

urlpatterns = [
    path("api/eventos/", include("apps.eventos.urls.evento")),
    path("api/participantes/", include("apps.eventos.urls.participante")),
    path("api/ingressos/", include("apps.eventos.urls.ingresso")),
]
