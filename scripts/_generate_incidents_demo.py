#!/usr/bin/env python3
"""
Generador determinista del CSV de DEMOSTRACIÓN de incidencias de TrackFlow.

NOTA DE ALCANCE: el CONTEXT oficial de TrackFlow no define un dominio de
incidencias. Este dataset es de DEMOSTRACIÓN y su esquema (categorías, estados,
satisfacción) se documenta en scripts/INCIDENTS_SCHEMA.md. La semilla fija hace
el CSV reproducible, de modo que los "valores esperados" se derivan del propio
dato y no se inventan.

Uso: python _generate_incidents_demo.py  (escribe scripts/incidents-TRACKFLOW.csv)
Este archivo auxiliar no forma parte del analizador; solo produce el CSV demo.
"""
import csv
import os
import random

CATEGORIES = ["almacen", "ultima_milla", "logistica_inversa"]
STATUSES = ["recibida", "en_proceso", "resuelta", "cerrada", "descartada"]
CHANNELS = ["email", "telefono", "chat", "web"]

SEED = 20250928
TOTAL_VALID = 90      # registros válidos
TOTAL_INVALID = 10    # registros inválidos (deliberados)

OUT = os.path.join(os.path.dirname(__file__), "incidents-TRACKFLOW.csv")


def build_rows() -> list[dict]:
    rng = random.Random(SEED)
    rows: list[dict] = []
    n = 0

    # --- 90 registros válidos ---
    for _ in range(TOTAL_VALID):
        n += 1
        category = rng.choice(CATEGORIES)
        status = rng.choice(STATUSES)
        # satisfaction: presente solo en una parte; solo cuenta si estado == cerrada
        if rng.random() < 0.6:
            satisfaction = str(rng.randint(1, 5))
        else:
            satisfaction = ""
        rows.append({
            "id": f"INC-{1000 + n}",
            "created_at": f"2025-09-{(n % 28) + 1:02d}",
            "category": category,
            "status": status,
            "channel": rng.choice(CHANNELS),
            "satisfaction": satisfaction,
            "customer_email": f"cliente{n}@example.com",
        })

    # --- 10 registros inválidos, con motivos controlados ---
    # 4 con campo obligatorio faltante (id/category/status vacíos)
    invalid_specs = [
        {"id": "", "category": "almacen", "status": "recibida"},            # falta id
        {"id": "INC-2001", "category": "", "status": "resuelta"},           # falta category
        {"id": "INC-2002", "category": "ultima_milla", "status": ""},       # falta status
        {"id": "", "category": "", "status": ""},                            # faltan varios
        # 3 con categoría inválida
        {"id": "INC-2003", "category": "devoluciones", "status": "recibida"},
        {"id": "INC-2004", "category": "soporte", "status": "cerrada"},
        {"id": "INC-2005", "category": "envio", "status": "en_proceso"},
        # 3 con estado inválido
        {"id": "INC-2006", "category": "almacen", "status": "abierta"},
        {"id": "INC-2007", "category": "logistica_inversa", "status": "pendiente"},
        {"id": "INC-2008", "category": "ultima_milla", "status": "finalizada"},
    ]
    for i, spec in enumerate(invalid_specs, start=1):
        rows.append({
            "id": spec["id"],
            "created_at": f"2025-09-{(i % 28) + 1:02d}",
            "category": spec["category"],
            "status": spec["status"],
            "channel": "web",
            "satisfaction": "",
            "customer_email": f"invalid{i}@example.com",
        })

    return rows


def main() -> None:
    rows = build_rows()
    fields = ["id", "created_at", "category", "status", "channel", "satisfaction", "customer_email"]
    with open(OUT, "w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)
    print(f"Escrito {OUT} con {len(rows)} registros.")


if __name__ == "__main__":
    main()
