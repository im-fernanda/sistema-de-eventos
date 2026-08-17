"""Fixtures globais e configuração de ambiente para a suíte pytest."""

from __future__ import annotations

import os

# Deve rodar ANTES de qualquer import do Django para que o settings.py leia
# a flag correta e escolha o SQLite in-memory + hasher rápido.
os.environ.setdefault("TESTING", "True")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
os.environ.setdefault("ALLOWED_HOSTS", "testserver,localhost,127.0.0.1")
os.environ.setdefault("SECRET_KEY", "test-secret-key")

from datetime import datetime, timedelta, timezone
UTC = timezone.utc  # noqa: E402
from decimal import Decimal  # noqa: E402

import pytest  # noqa: E402
from django.contrib.auth import get_user_model  # noqa: E402
from rest_framework.test import APIClient  # noqa: E402


@pytest.fixture
def api_client() -> APIClient:
    """Cliente DRF sem autenticação."""
    return APIClient()


@pytest.fixture
def user(db):
    """Usuário Django padrão para os testes."""
    User = get_user_model()
    return User.objects.create_user(
        username="tester",
        email="tester@example.com",
        password="Testando@2026",
    )


@pytest.fixture
def auth_client(api_client: APIClient, user) -> APIClient:
    """Cliente DRF já autenticado como `user`."""
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def evento(db):
    from apps.eventos.models import Evento

    return Evento.objects.create(
        nome="Show de Jazz",
        data=datetime.now(UTC) + timedelta(days=30),
        local="Teatro Municipal",
        capacidade=200,
        descricao="Uma noite de jazz.",
        preco_ingresso=Decimal("120.00"),
    )


@pytest.fixture
def participante(db):
    from apps.eventos.models import Participante

    return Participante.objects.create(
        nome="Ana Silva",
        email="ana@example.com",
        telefone="(11) 91234-5678",
        data_nascimento="1990-05-10",
        cpf="123.456.789-00",
    )


@pytest.fixture
def ingresso(db, evento, participante):
    from apps.eventos.models import Ingresso

    return Ingresso.objects.create(
        evento=evento,
        participante=participante,
        tipo=Ingresso.Tipo.PADRAO,
        preco=Decimal("120.00"),
    )
