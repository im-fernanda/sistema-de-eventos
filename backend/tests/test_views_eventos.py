"""Testes dos endpoints de eventos."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from decimal import Decimal

import pytest
from rest_framework import status

from apps.eventos.models import Evento

pytestmark = pytest.mark.django_db

BASE_URL = "/api/eventos/"


def _payload(**overrides):
    payload = {
        "nome": "Palestra",
        "data": (datetime.now(UTC) + timedelta(days=10)).isoformat(),
        "local": "Auditório",
        "capacidade": 100,
        "descricao": "Sobre Django.",
        "preco_ingresso": "50.00",
    }
    payload.update(overrides)
    return payload


class TestEventoCRUD:
    def test_lista_retorna_paginado(self, auth_client, evento):
        response = auth_client.get(BASE_URL)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1

    def test_criar(self, auth_client):
        response = auth_client.post(BASE_URL, _payload(), format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert Evento.objects.filter(nome="Palestra").exists()

    def test_criar_capacidade_invalida(self, auth_client):
        response = auth_client.post(BASE_URL, _payload(capacidade=0), format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_retrieve(self, auth_client, evento):
        response = auth_client.get(f"{BASE_URL}{evento.pk}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["nome"] == evento.nome

    def test_update(self, auth_client, evento):
        response = auth_client.put(
            f"{BASE_URL}{evento.pk}/",
            _payload(nome="Atualizado"),
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        evento.refresh_from_db()
        assert evento.nome == "Atualizado"

    def test_partial_update(self, auth_client, evento):
        response = auth_client.patch(
            f"{BASE_URL}{evento.pk}/",
            {"local": "Novo Local"},
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        evento.refresh_from_db()
        assert evento.local == "Novo Local"

    def test_delete(self, auth_client, evento):
        response = auth_client.delete(f"{BASE_URL}{evento.pk}/")
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Evento.objects.filter(pk=evento.pk).exists()


class TestEventoFiltros:
    def test_filtro_search_por_nome(self, auth_client, db):
        Evento.objects.create(
            nome="Show de Rock",
            data=datetime.now(UTC) + timedelta(days=1),
            local="Estádio",
            capacidade=1000,
            descricao="Concert",
            preco_ingresso=Decimal("200.00"),
        )
        Evento.objects.create(
            nome="Palestra Django",
            data=datetime.now(UTC) + timedelta(days=2),
            local="Auditório",
            capacidade=100,
            descricao="Framework",
            preco_ingresso=Decimal("0.00"),
        )
        response = auth_client.get(f"{BASE_URL}?search=Rock")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert response.data["results"][0]["nome"] == "Show de Rock"

    def test_filtro_search_por_local_ou_descricao(self, auth_client, evento):
        response = auth_client.get(f"{BASE_URL}?search={evento.local}")
        assert response.data["count"] == 1
        response = auth_client.get(f"{BASE_URL}?search={evento.descricao[:5]}")
        assert response.data["count"] == 1

    def test_filtro_status(self, auth_client, evento):
        Evento.objects.create(
            nome="Cancelado",
            data=datetime.now(UTC) + timedelta(days=1),
            local="X",
            capacidade=10,
            descricao="d",
            preco_ingresso=Decimal("10.00"),
            status=Evento.Status.CANCELADO,
        )
        response = auth_client.get(f"{BASE_URL}?status=CANCELADO")
        assert response.data["count"] == 1
        assert response.data["results"][0]["status"] == "CANCELADO"


class TestEventoActions:
    def test_cancelar_evento_ativo(self, auth_client, evento):
        response = auth_client.post(f"{BASE_URL}{evento.pk}/cancelar/")
        assert response.status_code == status.HTTP_200_OK
        evento.refresh_from_db()
        assert evento.status == Evento.Status.CANCELADO

    def test_cancelar_evento_nao_ativo_retorna_400(self, auth_client, evento):
        evento.status = Evento.Status.FINALIZADO
        evento.save()
        response = auth_client.post(f"{BASE_URL}{evento.pk}/cancelar/")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_finalizar_evento_ativo(self, auth_client, evento):
        response = auth_client.post(f"{BASE_URL}{evento.pk}/finalizar/")
        assert response.status_code == status.HTTP_200_OK
        evento.refresh_from_db()
        assert evento.status == Evento.Status.FINALIZADO

    def test_finalizar_evento_nao_ativo_retorna_400(self, auth_client, evento):
        evento.status = Evento.Status.CANCELADO
        evento.save()
        response = auth_client.post(f"{BASE_URL}{evento.pk}/finalizar/")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
