# incident-analysis (Python)

Lógica **compartida** de análisis de incidencias de TrackFlow. La consumen el CLI
(`scripts/analyze.py`) y la API (`services/api`), de modo que no exista lógica
duplicada.

```
CSV → parser → validator → analyzer → AnalysisResult → (CLI | API → backoffice)
```

## Módulos

- `schema.py` — categorías, estados, campos obligatorios, estado "cerrado".
- `parser.py` — lectura de CSV (archivo o texto) con errores claros.
- `validator.py` — validación por registro; motivo único por prioridad
  (`missing_required` > `invalid_category` > `invalid_status`).
- `analyzer.py` — recorre una vez, valida y calcula métricas (`analyze`).
- `results.py` — serialización a dict (JSON API) y a filas CSV (results.csv).

## Reglas

Ver [`../../scripts/INCIDENTS_SCHEMA.md`](../../scripts/INCIDENTS_SCHEMA.md).
El satisfaction promedio se calcula solo sobre incidencias **cerradas** con
puntuación válida (1–5); las ausentes se excluyen (no se convierten en 0).

## Tests

```bash
python3 -m venv .venv
.venv/bin/pip install pytest
.venv/bin/python -m pytest -q
```

## Alcance del dataset

El CONTEXT oficial de TrackFlow no define un dominio de incidencias; el esquema y
el CSV (`scripts/incidents-TRACKFLOW.csv`) son de **demostración**, coherentes con
los tres servicios de TrackFlow.
