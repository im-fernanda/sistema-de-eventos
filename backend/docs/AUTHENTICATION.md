# 🔐 Sistema de Autenticação - Sistema de Eventos

## 📋 Visão Geral

O sistema de autenticação do **Sistema de Eventos** é baseado no **Django REST Framework** e utiliza **autenticação por sessão** com classes customizadas para diferentes níveis de acesso.

## 🏗️ Arquitetura da Autenticação

### 1. **Configuração Global** (`settings.py`)

```python
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",  # Desenvolvimento
        # "rest_framework.permissions.IsAuthenticatedOrReadOnly",  # Produção
    ],
}
```

### 2. **Classes de Autenticação Customizadas** (`core/authentication.py`)

#### 🔓 **SessionAuthentication**
```python
class SessionAuthentication(authentication.SessionAuthentication):
    """
    Autenticação por sessão com segurança aprimorada.
    """
    def authenticate(self, request):
        user = getattr(request._request, "user", None)
        if not user or not user.is_active:
            return None
        return (user, None)
```

#### 🌐 **PublicReadAuthentication**
```python
class PublicReadAuthentication(authentication.BaseAuthentication):
    """
    Permite acesso público para leitura, mas requer autenticação para escrita.
    """
    def authenticate(self, request):
        # Permite usuários anônimos para operações de leitura
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return (AnonymousUser(), None)
        
        # Para operações de escrita, usa autenticação por sessão
        session_auth = SessionAuthentication()
        return session_auth.authenticate(request)
```

### 3. **Classes de Permissão** (`core/permissions.py`)

#### 👤 **IsEventOwner**
```python
class IsEventOwner(permissions.BasePermission):
    """
    Permite apenas que o proprietário do evento edite.
    """
    def has_object_permission(self, request, view, obj):
        # Leitura permitida para qualquer requisição
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Escrita apenas para o proprietário do evento
        return obj.created_by == request.user
```

#### 🎫 **IsIngressoOwner**
```python
class IsIngressoOwner(permissions.BasePermission):
    """
    Permite apenas que o proprietário do ingresso edite.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.evento.created_by == request.user
```

#### 👥 **IsParticipanteOwner**
```python
class IsParticipanteOwner(permissions.BasePermission):
    """
    Permite apenas que o proprietário do participante edite.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.created_by == request.user
```

## 🔄 Fluxo de Autenticação

### **1. Requisição Chega**
```
Cliente → Django → Middleware → View → Response
```

### **2. Middleware de Autenticação**
```python
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",  # ← Sessões
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",  # ← Autenticação
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
```

### **3. Processo de Autenticação**
1. **Sessão**: Verifica se existe uma sessão válida
2. **Usuário**: Busca o usuário associado à sessão
3. **Permissões**: Verifica as permissões do usuário
4. **Acesso**: Permite ou nega o acesso

## 🎯 Modos de Operação

### **🔓 Modo Desenvolvimento (Atual)**
```python
"DEFAULT_PERMISSION_CLASSES": [
    "rest_framework.permissions.AllowAny",
]
```
- ✅ **Acesso público**: Qualquer pessoa pode acessar
- ✅ **Sem login**: Não precisa fazer login
- ✅ **Ideal para**: Desenvolvimento e testes

### **🔐 Modo Produção (Futuro)**
```python
"DEFAULT_PERMISSION_CLASSES": [
    "rest_framework.permissions.IsAuthenticatedOrReadOnly",
]
```
- 🔒 **Leitura pública**: Qualquer pessoa pode ler
- 🔐 **Escrita protegida**: Apenas usuários logados podem escrever
- 👤 **Login obrigatório**: Para operações de criação/edição/exclusão

## 🛡️ Segurança Implementada

### **1. Validação de Senhas**
```python
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {"min_length": 8},
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]
```

### **2. Rate Limiting**
```python
"DEFAULT_THROTTLE_RATES": {
    "anon": "100/hour",    # Usuários anônimos: 100 req/hora
    "user": "1000/hour",   # Usuários logados: 1000 req/hora
}
```

### **3. CORS Configurado**
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]
CORS_ALLOW_CREDENTIALS = True
```

### **4. Configurações de Segurança (Produção)**
```python
if not DEBUG:
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    X_FRAME_OPTIONS = "DENY"
```

## 🔧 Como Usar

### **1. Login via Admin**
```bash
# URL: http://localhost:8000/admin
# Usuário: admin
# Senha: admin123
```

### **2. Criar Novos Usuários**
```python
# Via Django shell
python manage.py shell

from django.contrib.auth.models import User
User.objects.create_user('usuario', 'email@exemplo.com', 'senha123')
```

### **3. Verificar Autenticação**
```python
# Em uma view
def minha_view(request):
    if request.user.is_authenticated:
        print(f"Usuário logado: {request.user.username}")
    else:
        print("Usuário anônimo")
```

## 📊 Níveis de Acesso

### **👤 Usuário Anônimo**
- ✅ **GET**: Ler eventos, participantes, ingressos
- ❌ **POST/PUT/DELETE**: Não permitido

### **🔐 Usuário Logado**
- ✅ **GET**: Ler todos os recursos
- ✅ **POST**: Criar novos recursos
- ✅ **PUT**: Editar recursos próprios
- ✅ **DELETE**: Excluir recursos próprios

### **👑 Superusuário (Admin)**
- ✅ **Todas as operações**: Acesso completo
- ✅ **Admin Interface**: `http://localhost:8000/admin`

## 🚀 Próximos Passos

### **Melhorias Sugeridas**
- [ ] **JWT Authentication**: Para APIs stateless
- [ ] **OAuth2**: Integração com provedores externos
- [ ] **2FA**: Autenticação de dois fatores
- [ ] **Role-based Access**: Permissões baseadas em roles
- [ ] **API Keys**: Para integrações externas

### **Implementação JWT**
```python
# requirements/base.txt
djangorestframework-simplejwt==5.2.2

# settings.py
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
}
```

## 🔍 Troubleshooting

### **Problemas Comuns**

1. **Erro 401 Unauthorized**
   - Verifique se o usuário está logado
   - Confirme as permissões da view

2. **Erro 403 Forbidden**
   - Verifique se o usuário tem permissão para o recurso
   - Confirme se é o proprietário do objeto

3. **Sessão Expirada**
   - Faça login novamente
   - Verifique as configurações de sessão

### **Logs de Autenticação**
```python
# Adicione ao settings.py para debug
LOGGING = {
    "loggers": {
        "django.contrib.auth": {
            "level": "DEBUG",
        },
    },
}
```

## 📚 Referências

- [Django REST Framework Authentication](https://www.django-rest-framework.org/api-guide/authentication/)
- [Django Permissions](https://docs.djangoproject.com/en/4.2/topics/auth/default/)
- [DRF Permissions](https://www.django-rest-framework.org/api-guide/permissions/) 