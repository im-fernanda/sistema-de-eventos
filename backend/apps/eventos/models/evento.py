from django.core.validators import MinValueValidator
from django.db import models


class Evento(models.Model):
    class Status(models.TextChoices):
        ATIVO = "ATIVO", "Ativo"
        CANCELADO = "CANCELADO", "Cancelado"
        FINALIZADO = "FINALIZADO", "Finalizado"

    nome = models.CharField("Nome do evento", max_length=200)
    data = models.DateTimeField("Data e hora do evento")
    local = models.CharField("Local do evento", max_length=200)
    capacidade = models.PositiveIntegerField(
        "Capacidade máxima",
        validators=[MinValueValidator(1)],
    )
    descricao = models.TextField("Descrição do evento")
    preco_ingresso = models.DecimalField(
        "Preço do ingresso",
        max_digits=10,
        decimal_places=2,
    )
    status = models.CharField(
        "Status",
        max_length=20,
        choices=Status.choices,
        default=Status.ATIVO,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Evento"
        verbose_name_plural = "Eventos"
        ordering = ["-data"]

    def __str__(self) -> str:
        return f"{self.nome} — {self.data:%d/%m/%Y %H:%M}"
