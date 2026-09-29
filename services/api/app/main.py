"""
TrackFlow — API centralizada (FastAPI).

Expone el analizador de incidencias, reutilizando EXACTAMENTE la misma lógica
compartida que el CLI (`incident_analysis` en packages/incident-analysis).
No hay algoritmo duplicado aquí: la API solo parsea el archivo subido, invoca
`analyze` y serializa el resultado.

Privacidad: el CSV se procesa en memoria, localmente; no se persiste en disco ni
se envía a servicios externos, y no se registran datos personales en logs.
"""
from __future__ import annotations

import os
import sys

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response

# Hace importable el paquete compartido sin instalación de workspaces.
_REPO_ROOT = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)
_SHARED = os.path.join(_REPO_ROOT, "packages", "incident-analysis")
if _SHARED not in sys.path:
    sys.path.insert(0, _SHARED)

from incident_analysis import (  # noqa: E402
    analyze,
    result_to_csv_rows,
    result_to_dict,
)
from incident_analysis.parser import ParseError, parse_text  # noqa: E402

from .auth import router as auth_router  # noqa: E402
from .inventory import router as inventory_router  # noqa: E402

app = FastAPI(title="TrackFlow API", version="0.1.0")

# CORS: el backoffice (Next.js) corre en otro puerto en desarrollo.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3100"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Módulos de dominio.
app.include_router(auth_router)
app.include_router(inventory_router)

# Almacenamiento en memoria del ÚLTIMO análisis.
# Limitación documentada: no hay persistencia; se pierde al reiniciar el proceso
# y no es apto para múltiples instancias. Suficiente para este ejercicio.
_last_result_dict: dict | None = None
_last_result_csv: list[tuple[str, str]] | None = None


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/incidents/analyze")
async def analyze_incidents(file: UploadFile | None = File(default=None)) -> JSONResponse:
    global _last_result_dict, _last_result_csv

    if file is None:
        raise HTTPException(status_code=400, detail="No se recibió ningún archivo.")

    filename = file.filename or ""
    if not filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="El archivo debe ser un CSV.")

    raw = await file.read()
    if not raw or not raw.strip():
        raise HTTPException(status_code=400, detail="El archivo CSV está vacío.")

    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="El archivo no es un CSV de texto válido (UTF-8).")

    try:
        records = parse_text(text)
    except ParseError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    if len(records) == 0:
        raise HTTPException(status_code=400, detail="El CSV no contiene registros (solo cabecera o vacío).")

    result = analyze(records)
    _last_result_dict = result_to_dict(result)
    _last_result_csv = result_to_csv_rows(result)

    return JSONResponse(content=_last_result_dict)


@app.get("/api/incidents/results/export")
def export_last_result() -> Response:
    if _last_result_csv is None:
        raise HTTPException(
            status_code=404,
            detail="Todavía no hay un análisis disponible para exportar.",
        )

    import csv
    import io

    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerows(_last_result_csv)
    body = buffer.getvalue()

    return Response(
        content=body,
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="results.csv"'},
    )
