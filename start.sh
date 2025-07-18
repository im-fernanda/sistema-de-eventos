#!/bin/bash

echo "🚀 Iniciando Sistema de Eventos (Otimizado)..."

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
    cd /app/backend
    python manage.py makemigrations
    python manage.py migrate
    echo "✅ Migrações concluídas!"
}

# Função para criar superusuário (se não existir)
create_superuser() {
    echo "👤 Verificando superusuário..."
    cd /app/backend
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
    cd /app/backend
    python manage.py runserver 0.0.0.0:8000 &
    BACKEND_PID=$!
    echo "✅ Backend iniciado (PID: $BACKEND_PID)"
}

# Função para iniciar frontend simples com hot reload
start_frontend() {
    echo "🌐 Iniciando frontend simples..."
    cd /app/frontend
    
    # Instalar watchdog se não estiver instalado
    pip install --quiet watchdog
    
    # Iniciar servidor com hot reload
    python -c "
import http.server
import socketserver
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import threading
import time

class ReloadHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.is_directory:
            return
        if event.src_path.endswith(('.html', '.css', '.js')):
            print(f'🔄 Arquivo modificado: {event.src_path}')
            # O navegador pode recarregar automaticamente se configurado

def start_server():
    PORT = 8080
    Handler = http.server.SimpleHTTPRequestHandler
    
    with socketserver.TCPServer(('', PORT), Handler) as httpd:
        print(f'🌐 Servidor rodando em http://localhost:{PORT}')
        print('🔄 Hot reload ativo - alterações nos arquivos .html, .css, .js serão detectadas')
        httpd.serve_forever()

def start_watcher():
    event_handler = ReloadHandler()
    observer = Observer()
    observer.schedule(event_handler, '.', recursive=True)
    observer.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

# Iniciar watcher em thread separada
watcher_thread = threading.Thread(target=start_watcher, daemon=True)
watcher_thread.start()

# Iniciar servidor
start_server()
" &
    FRONTEND_PID=$!
    echo "✅ Frontend iniciado com hot reload (PID: $FRONTEND_PID)"
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
start_backend
start_frontend

echo "🎉 Sistema iniciado com sucesso!"
echo "📱 Frontend: http://localhost:8080 (com hot reload)"
echo "🔧 Backend: http://localhost:8000"
echo "👨‍💼 Admin: http://localhost:8000/admin (admin/admin123)"
echo ""
echo "💡 Dicas:"
echo "   - Alterações nos arquivos .html, .css, .js são detectadas automaticamente"
echo "   - Recarregue o navegador para ver as mudanças"
echo "   - Use F12 para abrir as ferramentas de desenvolvedor"

wait_for_processes 