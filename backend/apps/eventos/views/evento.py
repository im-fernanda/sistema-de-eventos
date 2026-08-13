from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from ..models import Evento
from ..serializers import EventoSerializer


class EventoViewSet(viewsets.ModelViewSet):
    serializer_class = EventoSerializer
    queryset = Evento.objects.all()

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get("search")
        status_filter = self.request.query_params.get("status")
        if search:
            qs = qs.filter(
                Q(nome__icontains=search)
                | Q(local__icontains=search)
                | Q(descricao__icontains=search)
            )
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    @action(detail=True, methods=["post"])
    def cancelar(self, request: Request, pk: str | None = None) -> Response:
        evento = self.get_object()
        if evento.status != Evento.Status.ATIVO:
            return Response(
                {"detail": "Somente eventos ativos podem ser cancelados."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        evento.status = Evento.Status.CANCELADO
        evento.save(update_fields=["status", "updated_at"])
        return Response(EventoSerializer(evento).data)

    @action(detail=True, methods=["post"])
    def finalizar(self, request: Request, pk: str | None = None) -> Response:
        evento = self.get_object()
        if evento.status != Evento.Status.ATIVO:
            return Response(
                {"detail": "Somente eventos ativos podem ser finalizados."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        evento.status = Evento.Status.FINALIZADO
        evento.save(update_fields=["status", "updated_at"])
        return Response(EventoSerializer(evento).data)
