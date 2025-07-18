#!/bin/bash

echo "🚀 Iniciando Sistema de Eventos..."

# Função para aguardar o MongoDB
wait_for_mongodb() {
    echo "⏳ Aguardando MongoDB..."
    until nc -z mongodb 27017; do
        echo "MongoDB ainda não está pronto..."
        sleep 2
    done
    echo "✅ MongoDB está pronto!"
}

# Função para executar migrações
run_migrations() {
    echo "🔄 Executando migrações..."
    cd /app/backend || exit 1
    python manage.py makemigrations
    python manage.py migrate
    echo "✅ Migrações concluídas!"
}

# Função para carregar dados iniciais
load_initial_data() {
    echo "📊 Carregando dados iniciais..."
    cd /app/backend || exit 1
    python manage.py load_initial_data
    echo "✅ Dados iniciais carregados!"
}

# Função para criar superusuário (se não existir)
create_superuser() {
    echo "👤 Verificando superusuário..."
    cd /app/backend || exit 1
    python manage.py shell -c "
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superusuário criado: admin/admin123')
else:
    print('Superusuário já existe')
"
}

# Função para iniciar backend
start_backend() {
    echo "🐍 Iniciando backend Django..."
    cd /app/backend || exit 1
    python manage.py runserver 0.0.0.0:8000 &
    BACKEND_PID=$!
    echo "✅ Backend iniciado (PID: $BACKEND_PID)"
}

# Função para iniciar frontend simples
start_frontend() {
    echo "🌐 Iniciando frontend simples..."
    cd /app/frontend || exit 1
    python -m http.server 8080 &
    FRONTEND_PID=$!
    echo "✅ Frontend iniciado (PID: $FRONTEND_PID)"
}

# Função para aguardar processos
wait_for_processes() {
    echo "🔄 Aguardando processos..."
    wait $BACKEND_PID $FRONTEND_PID
}

# Executar sequência
wait_for_mongodb
run_migrations
create_superuser
load_initial_data
start_backend
start_frontend

echo "🎉 Sistema iniciado com sucesso!"
echo "📱 Frontend: http://localhost:8080"
echo "🔧 Backend: http://localhost:8000"
echo "👨‍💼 Admin: http://localhost:8000/admin (admin/admin123)"

wait_for_processes
