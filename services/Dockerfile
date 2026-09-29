# Imagen del backend FastAPI (services/api).
# Python 3.12 slim: compatible con FastAPI 0.115 / uvicorn 0.32 (requisitos del
# proyecto) y con el uso de tipos modernos del código (PEP 604, dict[str,...]).
FROM python:3.12-slim

# uv: instalador de paquetes rápido (requisito del hito).
RUN pip install --no-cache-dir uv

WORKDIR /app

# --- Dependencias primero (caché de capas) ---
# requirements.txt vive en services/api dentro del contexto de build (./services).
COPY api/requirements.txt ./requirements.txt
# uv pip install en el entorno del sistema (--system) dentro del contenedor.
RUN uv pip install --system --no-cache -r requirements.txt

# --- Código del backend ---
COPY api ./api

# El paquete de lógica compartida (incident_analysis) vive fuera de services/,
# en packages/incident-analysis. La API lo importa por sys.path en tiempo de
# ejecución; en el contenedor se monta como volumen (ver docker-compose.yml) en
# /shared/incident-analysis y se expone vía PYTHONPATH.
ENV PYTHONPATH=/shared/incident-analysis
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Uvicorn con --reload para desarrollo, escuchando en todas las interfaces.
# Módulo real verificado: app.main:app (services/api/app/main.py).
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--app-dir", "/app/api"]
