"""
Verifica que el análisis del CSV de demostración produce EXACTAMENTE los valores
esperados documentados en scripts/INCIDENTS_SCHEMA.md. Como CLI y API consumen la
misma función `analyze`, este resultado es idéntico en ambos (script == API).
"""
from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from incident_analysis import analyze, result_to_dict  # noqa: E402
from incident_analysis.parser import parse_csv  # noqa: E402

# tests/ -> incident-analysis/ -> packages/ -> repo root
_REPO_ROOT = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)
CSV_PATH = os.path.join(_REPO_ROOT, "scripts", "incidents-TRACKFLOW.csv")


def test_demo_csv_matches_expected():
    records = parse_csv(CSV_PATH)
    result = analyze(records)
    data = result_to_dict(result)

    assert data["totalProcessed"] == 100
    assert data["validRecords"] == 90
    assert data["invalidRecords"] == 10
    assert data["invalidReasons"]["missing_required"] == 4
    assert data["invalidReasons"]["invalid_category"] == 3
    assert data["invalidReasons"]["invalid_status"] == 3
    assert data["byCategory"] == {"almacen": 24, "ultima_milla": 37, "logistica_inversa": 29}
    assert data["byStatus"] == {
        "recibida": 14,
        "en_proceso": 22,
        "resuelta": 14,
        "cerrada": 19,
        "descartada": 21,
    }
    assert data["satisfactionCases"] == 12
    assert data["averageSatisfaction"] == 2.75
