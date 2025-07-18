from django.db import models


class Participante(models.Model):
    nome = models.CharField(max_length=200, verbose_name="Nome completo")
    email = models.EmailField(unique=True, verbose_name="Email")
    telefone = models.CharField(max_length=20, verbose_name="Telefone")
    data_nascimento = models.DateField(verbose_name="Data de nascimento")
    cpf = models.CharField(max_length=14, unique=True, verbose_name="CPF")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Participante"
        verbose_name_plural = "Participantes"
        ordering = ["nome"]

    def __str__(self):
        return self.nome
