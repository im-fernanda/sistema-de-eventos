from rest_framework import serializers

from ..models import Evento


class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = [
            "id",
            "nome",
            "data",
            "local",
            "capacidade",
            "descricao",
            "preco_ingresso",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ("id", "created_at", "updated_at")
