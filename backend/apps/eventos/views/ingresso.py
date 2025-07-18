from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from ..models.ingresso import Ingresso
from ..serializers.ingresso import IngressoSerializer, IngressoListSerializer


class IngressoViewSet(viewsets.ModelViewSet):
    queryset = Ingresso.objects.all()
    serializer_class = IngressoSerializer
    
    def get_serializer_class(self):
        if self.action == 'list':
            return IngressoListSerializer
        return IngressoSerializer
    
    def get_queryset(self):
        queryset = Ingresso.objects.select_related('evento', 'participante')
        evento_id = self.request.query_params.get('evento', None)
        participante_id = self.request.query_params.get('participante', None)
        status_filter = self.request.query_params.get('status', None)
        
        if evento_id:
            queryset = queryset.filter(evento_id=evento_id)
        
        if participante_id:
            queryset = queryset.filter(participante_id=participante_id)
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        ingresso = self.get_object()
        if ingresso.status == 'ATIVO':
            ingresso.status = 'CANCELADO'
            ingresso.save()
            return Response({'message': 'Ingresso cancelado com sucesso'})
        return Response(
            {'error': 'Ingresso não pode ser cancelado'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def usar(self, request, pk=None):
        ingresso = self.get_object()
        if ingresso.status == 'ATIVO':
            ingresso.status = 'USADO'
            ingresso.save()
            return Response({'message': 'Ingresso utilizado com sucesso'})
        return Response(
            {'error': 'Ingresso não pode ser utilizado'}, 
            status=status.HTTP_400_BAD_REQUEST
        ) 