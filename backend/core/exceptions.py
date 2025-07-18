"""
Custom exceptions for the Sistema de Eventos application.
Following the Single Responsibility Principle.
"""


class EventosException(Exception):
    """Base exception for the eventos application."""

    pass


class ValidationError(EventosException):
    """Raised when data validation fails."""

    pass


class BusinessLogicError(EventosException):
    """Raised when business logic rules are violated."""

    pass


class ResourceNotFoundError(EventosException):
    """Raised when a requested resource is not found."""

    pass


class InsufficientCapacityError(BusinessLogicError):
    """Raised when trying to create more tickets than available capacity."""

    pass


class DuplicateResourceError(EventosException):
    """Raised when trying to create a resource that already exists."""

    pass
