# Imagem base com Python
FROM python:3.11-slim

# Configura diretório de trabalho
WORKDIR /app

# Variáveis de ambiente
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Instalar dependências do sistema (ex: psycopg2, Pillow, etc.)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements.txt e instalar dependências
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo o código do backend
COPY . /app/

# Expõe a porta
EXPOSE 8000

# Rodar servidor
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
