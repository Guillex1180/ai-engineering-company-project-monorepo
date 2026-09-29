"""
Análisis de incidencias: recorre los registros una sola vez, los valida y calcula
las métricas agregadas. Función pura sobre la colección de entrada (no la muta).
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Iterable

from .schema import CATEGORIES, CLOSED_STATUS, SATISFACTION_MAX, SATISFACTION_MIN, STATUSES
from .validator import InvalidReason, validate_record


@dataclass
class AnalysisResult:
    """Resultado agregado del análisis. Solo métricas, sin datos personales."""

    total_processed: int = 0
    valid_records: int = 0
    invalid_records: int = 0
    invalid_reasons: dict[str, int] = field(default_factory=dict)
    by_category: dict[str, int] = field(default_factory=dict)
    by_status: dict[str, int] = field(default_factory=dict)
    satisfaction_cases: int = 0
    average_satisfaction: float | None = None


def _parse_satisfaction(raw: str) -> int | None:
    """Devuelve la puntuación como entero en rango, o None si no es válida/ausente."""
    value = (raw or "").strip()
    if not value:
        return None
    try:
        number = int(value)
    except ValueError:
        return None
    if number < SATISFACTION_MIN or number > SATISFACTION_MAX:
        return None
    return number


def analyze(records: Iterable[dict[str, str]]) -> AnalysisResult:
    """
    Analiza una colección de registros y devuelve el resultado agregado.
    Los inválidos se cuentan y clasifican, pero se excluyen de las métricas
    principales (categoría, estado, satisfacción).
    """
    result = AnalysisResult(
        invalid_reasons={reason.value: 0 for reason in InvalidReason},
        by_category={category: 0 for category in CATEGORIES},
        by_status={status: 0 for status in STATUSES},
    )

    satisfaction_sum = 0

    for record in records:
        result.total_processed += 1
        reason = validate_record(record)

        if reason is not None:
            result.invalid_records += 1
            result.invalid_reasons[reason.value] += 1
            continue

        # Registro válido: entra en las métricas.
        result.valid_records += 1
        result.by_category[record["category"]] += 1
        result.by_status[record["status"]] += 1

        # Satisfacción solo si está cerrada y con puntuación válida.
        if record["status"] == CLOSED_STATUS:
            score = _parse_satisfaction(record.get("satisfaction", ""))
            if score is not None:
                result.satisfaction_cases += 1
                satisfaction_sum += score

    if result.satisfaction_cases > 0:
        result.average_satisfaction = round(satisfaction_sum / result.satisfaction_cases, 2)
    else:
        result.average_satisfaction = None

    return result
