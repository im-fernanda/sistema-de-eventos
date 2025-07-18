"""
Custom authentication classes for the Sistema de Eventos application.
Following security best practices.
"""

from rest_framework import authentication
from rest_framework import exceptions
from django.contrib.auth.models import AnonymousUser
from django.utils.translation import gettext_lazy as _


class SessionAuthentication(authentication.SessionAuthentication):
    """
    Custom session authentication with enhanced security.
    """

    def authenticate_header(self, request):
        return "Session"

    def authenticate(self, request):
        """
        Returns a `User` if the request session currently has a logged in user.
        Otherwise returns `None`.
        """
        user = getattr(request._request, "user", None)

        if not user or not user.is_active:
            return None

        # For backwards compatibility, create a simple 'session' object
        if not hasattr(request, "session"):
            raise exceptions.AuthenticationFailed(_("No valid session found."))

        return (user, None)


class PublicReadAuthentication(authentication.BaseAuthentication):
    """
    Authentication that allows public read access but requires authentication for writes.
    """

    def authenticate(self, request):
        # Allow anonymous users for read operations
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return (AnonymousUser(), None)

        # For write operations, use session authentication
        session_auth = SessionAuthentication()
        return session_auth.authenticate(request)

    def authenticate_header(self, request):
        return "Session"
