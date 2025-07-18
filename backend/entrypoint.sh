#!/bin/bash

echo "🚀 Iniciando sistema de eventos..."

# Executa migrações
echo "📦 Executando migrações..."
python manage.py migrate

# Carrega dados iniciais
echo "📊 Carregando dados iniciais..."
python manage.py load_initial_data

# Cria superusuário
echo "👤 Criando superusuário..."
python manage.py shell -c "
from django.contrib.auth.models import User
try:
    User.objects.get_or_create(username='admin', defaults={
        'email': 'admin@example.com',
        'is_staff': True,
        'is_superuser': True
    })[0].set_password('admin123')
    print('Superusuário configurado: admin/admin123')
except:
    print('Erro ao configurar superusuário')
"

# Inicia o servidor
echo "🌐 Iniciando servidor..."
python manage.py runserver 0.0.0.0:8000 