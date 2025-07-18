# Backend - Sistema de Eventos

Backend Django com arquitetura MDC para o sistema de gerenciamento de eventos.

## 🏗️ Arquitetura MDC

O projeto segue a arquitetura MDC (Models, Serializers, Services, Views, URLs) para melhor organização e manutenibilidade:

```
apps/eventos/
├── models/           # Modelos de dados
│   ├── evento.py
│   ├── participante.py
│   └── ingresso.py
├── serializers/      # Serializers DRF
│   ├── evento.py
│   ├── participante.py
│   └── ingresso.py
├── views/           # Views da API
│   ├── evento.py
│   ├── participante.py
│   └── ingresso.py
├── urls/            # URLs da API
│   ├── evento.py
│   ├── participante.py
│   └── ingresso.py
└── admin.py         # Interface administrativa
```

## 📊 Modelos de Dados

### Evento
- **nome**: Nome do evento
- **data**: Data e hora do evento
- **local**: Local do evento
- **capacidade**: Capacidade máxima
- **descricao**: Descrição do evento
- **preco_ingresso**: Preço do ingresso
- **status**: Status do evento (ATIVO, CANCELADO, FINALIZADO)

### Participante
- **nome**: Nome completo
- **email**: Email (único)
- **telefone**: Telefone
- **data_nascimento**: Data de nascimento
- **cpf**: CPF (único)

### Ingresso
- **evento**: Relacionamento com Evento
- **participante**: Relacionamento com Participante
- **tipo**: Tipo do ingresso (VIP, PADRAO, ESTUDANTE, IDOSO)
- **preco**: Preço do ingresso
- **status**: Status do ingresso (ATIVO, USADO, CANCELADO)

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do backend:

```env
MONGODB_URL=mongodb://localhost:27017/
DB_NAME=sistema_eventos
SECRET_KEY=sua-chave-secreta-aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Instalação
```bash
# Instalar dependências
pip install -r requirements.txt

# Executar migrações
python manage.py makemigrations
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Executar servidor
python manage.py runserver
```

## 📚 API Endpoints

### Eventos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/eventos/` | Listar eventos |
| POST | `/api/eventos/` | Criar evento |
| GET | `/api/eventos/{id}/` | Detalhes do evento |
| PUT | `/api/eventos/{id}/` | Atualizar evento |
| DELETE | `/api/eventos/{id}/` | Deletar evento |
| POST | `/api/eventos/{id}/cancelar/` | Cancelar evento |
| POST | `/api/eventos/{id}/finalizar/` | Finalizar evento |

### Participantes
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/participantes/` | Listar participantes |
| POST | `/api/participantes/` | Criar participante |
| GET | `/api/participantes/{id}/` | Detalhes do participante |
| PUT | `/api/participantes/{id}/` | Atualizar participante |
| DELETE | `/api/participantes/{id}/` | Deletar participante |
| GET | `/api/participantes/{id}/ingressos/` | Ingressos do participante |

### Ingressos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/ingressos/` | Listar ingressos |
| POST | `/api/ingressos/` | Criar ingresso |
| GET | `/api/ingressos/{id}/` | Detalhes do ingresso |
| PUT | `/api/ingressos/{id}/` | Atualizar ingresso |
| DELETE | `/api/ingressos/{id}/` | Deletar ingresso |
| POST | `/api/ingressos/{id}/cancelar/` | Cancelar ingresso |
| POST | `/api/ingressos/{id}/usar/` | Usar ingresso |

## 🔍 Filtros e Busca

### Eventos
- **Busca**: `?search=termo` (nome, local, descrição)
- **Status**: `?status=ATIVO` (ATIVO, CANCELADO, FINALIZADO)

### Participantes
- **Busca**: `?search=termo` (nome, email, telefone)

### Ingressos
- **Evento**: `?evento=id` (filtrar por evento)
- **Participante**: `?participante=id` (filtrar por participante)
- **Status**: `?status=ATIVO` (ATIVO, USADO, CANCELADO)

## 🛡️ Segurança

- **CORS**: Configurado para permitir frontend
- **Throttling**: Rate limiting para APIs
- **Validação**: Validação de dados nos serializers
- **Autenticação**: Autenticação básica configurada

## 📝 Logs

Os logs são salvos em `logs/django.log` e também exibidos no console durante desenvolvimento.

## 🧪 Testes

Para executar os testes:
```bash
python manage.py test
```

## 📦 Dependências

### Produção
- Django 4.2
- Django REST Framework
- Djongo (MongoDB)
- django-cors-headers
- python-dotenv

### Desenvolvimento
- Ver `requirements/dev.txt`

## 🚀 Deploy

Para produção, configure:
- `DEBUG=False`
- `SECRET_KEY` segura
- `ALLOWED_HOSTS` apropriados
- Banco de dados MongoDB em produção 