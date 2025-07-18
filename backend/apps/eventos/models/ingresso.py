from django.db import models
from django.core.validators import MinValueValidator


class Ingresso(models.Model):
    TIPO_CHOICES = [
        ("VIP", "VIP"),
        ("PADRAO", "Padrão"),
        ("ESTUDANTE", "Estudante"),
        ("IDOSO", "Idoso"),
    ]

    STATUS_CHOICES = [
        ("ATIVO", "Ativo"),
        ("USADO", "Usado"),
        ("CANCELADO", "Cancelado"),
    ]

    evento = models.ForeignKey(
        "eventos.Evento",
        on_delete=models.CASCADE,
        related_name="ingressos",
        verbose_name="Evento",
    )
    participante = models.ForeignKey(
        "eventos.Participante",
        on_delete=models.CASCADE,
        related_name="ingressos",
        verbose_name="Participante",
    )
    tipo = models.CharField(
        max_length=20, choices=TIPO_CHOICES, verbose_name="Tipo do ingresso"
    )
    preco = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Preço")
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="ATIVO",
        verbose_name="Status do ingresso",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Ingresso"
        verbose_name_plural = "Ingressos"
        ordering = ["evento", "tipo"]

    def __str__(self):
        return f"{self.participante.nome} - {self.evento.nome} ({self.tipo})"
