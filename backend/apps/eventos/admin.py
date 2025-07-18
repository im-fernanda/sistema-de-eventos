from django.contrib import admin
from .models.evento import Evento
from .models.participante import Participante
from .models.ingresso import Ingresso


@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = (
        "nome",
        "data",
        "local",
        "capacidade",
        "preco_ingresso",
        "status",
        "created_at",
    )
    list_filter = ("status", "data")
    search_fields = ("nome", "local", "descricao")
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("-data",)


@admin.register(Participante)
class ParticipanteAdmin(admin.ModelAdmin):
    list_display = ("nome", "email", "telefone", "data_nascimento", "created_at")
    search_fields = ("nome", "email", "telefone")
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("nome",)


@admin.register(Ingresso)
class IngressoAdmin(admin.ModelAdmin):
    list_display = ("evento", "participante", "tipo", "preco", "status", "created_at")
    list_filter = ("tipo", "status", "evento")
    search_fields = ("evento__nome", "participante__nome")
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("-created_at",)
