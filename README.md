# Sistema de Eventos

Sistema completo de gerenciamento de eventos desenvolvido com Django (backend) e HTML/CSS/JavaScript (frontend). Permite o controle completo de eventos, participantes e ingressos com interface web responsiva e API REST.

## 📋 Descrição do Projeto

O Sistema de Eventos é uma aplicação web completa que oferece:

- **Gestão de Eventos**: Criação, edição, cancelamento e finalização de eventos
- **Controle de Participantes**: Cadastro e gerenciamento de participantes
- **Sistema de Ingressos**: Diferentes tipos de ingressos (VIP, Padrão, Estudante, Idoso)
- **Interface Responsiva**: Frontend moderno e adaptável a diferentes dispositivos
- **API REST**: Backend robusto com Django REST Framework
- **Banco NoSQL**: MongoDB para flexibilidade e performance

### Funcionalidades Principais

✅ **Eventos**
- CRUD completo de eventos
- Busca por nome, local e descrição
- Filtro por status (Ativo, Cancelado, Finalizado)
- Validação de capacidade e datas

✅ **Participantes**
- Cadastro com validação de email único
- Busca por nome, email e telefone
- Visualização de ingressos por participante

✅ **Ingressos**
- Diferentes tipos (VIP, Padrão, Estudante, Idoso)
- Status (Ativo, Usado, Cancelado)
- Filtros por evento e participante
- Cancelamento e uso de ingressos

## 🛠️ Tecnologias Utilizadas

### Backend
- **Django 4.1.13**: Framework web Python
- **Django REST Framework 3.14.0**: API REST
- **Djongo 1.3.6**: Driver MongoDB para Django
- **PyMongo 3.12.3**: Driver oficial MongoDB
- **django-cors-headers 4.3.1**: CORS para frontend
- **python-dotenv 1.0.0**: Variáveis de ambiente
- **SQLParse 0.2.4**: Parser SQL

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Estilização moderna
- **JavaScript ES6+**: Lógica da aplicação
- **Tailwind CSS**: Framework CSS utilitário (via CDN)
- **Fetch API**: Comunicação com backend

### Infraestrutura
- **Docker**: Containerização
- **Docker Compose**: Orquestração de serviços
- **MongoDB 4.4**: Banco de dados NoSQL
- **Nginx**: Servidor web (configurado no Docker)

## 📁 Estrutura do Projeto

```
sistema-de-eventos/
├── backend/                    # Backend Django
│   ├── apps/
│   │   └── eventos/            # App principal
│   │       ├── models/         # Modelos de dados
│   │       ├── serializers/    # Serializers DRF
│   │       ├── views/          # Views da API
│   │       ├── urls/           # URLs da API
│   │       └── admin.py        # Interface administrativa
│   ├── config/                 # Configurações Django
│   ├── core/                   # Lógica compartilhada
│   ├── requirements/           # Dependências Python
│   └── manage.py               # Utilitário Django
├── frontend/                   # Frontend
│   ├── index.html              # Interface principal
│   ├── styles.css              # Estilos customizados
│   ├── app.js                  # Lógica da aplicação
│   ├── api.js                  # Comunicação com backend
│   └── README.md               # Documentação frontend
├── Dockerfile                  # Configuração Docker
├── docker-compose.yml          # Orquestração de containers
├── start.sh                    # Script de inicialização
├── mongo-init.js               # Inicialização MongoDB
└── README.md                   # Este arquivo
```

## 🚀 Como Clonar o Repositório

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/sistema-de-eventos.git

# Entre no diretório do projeto
cd sistema-de-eventos

# Verifique se está no diretório correto
ls -la
```

## 📦 Como Instalar as Dependências

### Opção 1: Docker (Recomendado)

**Pré-requisitos:**
- Docker Desktop instalado
- Docker Compose disponível

**Instalação automática:**
```bash
# As dependências são instaladas automaticamente ao executar o Docker
docker-compose up --build
```

### Opção 2: Instalação Local

**Pré-requisitos:**
- Python 3.8+
- MongoDB 4.4+
- Git

**Backend (Python):**
```bash
# Entre no diretório backend
cd backend

