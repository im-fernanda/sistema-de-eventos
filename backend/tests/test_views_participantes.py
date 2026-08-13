"""Testes dos endpoints de participantes."""

from __future__ import annotations

import pytest
from rest_framework import status

from apps.eventos.models import Participante

pytestmark = pytest.mark.django_db

BASE_URL = "/api/participantes/"


def _payload(**overrides):
    payload = {
        "nome": "Bruno Costa",
        "email": "bruno@example.com",
        "telefone": "(11) 90000-0000",
        "data_nascimento": "1988-03-14",
        "cpf": "111.222.333-44",
    }
    payload.update(overrides)
    return payload


class TestParticipanteCRUD:
    def test_lista(self, auth_client, participante):
        response = auth_client.get(BASE_URL)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1

    def test_criar(self, auth_client):
        response = auth_client.post(BASE_URL, _payload(), format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert Participante.objects.filter(email="bruno@example.com").exists()

    def test_criar_email_duplicado(self, auth_client, participante):
        response = auth_client.post(
            BASE_URL,
            _payload(email=participante.email),
            format="json",
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_retrieve(self, auth_client, participante):
        response = auth_client.get(f"{BASE_URL}{participante.pk}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["email"] == participante.email

    def test_update(self, auth_client, participante):
        response = auth_client.patch(
            f"{BASE_URL}{participante.pk}/",
            {"telefone": "(11) 91111-1111"},
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        participante.refresh_from_db()
        assert participante.telefone == "(11) 91111-1111"

    def test_delete(self, auth_client, participante):
        response = auth_client.delete(f"{BASE_URL}{participante.pk}/")
        assert response.status_code == status.HTTP_204_NO_CONTENT


class TestParticipanteFiltros:
    def test_filtro_search(self, auth_client, participante):
        response = auth_client.get(f"{BASE_URL}?search=Ana")
        assert response.data["count"] == 1

        response = auth_client.get(f"{BASE_URL}?search={participante.email}")
        assert response.data["count"] == 1

        response = auth_client.get(f"{BASE_URL}?search=91234")
        assert response.data["count"] == 1

        response = auth_client.get(f"{BASE_URL}?search=inexistente-xyz")
        assert response.data["count"] == 0


class TestParticipanteActionIngressos:
    def test_lista_ingressos_do_participante(self, auth_client, ingresso):
        response = auth_client.get(f"{BASE_URL}{ingresso.participante.pk}/ingressos/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]["id"] == ingresso.pk

    def test_lista_ingressos_vazia(self, auth_client, participante):
        response = auth_client.get(f"{BASE_URL}{participante.pk}/ingressos/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data == []
