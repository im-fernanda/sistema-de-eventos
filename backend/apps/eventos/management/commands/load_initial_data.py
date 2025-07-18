from django.core.management.base import BaseCommand
from apps.eventos.models import Evento, Participante, Ingresso
from apps.eventos.fixtures.config import INITIAL_DATA_CONFIG
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = "Carrega dados iniciais para o sistema de eventos"

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Força o recarregamento dos dados mesmo se já existirem",
        )

    def handle(self, *args, **options):
        force = options["force"]

        self.stdout.write(self.style.SUCCESS("🚀 Iniciando carregamento de dados..."))

        # Carregar eventos
        if force or Evento.objects.count() == 0:
            self.stdout.write("📅 Criando eventos...")
            self.create_eventos()
        else:
            self.stdout.write(self.style.WARNING("✅ Eventos já existem"))

        # Carregar participantes
        if force or Participante.objects.count() == 0:
            self.stdout.write("👥 Criando participantes...")
            self.create_participantes()
        else:
            self.stdout.write(self.style.WARNING("✅ Participantes já existem"))

        # Carregar ingressos
        if force or Ingresso.objects.count() == 0:
            self.stdout.write("🎫 Criando ingressos...")
            self.create_ingressos()
        else:
            self.stdout.write(self.style.WARNING("✅ Ingressos já existem"))

        self.stdout.write(self.style.SUCCESS("🎉 Dados carregados com sucesso!"))

    def create_eventos(self):
        """Cria eventos baseados na configuração"""
        from apps.eventos.models.evento import Evento

        templates = INITIAL_DATA_CONFIG["eventos"]["templates"]

        for i, template in enumerate(templates):
            # Gerar data futura aleatória
            data_futura = datetime.now() + timedelta(days=random.randint(30, 180))

            evento = Evento.objects.create(
                nome=template["nome"],
                data=data_futura,
                local=template["local"],
                capacidade=template["capacidade"],
                descricao=template["descricao"],
                preco_ingresso=template["preco_ingresso"],
                status="ATIVO",
            )
            self.stdout.write(f"  ✅ Criado: {evento.nome}")

    def create_participantes(self):
        """Cria participantes baseados na configuração"""
        from apps.eventos.models.participante import Participante

        nomes = INITIAL_DATA_CONFIG["participantes"]["nomes"]

        for nome in nomes:
            # Gerar dados únicos
            email = f"{nome.lower().replace(' ', '.')}@exemplo.com"
            telefone = (
                f"(11) 9{random.randint(1000, 9999)}-{random.randint(1000, 9999)}"
            )
            cpf = f"{random.randint(100, 999)}.{random.randint(100, 999)}.{random.randint(100, 999)}-{random.randint(10, 99)}"

            # Gerar data de nascimento aleatória (18-65 anos)
            data_nascimento = datetime.now() - timedelta(
                days=random.randint(6570, 23725)
            )

            participante = Participante.objects.create(
                nome=nome,
                email=email,
                telefone=telefone,
                data_nascimento=data_nascimento.date(),
                cpf=cpf,
            )
            self.stdout.write(f"  ✅ Criado: {participante.nome}")

    def create_ingressos(self):
        """Cria ingressos baseados na configuração"""
        from apps.eventos.models.ingresso import Ingresso

        eventos = list(Evento.objects.all())
        participantes = list(Participante.objects.all())
        tipos = INITIAL_DATA_CONFIG["ingressos"]["tipos"]
        status_list = INITIAL_DATA_CONFIG["ingressos"]["status"]
        descontos = INITIAL_DATA_CONFIG["ingressos"]["descontos"]

        if not eventos or not participantes:
            self.stdout.write(
                self.style.ERROR(
                    "❌ É necessário ter eventos e participantes antes de criar ingressos"
                )
            )
            return

        count = INITIAL_DATA_CONFIG["ingressos"]["count"]

        for i in range(count):
            evento = random.choice(eventos)
            participante = random.choice(participantes)
            tipo = random.choice(tipos)
            status = random.choice(status_list)

            # Calcular preço baseado no tipo
            preco_base = float(str(evento.preco_ingresso))
            preco_final = preco_base * descontos[tipo]

            ingresso = Ingresso.objects.create(
                evento=evento,
                participante=participante,
                tipo=tipo,
                preco=preco_final,
                status=status,
            )
            self.stdout.write(
                f"  ✅ Criado: {ingresso.tipo} - {evento.nome} - {participante.nome}"
            )
