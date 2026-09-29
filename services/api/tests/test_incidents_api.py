"""
Tests de la API de incidencias. Verifican que el resultado JSON coincide con el
del análisis compartido (script == API) y el manejo de errores HTTP.
"""
from __future__ import annotations

import os
import sys

from fastapi.testclient import TestClient

_API_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, _API_ROOT)

from app.main import app  # noqa: E402

client = TestClient(app)

_REPO_ROOT = os.path.dirname(os.path.dirname(_API_ROOT))
CSV_PATH = os.path.join(_REPO_ROOT, "scripts", "incidents-TRACKFLOW.csv")


def test_analyze_valid_csv_matches_expected():
    with open(CSV_PATH, "rb") as fh:
        response = client.post(
            "/api/incidents/analyze",
            files={"file": ("incidents-TRACKFLOW.csv", fh, "text/csv")},
        )
    assert response.status_code == 200
    data = response.json()
    assert data["totalProcessed"] == 100
    assert data["validRecords"] == 90
    assert data["invalidRecords"] == 10
    assert data["byCategory"] == {"almacen": 24, "ultima_milla": 37, "logistica_inversa": 29}
    assert data["averageSatisfaction"] == 2.75


def test_analyze_rejects_non_csv():
    response = client.post(
        "/api/incidents/analyze",
        files={"file": ("data.txt", b"hello", "text/plain")},
    )
    assert response.status_code == 400


def test_analyze_rejects_empty():
    response = client.post(
        "/api/incidents/analyze",
        files={"file": ("empty.csv", b"", "text/csv")},
    )
    assert response.status_code == 400


def test_export_after_analyze():
    with open(CSV_PATH, "rb") as fh:
        client.post(
            "/api/incidents/analyze",
            files={"file": ("incidents-TRACKFLOW.csv", fh, "text/csv")},
        )
    response = client.get("/api/incidents/results/export")
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/csv")
    assert "attachment" in response.headers["content-disposition"]
    assert "total_processed,100" in response.text
