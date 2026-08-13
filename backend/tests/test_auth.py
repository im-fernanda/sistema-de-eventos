"""Testes da app `authentication` (registro, login, refresh, logout, me)."""

from __future__ import annotations

import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status

pytestmark = pytest.mark.django_db

User = get_user_model()

REGISTER_URL = reverse("authentication:register")
LOGIN_URL = reverse("authentication:login")
REFRESH_URL = reverse("authentication:refresh")
LOGOUT_URL = reverse("authentication:logout")
ME_URL = reverse("authentication:me")


class TestRegister:
    def test_register_cria_usuario(self, api_client):
        payload = {
            "username": "novo",
            "email": "novo@example.com",
            "password": "Testando@2026",
            "first_name": "Novo",
            "last_name": "Usuário",
        }
        response = api_client.post(REGISTER_URL, payload, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(username="novo").exists()
        user = User.objects.get(username="novo")
        assert user.check_password("Testando@2026")
        assert "password" not in response.data

    def test_register_email_duplicado(self, api_client, user):
        payload = {
            "username": "outro",
            "email": user.email,
            "password": "Testando@2026",
        }
        response = api_client.post(REGISTER_URL, payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email" in response.data

    def test_register_username_duplicado(self, api_client, user):
        payload = {
            "username": user.username,
            "email": "outro@example.com",
            "password": "Testando@2026",
        }
        response = api_client.post(REGISTER_URL, payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "username" in response.data

    def test_register_senha_fraca(self, api_client):
        payload = {
            "username": "fraco",
            "email": "fraco@example.com",
            "password": "123",
        }
        response = api_client.post(REGISTER_URL, payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "password" in response.data


class TestLoginRefresh:
    def test_login_retorna_access_e_refresh(self, api_client, user):
        response = api_client.post(
            LOGIN_URL,
            {"username": user.username, "password": "Testando@2026"},
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data
        assert "refresh" in response.data

    def test_login_credenciais_invalidas(self, api_client, user):
        response = api_client.post(
            LOGIN_URL,
            {"username": user.username, "password": "senha-errada"},
            format="json",
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_refresh_renova_access(self, api_client, user):
        login = api_client.post(
            LOGIN_URL,
            {"username": user.username, "password": "Testando@2026"},
            format="json",
        )
        refresh_token = login.data["refresh"]
        response = api_client.post(REFRESH_URL, {"refresh": refresh_token}, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data


class TestProtectedRoutes:
    def test_sem_token_retorna_401(self, api_client):
        response = api_client.get("/api/eventos/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_com_token_valido_retorna_200(self, auth_client):
        response = auth_client.get("/api/eventos/")
        assert response.status_code == status.HTTP_200_OK


class TestMeView:
    def test_me_sem_auth_retorna_401(self, api_client):
        response = api_client.get(ME_URL)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_me_retorna_usuario_autenticado(self, auth_client, user):
        response = auth_client.get(ME_URL)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["username"] == user.username
        assert response.data["email"] == user.email


class TestLogout:
    def _tokens(self, api_client, user):
        response = api_client.post(
            LOGIN_URL,
            {"username": user.username, "password": "Testando@2026"},
            format="json",
        )
        return response.data["access"], response.data["refresh"]

    def test_logout_blacklista_refresh(self, api_client, user):
        _, refresh = self._tokens(api_client, user)
        api_client.force_authenticate(user=user)
        response = api_client.post(LOGOUT_URL, {"refresh": refresh}, format="json")
        assert response.status_code == status.HTTP_205_RESET_CONTENT
        # Tentar usar o mesmo refresh depois deve falhar
        api_client.force_authenticate(user=None)
        again = api_client.post(REFRESH_URL, {"refresh": refresh}, format="json")
        assert again.status_code == status.HTTP_401_UNAUTHORIZED

    def test_logout_sem_refresh(self, auth_client):
        response = auth_client.post(LOGOUT_URL, {}, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_logout_com_refresh_invalido(self, auth_client):
        response = auth_client.post(LOGOUT_URL, {"refresh": "nao-eh-token"}, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
