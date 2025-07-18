"""
Custom permissions for the Sistema de Eventos application.
Following the Single Responsibility Principle.
"""

from rest_framework import permissions


class IsEventOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an event to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the event owner
        return obj.created_by == request.user


class IsIngressoOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an ingresso to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the ingresso owner
        return obj.evento.created_by == request.user


class IsParticipanteOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of a participante to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the participante owner
        return obj.created_by == request.user


class ReadOnlyPermission(permissions.BasePermission):
    """
    Custom permission to only allow read operations.
    """

    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS
