from rest_framework import serializers

from ..models import Ingresso


class IngressoSerializer(serializers.ModelSerializer):
    evento_nome = serializers.CharField(source="evento.nome", read_only=True)
    participante_nome = serializers.CharField(source="participante.nome", read_only=True)

    class Meta:
        model = Ingresso
        fields = [
            "id",
            "evento",
            "evento_nome",
            "participante",
            "participante_nome",
            "tipo",
            "preco",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ("id", "created_at", "updated_at")
