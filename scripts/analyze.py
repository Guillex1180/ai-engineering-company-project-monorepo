#!/usr/bin/env python3
"""
TrackFlow — Analizador de Incidencias (CLI).

Uso:
    python analyze.py incidents-TRACKFLOW.csv

Consume la MISMA lógica compartida que la API (paquete incident_analysis en
packages/incident-analysis). El procesamiento es 100% local y determinista: no
envía datos a servicios externos ni imprime información personal.
"""
from __future__ import annotations

import os
import sys

# Hace importable el paquete compartido sin instalación de workspaces.
_REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_SHARED = os.path.join(_REPO_ROOT, "packages", "incident-analysis")
if _SHARED not in sys.path:
    sys.path.insert(0, _SHARED)

from incident_analysis import (  # noqa: E402
    AnalysisResult,
    ParseError,
    analyze,
    parse_csv,
    result_to_csv_rows,
)


def render_report(result: AnalysisResult, filename: str) -> str:
    """Construye el reporte de consola (solo métricas agregadas)."""
    line = "=" * 40
    sep = "-" * 40
    lines = [
        line,
        " TRACKFLOW — ANALIZADOR DE INCIDENCIAS",
        line,
        f"Archivo: {filename}",
        "",
        "REGISTROS",
        sep,
        f"Procesados:{result.total_processed:>26}",
        f"Válidos:{result.valid_records:>29}",
        f"Inválidos:{result.invalid_records:>27}",
        "",
        "INCIDENCIAS POR CATEGORÍA",
        sep,
    ]
    for category, count in result.by_category.items():
        lines.append(f"{category:<28}{count:>12}")
    lines += ["", "INCIDENCIAS POR ESTADO", sep]
    for status, count in result.by_status.items():
        lines.append(f"{status:<28}{count:>12}")

    avg = "N/A" if result.average_satisfaction is None else f"{result.average_satisfaction:.2f}"
    lines += [
        "",
        "SATISFACCIÓN",
        sep,
        f"Casos incluidos:{result.satisfaction_cases:>21}",
        f"Promedio:{avg:>28}",
        "",
        "REGISTROS INVÁLIDOS",
        sep,
        f"Campos obligatorios:{result.invalid_reasons.get('missing_required', 0):>17}",
        f"Categoría inválida:{result.invalid_reasons.get('invalid_category', 0):>18}",
        f"Estado inválido:{result.invalid_reasons.get('invalid_status', 0):>21}",
        line,
    ]
    return "\n".join(lines)


def export_results(result: AnalysisResult, out_path: str = "results.csv") -> str:
    """Escribe results.csv (una fila por métrica, solo datos agregados)."""
    import csv

    rows = result_to_csv_rows(result)
    with open(out_path, "w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerows(rows)
    return out_path


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("Error: falta el argumento con la ruta del CSV.", file=sys.stderr)
        print("Uso: python analyze.py <ruta-al-csv>", file=sys.stderr)
        return 2

    csv_path = argv[1]

    try:
        records = parse_csv(csv_path)
    except ParseError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    if len(records) == 0:
        print("Error: el CSV no contiene registros (solo cabecera o vacío).", file=sys.stderr)
        return 1

    result = analyze(records)
    print(render_report(result, os.path.basename(csv_path)))

    # Exportación opcional. En entornos no interactivos, no bloquea.
    try:
        answer = input("\n¿Deseas exportar los resultados a CSV? [s / n] ").strip().lower()
    except EOFError:
        answer = "n"
    if answer in ("s", "si", "sí", "y", "yes"):
        path = export_results(result)
        print(f"Resultados exportados a {path}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
