"""Testes das rotas públicas (health check e OpenAPI docs)."""

from __future__ import annotations

import pytest
from rest_framework import status

pytestmark = pytest.mark.django_db


class TestHealth:
    def test_health_publico_e_ok(self, api_client):
        response = api_client.get("/api/health/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["status"] == "ok"
        assert response.data["database"] == "ok"


class TestOpenAPI:
    def test_schema_publico(self, api_client):
        response = api_client.get("/api/schema/")
        assert response.status_code == status.HTTP_200_OK

    def test_docs_publico(self, api_client):
        response = api_client.get("/api/docs/")
        assert response.status_code == status.HTTP_200_OK

    def test_redoc_publico(self, api_client):
        response = api_client.get("/api/redoc/")
        assert response.status_code == status.HTTP_200_OK
