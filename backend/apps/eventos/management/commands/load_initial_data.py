"""Popula o banco com dados de exemplo usando o ORM."""

from __future__ import annotations

import random
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Any

from django.core.management.base import BaseCommand

from apps.eventos.fixtures.config import INITIAL_DATA_CONFIG
from apps.eventos.models import Evento, Ingresso, Participante


class Command(BaseCommand):
    help = "Carrega dados iniciais no banco para o sistema de eventos."

    def add_arguments(self, parser: Any) -> None:
        parser.add_argument(
            "--force",
            action="store_true",
            help="Apaga os dados existentes antes de recarregar.",
        )

    def handle(self, *args: Any, **options: Any) -> None:
        force: bool = options["force"]

        if force:
            self.stdout.write(self.style.WARNING("Limpando dados existentes..."))
            Ingresso.objects.all().delete()
            Participante.objects.all().delete()
            Evento.objects.all().delete()

        eventos = self._seed_eventos(force=force)
        participantes = self._seed_participantes(force=force)
        self._seed_ingressos(eventos, participantes, force=force)

        self.stdout.write(self.style.SUCCESS("Dados iniciais carregados."))

    # ------------------------------------------------------------------
    def _seed_eventos(self, *, force: bool) -> list[Evento]:
        if not force and Evento.objects.exists():
            self.stdout.write("Eventos já existem, pulando.")
            return list(Evento.objects.all())

        criados: list[Evento] = []
        for template in INITIAL_DATA_CONFIG["eventos"]["templates"]:
            data_futura = datetime.now(timezone.utc) + timedelta(
                days=random.randint(30, 180)
            )
            evento = Evento.objects.create(
                nome=template["nome"],
                data=data_futura,
                local=template["local"],
                capacidade=template["capacidade"],
                descricao=template["descricao"],
                preco_ingresso=Decimal(str(template["preco_ingresso"])),
                status=Evento.Status.ATIVO,
            )
            criados.append(evento)
            self.stdout.write(f"  evento: {evento.nome}")
        return criados

    def _seed_participantes(self, *, force: bool) -> list[Participante]:
        if not force and Participante.objects.exists():
            self.stdout.write("Participantes já existem, pulando.")
            return list(Participante.objects.all())

        criados: list[Participante] = []
        for nome in INITIAL_DATA_CONFIG["participantes"]["nomes"]:
            email = f"{nome.lower().replace(' ', '.')}@exemplo.com"
            telefone = (
                f"(11) 9{random.randint(1000, 9999)}-{random.randint(1000, 9999)}"
            )
            cpf = (
                f"{random.randint(100, 999)}.{random.randint(100, 999)}."
                f"{random.randint(100, 999)}-{random.randint(10, 99)}"
            )
            nascimento = (
                datetime.now(timezone.utc) - timedelta(days=random.randint(6570, 23725))
            ).date()

            participante = Participante.objects.create(
                nome=nome,
                email=email,
                telefone=telefone,
                data_nascimento=nascimento,
                cpf=cpf,
            )
            criados.append(participante)
            self.stdout.write(f"  participante: {participante.nome}")
        return criados

    def _seed_ingressos(
        self,
        eventos: list[Evento],
        participantes: list[Participante],
        *,
        force: bool,
    ) -> None:
        if not force and Ingresso.objects.exists():
            self.stdout.write("Ingressos já existem, pulando.")
            return
        if not eventos or not participantes:
            self.stdout.write(self.style.ERROR("Sem eventos/participantes; abortando."))
            return

        cfg = INITIAL_DATA_CONFIG["ingressos"]
        tipos = cfg["tipos"]
        status_list = cfg["status"]
        descontos = cfg["descontos"]

        for _ in range(cfg["count"]):
            evento = random.choice(eventos)
            participante = random.choice(participantes)
            tipo = random.choice(tipos)
            status_choice = random.choice(status_list)
            preco = (
                Decimal(str(evento.preco_ingresso)) * Decimal(str(descontos[tipo]))
            ).quantize(Decimal("0.01"))

            ingresso = Ingresso.objects.create(
                evento=evento,
                participante=participante,
                tipo=tipo,
                preco=preco,
                status=status_choice,
            )
            self.stdout.write(f"  ingresso: {ingresso.tipo} ({evento.nome})")