# Crie um ambiente virtual (recomendado)
python -m venv venv

# Ative o ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r requirements/base.txt
```

**Frontend:**
```bash
# O frontend não requer instalação de dependências
# É composto apenas de arquivos HTML, CSS e JavaScript
cd frontend
```

## 🐳 Como Executar o Projeto com Docker (Recomendado)

### Execução Completa

```bash
# Construir e iniciar todos os serviços
docker-compose up --build

# Para parar os serviços
docker-compose down

# Para parar e remover volumes
docker-compose down -v
```

### Acessos Disponíveis

Após a execução, você pode acessar:

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8000
- **Admin Django**: http://localhost:8000/admin
  - Usuário: `admin`
  - Senha: `admin123`
- **MongoDB**: localhost:27017

### Comandos Úteis do Docker

```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f app
docker-compose logs -f mongodb

# Executar comandos no container
docker-compose exec app bash

# Reconstruir após mudanças
docker-compose up --build

# Parar e remover tudo
docker-compose down -v --remove-orphans
```

## 💻 Como Executar o Projeto Localmente

### 1. Configurar MongoDB

```bash
# Instalar MongoDB (Ubuntu/Debian)
sudo apt update
sudo apt install mongodb

# Ou usar Docker apenas para MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:4.4
```

### 2. Configurar Backend

```bash
# Entre no diretório backend
cd backend

# Crie um arquivo .env
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

# Execute o servidor
python manage.py runserver
```

### 3. Configurar Frontend

```bash
# Em outro terminal, entre no diretório frontend
cd frontend

# Use um servidor HTTP simples (Python)
python -m http.server 8080

# Ou use Node.js (se instalado)
npx http-server -p 8080

# Ou use Live Server (VS Code extension)
# Clique com botão direito no index.html e "Open with Live Server"
```

### 4. Acessar a Aplicação

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8000
- **Admin**: http://localhost:8000/admin

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

## 🔧 Desenvolvimento

### Arquitetura MDC

O backend segue a arquitetura MDC (Models, Serializers, Services, Views, URLs):

- **Models**: Definição dos modelos de dados
- **Serializers**: Validação e serialização de dados
- **Views**: Lógica de negócio e endpoints da API
- **URLs**: Roteamento das URLs

### Padrões de Código

- **Clean Code**: Código limpo e legível
- **SOLID**: Princípios de design orientado a objetos
- **DRY**: Don't Repeat Yourself
- **YAGNI**: You Ain't Gonna Need It
- **Segurança**: Implementação de práticas seguras

### Hot Reload

- **Backend**: Django recarrega automaticamente em desenvolvimento
- **Frontend**: Recarregue o navegador (F5) para ver mudanças

## 🚨 Troubleshooting

### Problemas Comuns

1. **Porta já em uso**
   ```bash
   # Verificar portas em uso
   netstat -tulpn | grep :8000
   netstat -tulpn | grep :8080
   
   # Matar processo
   kill -9 <PID>
   ```

2. **MongoDB não conecta**
   ```bash
   # Verificar se MongoDB está rodando
   sudo systemctl status mongodb
   
   # Reiniciar MongoDB
   sudo systemctl restart mongodb
   ```

3. **Erro de CORS**
   - Verifique se as URLs estão corretas no `CORS_ALLOWED_ORIGINS`
   - Confirme se o backend está rodando na porta 8000

4. **Dependências não encontradas**
   ```bash
   # Reinstalar dependências
   pip install -r requirements/base.txt --force-reinstall
   ```

### Logs Úteis

```bash
# Docker logs
docker-compose logs -f

# Django logs
tail -f backend/logs/django.log

# MongoDB logs
docker logs sistema_eventos_mongodb
```

## 📝 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, abra uma issue no repositório do projeto. 