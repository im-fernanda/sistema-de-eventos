#!/usr/bin/env sh
# Entrypoint idempotente do backend.
# - Aguarda o PostgreSQL ficar disponível
# - Roda migrações
# - Cria superuser se as variáveis DJANGO_SUPERUSER_* estiverem definidas
# - Carrega dados iniciais se SEED=true
# - Executa o CMD passado ao container (gunicorn por padrão)

set -e

POSTGRES_HOST="${POSTGRES_HOST:-postgres}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"

echo "[entrypoint] Aguardando PostgreSQL em ${POSTGRES_HOST}:${POSTGRES_PORT}..."

python <<'PYCODE'
import os
import socket
import sys
import time

host = os.getenv("POSTGRES_HOST", "postgres")
port = int(os.getenv("POSTGRES_PORT", "5432"))
timeout = int(os.getenv("DB_WAIT_TIMEOUT", "60"))

deadline = time.time() + timeout
while time.time() < deadline:
    try:
        with socket.create_connection((host, port), timeout=2):
            print(f"[entrypoint] PostgreSQL disponível em {host}:{port}")
            sys.exit(0)
    except OSError:
        time.sleep(1)

print(f"[entrypoint] Timeout aguardando PostgreSQL em {host}:{port}", file=sys.stderr)
sys.exit(1)
PYCODE

echo "[entrypoint] Rodando migrações..."
python manage.py migrate --noinput

if [ "${COLLECT_STATIC:-true}" = "true" ]; then
    echo "[entrypoint] Coletando arquivos estáticos..."
    python manage.py collectstatic --noinput --clear >/dev/null
fi

if [ -n "${DJANGO_SUPERUSER_USERNAME:-}" ] \
   && [ -n "${DJANGO_SUPERUSER_EMAIL:-}" ] \
   && [ -n "${DJANGO_SUPERUSER_PASSWORD:-}" ]; then
    echo "[entrypoint] Garantindo superuser '${DJANGO_SUPERUSER_USERNAME}'..."
    python <<'PYCODE'
import os
import django

django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
username = os.environ["DJANGO_SUPERUSER_USERNAME"]
email = os.environ["DJANGO_SUPERUSER_EMAIL"]
password = os.environ["DJANGO_SUPERUSER_PASSWORD"]

user, created = User.objects.get_or_create(
    username=username,
    defaults={"email": email, "is_staff": True, "is_superuser": True},
)
if created:
    user.set_password(password)
    user.save()
    print(f"[entrypoint] Superuser '{username}' criado.")
else:
    print(f"[entrypoint] Superuser '{username}' já existe.")
PYCODE
fi

if [ "${SEED:-false}" = "true" ]; then
    echo "[entrypoint] Carregando dados iniciais..."
    python manage.py load_initial_data || true
fi

echo "[entrypoint] Iniciando processo: $*"
exec "$@"
