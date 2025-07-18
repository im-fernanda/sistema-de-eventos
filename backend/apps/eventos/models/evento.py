from django.db import models
from django.core.validators import MinValueValidator


class Evento(models.Model):
    nome = models.CharField(max_length=200, verbose_name="Nome do evento")
    data = models.DateTimeField(verbose_name="Data e hora do evento")
    local = models.CharField(max_length=200, verbose_name="Local do evento")
    capacidade = models.IntegerField(
        validators=[MinValueValidator(1)], verbose_name="Capacidade máxima"
    )
    descricao = models.TextField(verbose_name="Descrição do evento")
    preco_ingresso = models.DecimalField(
        max_digits=10, decimal_places=2, verbose_name="Preço do ingresso"
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ("ATIVO", "Ativo"),
            ("CANCELADO", "Cancelado"),
            ("FINALIZADO", "Finalizado"),
        ],
        default="ATIVO",
        verbose_name="Status do evento",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Evento"
        verbose_name_plural = "Eventos"
        ordering = ["data"]

    def __str__(self):
        return f"{self.nome} - {self.data.strftime('%d/%m/%Y %H:%M')}"
