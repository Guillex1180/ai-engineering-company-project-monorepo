"""
Parsing del CSV de incidencias. Convierte texto CSV en filas (dicts) sin aplicar
reglas de negocio (eso es responsabilidad del validator). No carga los datos más
de una vez ni copia innecesariamente: devuelve un iterador o lista según se pida.
"""
from __future__ import annotations

import csv
import io
from typing import Iterable, Iterator


class ParseError(Exception):
    """Error de parsing/lectura del CSV (archivo vacío, sin cabecera, etc.)."""


def _rows_from_reader(reader: csv.DictReader) -> Iterator[dict[str, str]]:
    if reader.fieldnames is None:
        raise ParseError("El CSV está vacío o no tiene cabecera.")
    for raw in reader:
        # Normaliza None -> "" y recorta espacios; no altera valores de negocio.
        yield {key: (value or "").strip() for key, value in raw.items() if key is not None}


def parse_text(text: str) -> list[dict[str, str]]:
    """Parsea un CSV en memoria (texto) y devuelve la lista de filas."""
    if not text.strip():
        raise ParseError("El contenido CSV está vacío.")
    reader = csv.DictReader(io.StringIO(text))
    return list(_rows_from_reader(reader))


def parse_csv(path: str) -> list[dict[str, str]]:
    """
    Lee un CSV desde disco y devuelve la lista de filas.
    Lanza ParseError con mensaje claro ante archivo inexistente/ilegible/vacío.
    """
    try:
        with open(path, "r", encoding="utf-8", newline="") as handle:
            content = handle.read()
    except FileNotFoundError as exc:
        raise ParseError(f"El archivo no existe: {path}") from exc
    except IsADirectoryError as exc:
        raise ParseError(f"La ruta es un directorio, no un archivo: {path}") from exc
    except PermissionError as exc:
        raise ParseError(f"No hay permisos para leer el archivo: {path}") from exc
    except OSError as exc:
        raise ParseError(f"No se pudo leer el archivo: {path}") from exc
    return parse_text(content)


def iter_rows(rows: Iterable[dict[str, str]]) -> Iterator[dict[str, str]]:
    """Itera filas ya parseadas (útil para no re-materializar en memoria)."""
    yield from rows
