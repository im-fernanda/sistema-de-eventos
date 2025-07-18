# Dockerfile otimizado para backend Django + frontend simples
FROM python:3.11-slim

# Definir variáveis de ambiente
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=config.settings

# Definir diretório de trabalho
WORKDIR /app

# Instalar apenas dependências essenciais do sistema
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        libpq-dev \
        netcat-openbsd \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copiar apenas os arquivos de requirements primeiro (para melhor cache)
COPY backend/requirements/ /app/backend/requirements/

# Instalar dependências Python
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r backend/requirements/dev.txt

# Copiar código do backend
COPY backend/ /app/backend/

# Criar diretório de logs
RUN mkdir -p /app/backend/logs

# Copiar frontend simples
COPY frontend/ /app/frontend/

# Voltar para o diretório raiz
WORKDIR /app

# Copiar script de inicialização
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expor portas
EXPOSE 8000 8080

# Comando para executar ambos os serviços
CMD ["/app/start.sh"]
