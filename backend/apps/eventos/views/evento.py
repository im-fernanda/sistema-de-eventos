from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from ..models.evento import Evento
from ..serializers.evento import EventoSerializer, EventoListSerializer


class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer

    def get_serializer_class(self):
        if self.action == "list":
            return EventoListSerializer
        return EventoSerializer

    def get_queryset(self):
        queryset = Evento.objects.all()
        search = self.request.query_params.get("search", None)
        status_filter = self.request.query_params.get("status", None)

        if search:
            queryset = queryset.filter(
                Q(nome__icontains=search)
                | Q(local__icontains=search)
                | Q(descricao__icontains=search)
            )

        if status_filter:
            queryset = queryset.filter(status=status_filter)

        return queryset.order_by("-data")

    @action(detail=True, methods=["post"])
    def cancelar(self, request, pk=None):
        evento = self.get_object()
        if evento.status == "ATIVO":
            evento.status = "CANCELADO"
            evento.save()
            return Response({"message": "Evento cancelado com sucesso"})
        return Response(
            {"error": "Evento não pode ser cancelado"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    @action(detail=True, methods=["post"])
    def finalizar(self, request, pk=None):
        evento = self.get_object()
        if evento.status == "ATIVO":
            evento.status = "FINALIZADO"
            evento.save()
            return Response({"message": "Evento finalizado com sucesso"})
        return Response(
            {"error": "Evento não pode ser finalizado"},
            status=status.HTTP_400_BAD_REQUEST,
        )
