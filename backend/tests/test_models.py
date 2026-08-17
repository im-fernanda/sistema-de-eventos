"""Testes dos models de domínio."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from decimal import Decimal

import pytest
from django.core.exceptions import ValidationError
from django.db import IntegrityError

from apps.eventos.models import Evento, Ingresso, Participante

pytestmark = pytest.mark.django_db


class TestEventoModel:
    def test_str(self, evento):
        assert evento.nome in str(evento)

    def test_status_default_ativo(self, evento):
        assert evento.status == Evento.Status.ATIVO

    def test_capacidade_zero_invalida(self):
        evento = Evento(
            nome="X",
            data=datetime.now(UTC) + timedelta(days=1),
            local="Y",
            capacidade=0,
            descricao="Z",
            preco_ingresso=Decimal("10.00"),
        )
        with pytest.raises(ValidationError):
            evento.full_clean()

    def test_ordering_por_data_desc(self, db):
        e1 = Evento.objects.create(
            nome="Antigo",
            data=datetime.now(UTC) + timedelta(days=5),
            local="A",
            capacidade=10,
            descricao="d",
            preco_ingresso=Decimal("10.00"),
        )
        e2 = Evento.objects.create(
            nome="Recente",
            data=datetime.now(UTC) + timedelta(days=50),
            local="B",
            capacidade=10,
            descricao="d",
            preco_ingresso=Decimal("10.00"),
        )
        eventos = list(Evento.objects.all())
        assert eventos[0] == e2
        assert eventos[1] == e1


class TestParticipanteModel:
    def test_str(self, participante):
        assert str(participante) == participante.nome

    def test_email_unico(self, participante):
        with pytest.raises(IntegrityError):
            Participante.objects.create(
                nome="Outro",
                email=participante.email,
                telefone="(11) 90000-0000",
                data_nascimento="1990-01-01",
                cpf="999.999.999-99",
            )


class TestIngressoModel:
    def test_str(self, ingresso):
        s = str(ingresso)
        assert ingresso.participante.nome in s
        assert ingresso.evento.nome in s
        assert ingresso.tipo in s

    def test_status_default_ativo(self, ingresso):
        assert ingresso.status == Ingresso.Status.ATIVO

    def test_cascade_ao_deletar_evento(self, ingresso):
        evento_id = ingresso.evento_id
        ingresso.evento.delete()
        assert not Ingresso.objects.filter(pk=ingresso.pk).exists()
        assert not Evento.objects.filter(pk=evento_id).exists()

    def test_cascade_ao_deletar_participante(self, ingresso):
        ingresso.participante.delete()
        assert not Ingresso.objects.filter(pk=ingresso.pk).exists()
