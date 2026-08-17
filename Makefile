# Atalhos para operacao do stack. Requer Docker + Docker Compose v2.
# Uso: `make <alvo>`. Rode `make help` para listar os alvos.

SHELL := /bin/bash

COMPOSE      := docker compose
COMPOSE_DEV  := docker compose -f docker-compose.yml -f docker-compose.dev.yml

.DEFAULT_GOAL := help

.PHONY: help up up-dev down logs ps build rebuild \
        shell-backend shell-db \
        test test-backend test-frontend \
        lint format \
        migrate makemigrations seed superuser \
        clean prune

help: ## Lista os alvos disponiveis
	@awk 'BEGIN {FS = ":.*##"; printf "\nAlvos:\n"} /^[a-zA-Z_-]+:.*##/ { printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

# --- Ciclo de vida do stack --------------------------------------------------
up: ## Sobe o stack em modo producao-like (postgres + backend) em background
	$(COMPOSE) up -d --build

up-dev: ## Sobe o stack em modo dev (hot-reload, runserver) em foreground
	$(COMPOSE_DEV) up --build

down: ## Para os containers preservando o volume do banco
	$(COMPOSE) down

logs: ## Segue os logs de todos os servicos
	$(COMPOSE) logs -f --tail=100

ps: ## Lista o estado dos servicos
	$(COMPOSE) ps

build: ## (Re)constroi as imagens sem cache
	$(COMPOSE) build --no-cache

rebuild: down build up ## down + build --no-cache + up

# --- Shells ------------------------------------------------------------------
shell-backend: ## Shell interativo dentro do container backend
	$(COMPOSE) exec backend /bin/bash

shell-db: ## psql conectado no PostgreSQL do stack
	$(COMPOSE) exec postgres psql -U $${POSTGRES_USER:-sistema_eventos} -d $${POSTGRES_DB:-sistema_eventos}

# --- Testes ------------------------------------------------------------------
test: test-backend ## Roda todos os testes (por enquanto so backend)

test-backend: ## Suite de testes do backend com cobertura (meta 80%)
	cd backend && TESTING=True pytest

test-frontend: ## Suite do frontend (implementado a partir da Fase 8)
	@echo "Frontend ainda nao implementado (Fase 8+)."

# --- Qualidade ---------------------------------------------------------------
lint: ## Roda ruff e black --check no backend
	cd backend && ruff check . && black --check .

format: ## Formata com black e aplica auto-fixes do ruff
	cd backend && black . && ruff check --fix .

# --- Django ------------------------------------------------------------------
migrate: ## Roda migracoes dentro do container backend
	$(COMPOSE) exec backend python manage.py migrate

makemigrations: ## Gera novas migracoes dentro do container backend
	$(COMPOSE) exec backend python manage.py makemigrations

seed: ## Popula o banco com os dados iniciais
	$(COMPOSE) exec backend python manage.py load_initial_data --force

superuser: ## Cria um superuser interativamente
	$(COMPOSE) exec backend python manage.py createsuperuser

# --- Limpeza -----------------------------------------------------------------
clean: ## Remove containers, redes e volumes deste projeto
	$(COMPOSE) down -v --remove-orphans

prune: ## Remove imagens dangling do Docker (cuidado)
	docker image prune -f
