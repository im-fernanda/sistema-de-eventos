from rest_framework import serializers
from ..models.participante import Participante


class ParticipanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participante
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")


class ParticipanteListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participante
        fields = ["id", "nome", "email", "telefone", "data_nascimento", "cpf"]
