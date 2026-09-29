"""
Validación de registros de incidencias.

Un registro es inválido si le falta un campo obligatorio o si category/status
tienen un valor fuera del conjunto permitido. Si hay varios problemas, se reporta
un único motivo por prioridad (missing_required > invalid_category >
invalid_status), de modo que la suma de motivos == número de inválidos.
"""
from __future__ import annotations

import enum
from typing import Optional

from .schema import CATEGORIES, REQUIRED_FIELDS, STATUSES


class InvalidReason(str, enum.Enum):
    """Motivo por el que un registro es inválido."""

    MISSING_REQUIRED = "missing_required"
    INVALID_CATEGORY = "invalid_category"
    INVALID_STATUS = "invalid_status"


def validate_record(record: dict[str, str]) -> Optional[InvalidReason]:
    """
    Devuelve el motivo de invalidez (según prioridad) o None si el registro es
    válido. No muta el registro.
    """
    # Prioridad 1: campos obligatorios.
    for field in REQUIRED_FIELDS:
        if not (record.get(field) or "").strip():
            return InvalidReason.MISSING_REQUIRED

    # Prioridad 2: categoría fuera del conjunto.
    if record["category"] not in CATEGORIES:
        return InvalidReason.INVALID_CATEGORY

    # Prioridad 3: estado fuera del conjunto.
    if record["status"] not in STATUSES:
        return InvalidReason.INVALID_STATUS

    return None


def is_valid(record: dict[str, str]) -> bool:
    """True si el registro es válido."""
    return validate_record(record) is None
