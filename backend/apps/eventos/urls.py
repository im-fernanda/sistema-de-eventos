from django.urls import path, include

urlpatterns = [
    path("eventos/", include("apps.eventos.urls.evento")),
    path("participantes/", include("apps.eventos.urls.participante")),
    path("ingressos/", include("apps.eventos.urls.ingresso")),
]
