from django.db import models


class Participante(models.Model):
    nome = models.CharField("Nome completo", max_length=200)
    email = models.EmailField("Email", unique=True)
    telefone = models.CharField("Telefone", max_length=20)
    data_nascimento = models.DateField("Data de nascimento")
    cpf = models.CharField("CPF", max_length=14, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Participante"
        verbose_name_plural = "Participantes"
        ordering = ["nome"]

    def __str__(self) -> str:
        return self.nome
