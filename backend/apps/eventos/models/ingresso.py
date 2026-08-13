from django.db import models


class Ingresso(models.Model):
    class Tipo(models.TextChoices):
        VIP = "VIP", "Vip"
        PADRAO = "PADRAO", "Padrão"
        ESTUDANTE = "ESTUDANTE", "Estudante"
        IDOSO = "IDOSO", "Idoso"

    class Status(models.TextChoices):
        ATIVO = "ATIVO", "Ativo"
        USADO = "USADO", "Usado"
        CANCELADO = "CANCELADO", "Cancelado"

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
    tipo = models.CharField("Tipo", max_length=20, choices=Tipo.choices)
    preco = models.DecimalField("Preço", max_digits=10, decimal_places=2)
    status = models.CharField(
        "Status",
        max_length=20,
        choices=Status.choices,
        default=Status.ATIVO,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Ingresso"
        verbose_name_plural = "Ingressos"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.participante.nome} — {self.evento.nome} ({self.tipo})"
