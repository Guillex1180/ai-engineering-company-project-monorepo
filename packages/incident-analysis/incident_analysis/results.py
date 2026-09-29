"""
Serialización del AnalysisResult: a dict (para JSON de la API) y a filas CSV
(para results.csv). Solo métricas agregadas; nunca datos personales.
"""
from __future__ import annotations

from .analyzer import AnalysisResult


def result_to_dict(result: AnalysisResult) -> dict:
    """Convierte el resultado a un dict con claves camelCase para la API/JSON."""
    return {
        "totalProcessed": result.total_processed,
        "validRecords": result.valid_records,
        "invalidRecords": result.invalid_records,
        "invalidReasons": dict(result.invalid_reasons),
        "byCategory": dict(result.by_category),
        "byStatus": dict(result.by_status),
        "satisfactionCases": result.satisfaction_cases,
        "averageSatisfaction": result.average_satisfaction,
    }


def result_to_csv_rows(result: AnalysisResult) -> list[tuple[str, str]]:
    """
    Convierte el resultado a filas (metric, value) para results.csv.
    Contiene únicamente resultados agregados.
    """
    rows: list[tuple[str, str]] = [
        ("metric", "value"),
        ("total_processed", str(result.total_processed)),
        ("valid_records", str(result.valid_records)),
        ("invalid_records", str(result.invalid_records)),
    ]
    for reason, count in result.invalid_reasons.items():
        rows.append((f"invalid_{reason}", str(count)))
    for category, count in result.by_category.items():
        rows.append((f"category_{category}", str(count)))
    for status, count in result.by_status.items():
        rows.append((f"status_{status}", str(count)))
    rows.append(("satisfaction_cases", str(result.satisfaction_cases)))
    rows.append(
        (
            "average_satisfaction",
            "" if result.average_satisfaction is None else str(result.average_satisfaction),
        )
    )
    return rows
