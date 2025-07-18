from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from ..models.participante import Participante
from ..serializers.participante import ParticipanteSerializer, ParticipanteListSerializer


class ParticipanteViewSet(viewsets.ModelViewSet):
    queryset = Participante.objects.all()
    serializer_class = ParticipanteSerializer
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ParticipanteListSerializer
        return ParticipanteSerializer
    
    def get_queryset(self):
        queryset = Participante.objects.all()
        search = self.request.query_params.get('search', None)
        
        if search:
            queryset = queryset.filter(
                Q(nome__icontains=search) |
                Q(email__icontains=search) |
                Q(telefone__icontains=search)
            )
        
        return queryset.order_by('nome')
    
    @action(detail=True, methods=['get'])
    def ingressos(self, request, pk=None):
        participante = self.get_object()
        ingressos = participante.ingressos.all()
        from ..serializers.ingresso import IngressoListSerializer
        serializer = IngressoListSerializer(ingressos, many=True)
        return Response(serializer.data) 