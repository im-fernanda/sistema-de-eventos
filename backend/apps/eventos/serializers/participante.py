from rest_framework import serializers

from ..models import Participante


class ParticipanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participante
        fields = [
            "id",
            "nome",
            "email",
            "telefone",
            "data_nascimento",
            "cpf",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ("id", "created_at", "updated_at")
