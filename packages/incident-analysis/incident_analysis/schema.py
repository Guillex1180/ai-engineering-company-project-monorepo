"""
Esquema de incidencias de TrackFlow (dataset de demostración).

Ver scripts/INCIDENTS_SCHEMA.md para el aviso de alcance: el CONTEXT oficial no
define este dominio; el esquema es de demostración, coherente con los tres
servicios de TrackFlow.
"""
from __future__ import annotations

# Conjuntos cerrados de valores válidos.
CATEGORIES: tuple[str, ...] = ("almacen", "ultima_milla", "logistica_inversa")
STATUSES: tuple[str, ...] = ("recibida", "en_proceso", "resuelta", "cerrada", "descartada")

# Campos obligatorios de cada registro.
REQUIRED_FIELDS: tuple[str, ...] = ("id", "category", "status")

# Estado que se considera "cerrado" para el índice de satisfacción.
CLOSED_STATUS: str = "cerrada"

# Columnas esperadas en el CSV.
COLUMNS: tuple[str, ...] = (
    "id",
    "created_at",
    "category",
    "status",
    "channel",
    "satisfaction",
    "customer_email",
)

# Rango válido de la puntuación de satisfacción.
SATISFACTION_MIN: int = 1
SATISFACTION_MAX: int = 5
