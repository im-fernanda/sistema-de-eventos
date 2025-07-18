# Sistema de Eventos

Sistema completo de gerenciamento de eventos com backend Django e frontend React.

## 🏗️ Arquitetura

### Backend (Django)
- **Arquitetura MDC**: Models, Serializers, Services, Views, URLs organizados em diretórios
- **Banco de Dados**: MongoDB com Djongo
- **API REST**: Django REST Framework
- **Segurança**: CORS, autenticação, throttling

### Frontend (React + TypeScript)
- **Framework**: React 18 com TypeScript
- **Estilização**: Tailwind CSS
- **Roteamento**: React Router DOM
- **HTTP Client**: Axios

## 📁 Estrutura do Projeto

```
sistema-eventos/
├── backend/                    # Backend Django
│   ├── config/                 # Configurações do projeto
│   │   ├── settings.py         # Configurações Django
│   │   ├── urls.py             # URLs principais
│   │   ├── wsgi.py             # Configuração WSGI
│   │   └── asgi.py             # Configuração ASGI
│   ├── apps/                   # Aplicações Django
│   │   └── eventos/            # App principal de eventos
│   │       ├── models/         # Modelos de dados
│   │       │   ├── evento.py
│   │       │   ├── participante.py
│   │       │   └── ingresso.py
│   │       ├── serializers/    # Serializers DRF
│   │       │   ├── evento.py
│   │       │   ├── participante.py
│   │       │   └── ingresso.py
│   │       ├── views/          # Views da API
│   │       │   ├── evento.py
│   │       │   ├── participante.py
│   │       │   └── ingresso.py
│   │       ├── urls/           # URLs da API
│   │       │   ├── evento.py
│   │       │   ├── participante.py
│   │       │   └── ingresso.py
│   │       └── admin.py        # Interface administrativa
│   ├── core/                   # Lógica compartilhada
│   ├── requirements/           # Dependências
│   │   ├── base.txt
│   │   ├── dev.txt
│   │   └── prod.txt
│   └── manage.py               # Utilitário Django
├── frontend/                   # Frontend React
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   ├── pages/              # Páginas da aplicação
│   │   ├── services/           # Serviços de API
│   │   ├── types/              # Tipos TypeScript
│   │   └── utils/              # Utilitários
│   ├── package.json
│   └── tailwind.config.js
├── Dockerfile                  # Configuração Docker
├── docker-compose.yml          # Orquestração de containers
├── start.sh                    # Script de inicialização
├── mongo-init.js               # Inicialização do MongoDB
├── .dockerignore               # Arquivos ignorados pelo Docker
└── README.md
```

## 🚀 Instalação e Execução

### Opção 1: Docker (Recomendado)

**Pré-requisitos:**
- Docker
- Docker Compose

**Execução:**
```bash
# Construir e iniciar todos os serviços
docker-compose up --build

# Para executar em background
docker-compose up -d --build

# Para parar os serviços
docker-compose down
```

**Acessos:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Admin Django: http://localhost:8000/admin (admin/admin123)
- MongoDB: localhost:27017

### Opção 2: Instalação Local

**Pré-requisitos:**
- Python 3.8+
- Node.js 16+
- MongoDB

#### Backend

1. **Instalar dependências**:
```bash
cd backend
pip install -r requirements.txt
```

2. **Configurar variáveis de ambiente**:
```bash
# Criar arquivo .env na raiz do backend
MONGODB_URL=mongodb://localhost:27017/
DB_NAME=sistema_eventos
SECRET_KEY=sua-chave-secreta-aqui
DEBUG=True
```

3. **Executar migrações**:
```bash
python manage.py makemigrations
python manage.py migrate
```

4. **Criar superusuário**:
```bash
python manage.py createsuperuser
```

5. **Executar servidor**:
```bash
python manage.py runserver
```

#### Frontend

1. **Instalar dependências**:
```bash
cd frontend
npm install
```

2. **Executar servidor de desenvolvimento**:
```bash
npm run dev
```

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

## 🛠️ Tecnologias Utilizadas

### Backend
- **Django 4.2**: Framework web Python
- **Django REST Framework**: API REST
- **Djongo**: Driver MongoDB para Django
- **django-cors-headers**: CORS para frontend
- **python-dotenv**: Variáveis de ambiente

### Frontend
- **React 18**: Biblioteca JavaScript
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Framework CSS
- **React Router DOM**: Roteamento
- **Axios**: Cliente HTTP
- **Vite**: Build tool

## 📋 Funcionalidades

### Eventos
- ✅ CRUD completo
- ✅ Busca por nome, local e descrição
- ✅ Filtro por status
- ✅ Cancelamento e finalização
- ✅ Validação de capacidade

### Participantes
- ✅ CRUD completo
- ✅ Busca por nome, email e telefone
- ✅ Validação de email único
- ✅ Visualização de ingressos

### Ingressos
- ✅ CRUD completo
- ✅ Diferentes tipos (VIP, Padrão, Estudante, Idoso)
- ✅ Status (Ativo, Usado, Cancelado)
- ✅ Filtros por evento e participante
- ✅ Cancelamento e uso

## 🔧 Desenvolvimento

### Docker

O projeto inclui configuração completa do Docker para facilitar o desenvolvimento:

- **Dockerfile**: Container único com Python + Node.js
- **docker-compose.yml**: Orquestração com MongoDB
- **start.sh**: Script de inicialização automatizada
- **mongo-init.js**: Configuração inicial do banco

**Comandos úteis:**
```bash
# Ver logs em tempo real
docker-compose logs -f

# Executar comandos no container
docker-compose exec app bash

# Reconstruir após mudanças
docker-compose up --build

# Parar e remover containers
docker-compose down -v
```

### Estrutura MDC (Models, Serializers, Services, Views, URLs)
O backend segue a arquitetura MDC para melhor organização:

- **Models**: Definição dos modelos de dados
- **Serializers**: Validação e serialização de dados
- **Views**: Lógica de negócio e endpoints da API
- **URLs**: Roteamento das URLs

### Padrões de Código
- Clean Code
- Princípios SOLID
- DRY (Don't Repeat Yourself)
- YAGNI (You Ain't Gonna Need It)
- Segurança implementada

## 📝 Licença

Este projeto está sob a licença MIT. 