# Sistema de Eventos

Sistema web para gerenciamento de eventos, participantes e ingressos, com backend Django + MongoDB e frontend moderno em HTML, CSS (Tailwind via CDN) e JavaScript modularizado. Permite cadastro, edição, exclusão, visualização e integração via API REST.

## 📋 Descrição do Projeto

O Sistema de Eventos oferece:

- **Gestão de Eventos**: CRUD, cancelamento, finalização, filtro por status
- **Controle de Participantes**: Cadastro, edição, busca, visualização de ingressos
- **Sistema de Ingressos**: Tipos (VIP, Padrão, Estudante, Idoso), status, vinculação a eventos e participantes
- **Interface Responsiva**: Visual moderno, botões coloridos, cards interativos, balões clicáveis na home
- **API REST**: Endpoints para todas as entidades
- **Banco NoSQL**: MongoDB via Djongo
- **Carga Inicial Automatizada**: Script Django que lê fixtures/config para popular o banco com dados de exemplo
- **Frontend Modularizado**: Código JS separado por entidade, integração dinâmica com API

### Funcionalidades Reais

✅ **Eventos**
- CRUD completo
- Busca por nome, local e descrição
- Filtro por status (Ativo, Cancelado, Finalizado)
- Validação de capacidade e datas
- Visualização em cards

✅ **Participantes**
- Cadastro com validação de email único
- Busca por nome, email e telefone
- Visualização de ingressos por participante
- Campos obrigatórios destacados

✅ **Ingressos**
- Tipos (VIP, Padrão, Estudante, Idoso)
- Status (Ativo, Usado, Cancelado)
- Filtros por evento e participante
- Cancelamento e uso de ingressos
- Preço calculado conforme tipo

✅ **Visual e Usabilidade**
- Botões coloridos e animados (Tailwind)
- Cards responsivos
- Balões clicáveis na home
- Modais para cadastro/edição
- Toasts de feedback
- Loader animado

✅ **Carga Inicial**
- Script Django (`load_initial_data`) lê configurações de `apps.eventos.fixtures.config.py` para popular o banco
- Gera eventos, participantes e ingressos de exemplo
- Permite forçar recarga com `--force`

## 🛠️ Tecnologias Utilizadas

### Backend
- Django 4.1.13
- Django REST Framework
- Djongo (MongoDB)
- PyMongo
- python-dotenv

### Frontend
- HTML5
- CSS3 + Tailwind (CDN)
- JavaScript ES6+ (modular)
- Fetch API

### Infraestrutura
- Docker + Docker Compose
- MongoDB 4.4

## 📁 Estrutura do Projeto

```
sistema-de-eventos/
├── backend/
│   ├── apps/eventos/
│   │   ├── models/
│   │   ├── serializers/
│   │   ├── views/
│   │   ├── urls/
│   │   ├── fixtures/config.py  # Configuração de dados iniciais
│   │   └── management/commands/load_initial_data.py  # Script de carga
│   ├── config/
│   ├── core/
│   ├── requirements/
│   └── manage.py
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── api.js
│   ├── eventos.js
│   ├── ingressos.js
│   ├── participantes.js
│   └── README.md
├── Dockerfile
├── docker-compose.yml
├── start.sh
├── mongo-init.js
└── README.md
```

## 🚀 Como Executar

### Docker (Recomendado)
```bash
docker-compose up --build
```
Esse comando já fará todo o projeto rodar, com acesso aos endpoints listados.
- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- Admin Django: http://localhost:8000/admin


### 💻 Como Rodar Localmente (sem Docker - PESADO)

### 1. Banco de Dados MongoDB
- Instale o MongoDB 4.4+ em sua máquina
- Inicie o serviço: `sudo systemctl start mongodb` (Linux) ou pelo aplicativo (Windows)

### 2. Backend Django
```bash
cd backend
# Crie e ative um ambiente virtual
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
# Instale as dependências
pip install -r requirements/base.txt
# Configure o arquivo .env (veja exemplo abaixo)
cat > .env << EOF
MONGODB_URL=mongodb://localhost:27017/
DB_NAME=sistema_eventos
SECRET_KEY=sua-chave-secreta-aqui-mude-em-producao
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
EOF
# Execute as migrações
python manage.py makemigrations
python manage.py migrate
# Crie um superusuário
python manage.py createsuperuser
# Execute o backend
python manage.py runserver
```

### 3. Frontend
```bash
cd frontend
# Use um servidor HTTP simples (Python)
python -m http.server 8080
# Ou use Node.js (se instalado)
npx http-server -p 8080
# Ou use Live Server (VS Code extension)
# Clique com botão direito no index.html e "Open with Live Server"
```

### 4. Carga Inicial de Dados
```bash
# No diretório backend
python manage.py load_initial_data
# Ou para forçar recarga
python manage.py load_initial_data --force
```

### 5. Acesse a aplicação
- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- Admin Django: http://localhost:8000/admin

## 📚 API Endpoints

### Eventos
- `GET /api/eventos/` - Listar eventos
- `POST /api/eventos/` - Criar evento
- `GET /api/eventos/{id}/` - Detalhes do evento
- `PUT /api/eventos/{id}/` - Atualizar evento
- `DELETE /api/eventos/{id}/` - Deletar evento
- `POST /api/eventos/{id}/cancelar/` - Cancelar evento
- `POST /api/eventos/{id}/finalizar/` - Finalizar evento

### Participantes
- `GET /api/participantes/` - Listar participantes
- `POST /api/participantes/` - Criar participante
- `GET /api/participantes/{id}/` - Detalhes do participante
- `PUT /api/participantes/{id}/` - Atualizar participante
- `DELETE /api/participantes/{id}/` - Deletar participante
- `GET /api/participantes/{id}/ingressos/` - Ingressos do participante

### Ingressos
- `GET /api/ingressos/` - Listar ingressos
- `POST /api/ingressos/` - Criar ingresso
- `GET /api/ingressos/{id}/` - Detalhes do ingresso
- `PUT /api/ingressos/{id}/` - Atualizar ingresso
- `DELETE /api/ingressos/{id}/` - Deletar ingresso
- `POST /api/ingressos/{id}/cancelar/` - Cancelar ingresso
- `POST /api/ingressos/{id}/usar/` - Usar ingresso

