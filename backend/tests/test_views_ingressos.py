"""Testes dos endpoints de ingressos."""

from __future__ import annotations

from decimal import Decimal

import pytest
from rest_framework import status

from apps.eventos.models import Ingresso

pytestmark = pytest.mark.django_db

BASE_URL = "/api/ingressos/"


def _payload(evento, participante, **overrides):
    payload = {
        "evento": evento.pk,
        "participante": participante.pk,
        "tipo": Ingresso.Tipo.VIP,
        "preco": "300.00",
    }
    payload.update(overrides)
    return payload


class TestIngressoCRUD:
    def test_lista(self, auth_client, ingresso):
        response = auth_client.get(BASE_URL)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert response.data["results"][0]["evento_nome"] == ingresso.evento.nome

    def test_criar(self, auth_client, evento, participante):
        response = auth_client.post(BASE_URL, _payload(evento, participante), format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert Ingresso.objects.count() == 1

    def test_retrieve(self, auth_client, ingresso):
        response = auth_client.get(f"{BASE_URL}{ingresso.pk}/")
        assert response.status_code == status.HTTP_200_OK

    def test_update(self, auth_client, ingresso):
        response = auth_client.patch(
            f"{BASE_URL}{ingresso.pk}/", {"preco": "500.00"}, format="json"
        )
        assert response.status_code == status.HTTP_200_OK
        ingresso.refresh_from_db()
        assert ingresso.preco == Decimal("500.00")

    def test_delete(self, auth_client, ingresso):
        response = auth_client.delete(f"{BASE_URL}{ingresso.pk}/")
        assert response.status_code == status.HTTP_204_NO_CONTENT


class TestIngressoFiltros:
    def test_filtro_por_evento(self, auth_client, ingresso, evento, participante):
        outro_evento = ingresso.evento
        from apps.eventos.models import Evento

        outro = Evento.objects.create(
            nome="Outro",
            data=outro_evento.data,
            local="X",
            capacidade=10,
            descricao="d",
            preco_ingresso=Decimal("10.00"),
        )
        Ingresso.objects.create(
            evento=outro,
            participante=participante,
            tipo=Ingresso.Tipo.PADRAO,
            preco=Decimal("10.00"),
        )
        response = auth_client.get(f"{BASE_URL}?evento={outro.pk}")
        assert response.data["count"] == 1

    def test_filtro_por_participante(self, auth_client, ingresso):
        response = auth_client.get(f"{BASE_URL}?participante={ingresso.participante.pk}")
        assert response.data["count"] == 1

    def test_filtro_por_status(self, auth_client, ingresso):
        response = auth_client.get(f"{BASE_URL}?status=ATIVO")
        assert response.data["count"] == 1
        response = auth_client.get(f"{BASE_URL}?status=USADO")
        assert response.data["count"] == 0


class TestIngressoActions:
    def test_cancelar_ativo(self, auth_client, ingresso):
        response = auth_client.post(f"{BASE_URL}{ingresso.pk}/cancelar/")
        assert response.status_code == status.HTTP_200_OK
        ingresso.refresh_from_db()
        assert ingresso.status == Ingresso.Status.CANCELADO

    def test_cancelar_nao_ativo(self, auth_client, ingresso):
        ingresso.status = Ingresso.Status.USADO
        ingresso.save()
        response = auth_client.post(f"{BASE_URL}{ingresso.pk}/cancelar/")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_usar_ativo(self, auth_client, ingresso):
        response = auth_client.post(f"{BASE_URL}{ingresso.pk}/usar/")
        assert response.status_code == status.HTTP_200_OK
        ingresso.refresh_from_db()
        assert ingresso.status == Ingresso.Status.USADO

    def test_usar_nao_ativo(self, auth_client, ingresso):
        ingresso.status = Ingresso.Status.CANCELADO
        ingresso.save()
        response = auth_client.post(f"{BASE_URL}{ingresso.pk}/usar/")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
