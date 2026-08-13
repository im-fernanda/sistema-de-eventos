from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from ..models import Ingresso
from ..serializers import IngressoSerializer


class IngressoViewSet(viewsets.ModelViewSet):
    serializer_class = IngressoSerializer
    queryset = Ingresso.objects.select_related("evento", "participante").all()

    def get_queryset(self):
        qs = super().get_queryset()
        evento_id = self.request.query_params.get("evento")
        participante_id = self.request.query_params.get("participante")
        status_filter = self.request.query_params.get("status")
        if evento_id:
            qs = qs.filter(evento_id=evento_id)
        if participante_id:
            qs = qs.filter(participante_id=participante_id)
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    @action(detail=True, methods=["post"])
    def cancelar(self, request: Request, pk: str | None = None) -> Response:
        ingresso = self.get_object()
        if ingresso.status != Ingresso.Status.ATIVO:
            return Response(
                {"detail": "Somente ingressos ativos podem ser cancelados."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        ingresso.status = Ingresso.Status.CANCELADO
        ingresso.save(update_fields=["status", "updated_at"])
        return Response(IngressoSerializer(ingresso).data)

    @action(detail=True, methods=["post"])
    def usar(self, request: Request, pk: str | None = None) -> Response:
        ingresso = self.get_object()
        if ingresso.status != Ingresso.Status.ATIVO:
            return Response(
                {"detail": "Somente ingressos ativos podem ser utilizados."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        ingresso.status = Ingresso.Status.USADO
        ingresso.save(update_fields=["status", "updated_at"])
        return Response(IngressoSerializer(ingresso).data)
