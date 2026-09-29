"""
Lógica compartida de análisis de incidencias de TrackFlow.

Este paquete contiene TODA la lógica (parsing, validación, clasificación de
errores, cálculo de métricas y serialización). Lo consumen tanto el script CLI
(`scripts/analyze.py`) como la API (`services/api`), de modo que no exista lógica
duplicada.

Procesamiento 100% local y determinista: no llama a servicios externos ni a IA.
"""
from .schema import CATEGORIES, STATUSES, REQUIRED_FIELDS, CLOSED_STATUS
from .parser import parse_csv, ParseError
from .validator import validate_record, InvalidReason
from .analyzer import analyze, AnalysisResult
from .results import result_to_dict, result_to_csv_rows

__all__ = [
    "CATEGORIES",
    "STATUSES",
    "REQUIRED_FIELDS",
    "CLOSED_STATUS",
    "parse_csv",
    "ParseError",
    "validate_record",
    "InvalidReason",
    "analyze",
    "AnalysisResult",
    "result_to_dict",
    "result_to_csv_rows",
]
