from __future__ import annotations

from drf_spectacular.utils import extend_schema
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/ — cria um novo usuário."""

    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    authentication_classes: list = []


class MeView(generics.RetrieveAPIView):
    """GET /api/auth/me/ — retorna os dados do usuário autenticado."""

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class LogoutView(APIView):
    """POST /api/auth/logout/ — coloca o refresh token na blacklist."""

    permission_classes = [IsAuthenticated]

    @extend_schema(
        request={
            "type": "object",
            "properties": {"refresh": {"type": "string"}},
            "required": ["refresh"],
        },
        responses={205: None, 400: None},
    )
    def post(self, request: Request) -> Response:
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"detail": "Campo 'refresh' é obrigatório."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_205_RESET_CONTENT)
