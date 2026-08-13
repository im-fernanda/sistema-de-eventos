from django.db.models import Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from ..models import Participante
from ..serializers import IngressoSerializer, ParticipanteSerializer


class ParticipanteViewSet(viewsets.ModelViewSet):
    serializer_class = ParticipanteSerializer
    queryset = Participante.objects.all()

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(
                Q(nome__icontains=search)
                | Q(email__icontains=search)
                | Q(telefone__icontains=search)
            )
        return qs

    @action(detail=True, methods=["get"])
    def ingressos(self, request: Request, pk: str | None = None) -> Response:
        participante = self.get_object()
        ingressos = participante.ingressos.select_related("evento", "participante").all()
        return Response(IngressoSerializer(ingressos, many=True).data)
