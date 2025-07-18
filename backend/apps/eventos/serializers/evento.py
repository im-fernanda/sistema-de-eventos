from rest_framework import serializers
from ..models.evento import Evento


class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")


class EventoListSerializer(serializers.ModelSerializer):
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
        ]
