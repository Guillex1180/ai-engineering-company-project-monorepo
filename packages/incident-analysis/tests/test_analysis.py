"""
Tests de la lógica compartida de análisis de incidencias.
Ejecutar: pytest (desde packages/incident-analysis).
"""
from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from incident_analysis import analyze, validate_record, InvalidReason  # noqa: E402
from incident_analysis.parser import parse_text, ParseError  # noqa: E402


def make(**overrides):
    base = {
        "id": "INC-1",
        "created_at": "2025-09-01",
        "category": "almacen",
        "status": "cerrada",
        "channel": "web",
        "satisfaction": "4",
        "customer_email": "x@example.com",
    }
    base.update(overrides)
    return base


# ------------------------- Validación -------------------------

def test_valid_record():
    assert validate_record(make()) is None


def test_missing_required_field():
    assert validate_record(make(id="")) is InvalidReason.MISSING_REQUIRED
    assert validate_record(make(category="")) is InvalidReason.MISSING_REQUIRED
    assert validate_record(make(status="")) is InvalidReason.MISSING_REQUIRED


def test_invalid_category():
    assert validate_record(make(category="soporte")) is InvalidReason.INVALID_CATEGORY


def test_invalid_status():
    assert validate_record(make(status="abierta")) is InvalidReason.INVALID_STATUS


def test_priority_missing_over_category():
    # Falta id Y categoría inválida -> gana missing_required.
    assert validate_record(make(id="", category="soporte")) is InvalidReason.MISSING_REQUIRED


# ------------------------- Análisis -------------------------

def test_empty_collection():
    result = analyze([])
    assert result.total_processed == 0
    assert result.valid_records == 0
    assert result.invalid_records == 0
    assert result.average_satisfaction is None
    assert result.satisfaction_cases == 0


def test_by_category_and_status():
    records = [
        make(id="A", category="almacen", status="recibida", satisfaction=""),
        make(id="B", category="almacen", status="cerrada", satisfaction="5"),
        make(id="C", category="ultima_milla", status="en_proceso", satisfaction=""),
    ]
    result = analyze(records)
    assert result.by_category["almacen"] == 2
    assert result.by_category["ultima_milla"] == 1
    assert result.by_status["recibida"] == 1
    assert result.by_status["cerrada"] == 1
    assert result.by_status["en_proceso"] == 1


def test_satisfaction_only_closed_with_score():
    records = [
        make(id="A", status="cerrada", satisfaction="4"),
        make(id="B", status="cerrada", satisfaction="2"),
        make(id="C", status="cerrada", satisfaction=""),   # cerrada sin nota -> excluida
        make(id="D", status="resuelta", satisfaction="5"),  # no cerrada -> excluida
    ]
    result = analyze(records)
    assert result.satisfaction_cases == 2
    assert result.average_satisfaction == 3.0  # (4+2)/2


def test_satisfaction_ignores_missing_not_zero():
    records = [
        make(id="A", status="cerrada", satisfaction="5"),
        make(id="B", status="cerrada", satisfaction=""),  # ausente, NO cuenta como 0
    ]
    result = analyze(records)
    assert result.satisfaction_cases == 1
    assert result.average_satisfaction == 5.0


def test_satisfaction_out_of_range_ignored():
    records = [
        make(id="A", status="cerrada", satisfaction="9"),  # fuera de 1-5 -> excluida
        make(id="B", status="cerrada", satisfaction="3"),
    ]
    result = analyze(records)
    assert result.satisfaction_cases == 1
    assert result.average_satisfaction == 3.0


def test_mixed_valid_and_invalid():
    records = [
        make(id="A"),                                   # válido
        make(id="", category="almacen"),                # missing
        make(id="C", category="soporte"),               # categoría inválida
        make(id="D", status="abierta"),                 # estado inválido
    ]
    result = analyze(records)
    assert result.total_processed == 4
    assert result.valid_records == 1
    assert result.invalid_records == 3
    assert result.invalid_reasons["missing_required"] == 1
    assert result.invalid_reasons["invalid_category"] == 1
    assert result.invalid_reasons["invalid_status"] == 1
    # La suma de motivos == inválidos (sin doble conteo).
    assert sum(result.invalid_reasons.values()) == result.invalid_records


# ------------------------- Parser -------------------------

def test_parse_empty_raises():
    try:
        parse_text("")
        assert False, "debería lanzar ParseError"
    except ParseError:
        pass


def test_parse_header_only_returns_empty():
    rows = parse_text("id,category,status\n")
    assert rows == []
