"""Endpoint de health check público."""

from __future__ import annotations

from django.db import connection
from django.db.utils import OperationalError
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthView(APIView):
    """GET /api/health/ — retorna status do serviço e do banco."""

    permission_classes = [AllowAny]
    authentication_classes: list = []

    @extend_schema(
        responses={
            200: {
                "type": "object",
                "properties": {
                    "status": {"type": "string"},
                    "database": {"type": "string"},
                },
            }
        }
    )
    def get(self, request: Request) -> Response:
        db_status = "ok"
        try:
            connection.ensure_connection()
        except OperationalError:
            db_status = "unavailable"
        return Response({"status": "ok", "database": db_status})
