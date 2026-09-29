# TrackFlow — API (services/api)

API centralizada de TrackFlow (FastAPI). Primer módulo: **Analizador de Incidencias**.

Reutiliza la **misma lógica compartida** que el CLI (`incident_analysis` en
`packages/incident-analysis`). No hay algoritmo duplicado: la API parsea el CSV
subido, invoca `analyze` y serializa el resultado.

## Endpoints

- `POST /api/incidents/analyze` — recibe `multipart/form-data` con un CSV y
  devuelve el análisis en JSON (`totalProcessed`, `validRecords`, `invalidRecords`,
  `invalidReasons`, `byCategory`, `byStatus`, `satisfactionCases`, `averageSatisfaction`).
  Errores: `400` (sin archivo, no-CSV, vacío, CSV inválido).
- `GET /api/incidents/results/export` — descarga el **último** análisis como CSV
  (`text/csv` + `Content-Disposition: attachment`). `404` si aún no hay análisis.
- `GET /health` — comprobación de vida.

## Último análisis

Se guarda en **memoria del proceso**. Limitación documentada: se pierde al
reiniciar y no es válido para múltiples instancias. Suficiente para este ejercicio;
no se introdujo base de datos.

## Privacidad

El CSV se procesa en memoria, localmente. No se persiste en disco, no se envía a
servicios externos ni a IA, y no se registran datos personales en logs. La salida
contiene solo métricas agregadas.

## Ejecución

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python -m uvicorn app.main:app --port 8000
# Tests:
.venv/bin/python -m pytest -q
```
