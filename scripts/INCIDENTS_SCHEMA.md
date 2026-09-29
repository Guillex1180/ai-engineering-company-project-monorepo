# Esquema de incidencias — TrackFlow (dataset de DEMOSTRACIÓN)

> **Aviso de alcance.** El CONTEXT oficial de TrackFlow (`CONTEXT.md` /
> `CONTEXT.es.md`) **no** define un dominio de incidencias (campos, categorías,
> estados, satisfacción ni valores esperados). Este esquema y el CSV asociado son
> un **dataset de demostración** definido para el proyecto "Analizador de
> Incidencias", coherente con el dominio real de TrackFlow (los tres servicios y
> la operación binacional). Los "valores esperados" de más abajo se derivan del
> propio CSV generado de forma determinista (semilla fija), no de un contrato
> oficial. Si en el futuro se publica un contrato oficial, este documento y el CSV
> deben re-sincronizarse.

## Archivo

`scripts/incidents-TRACKFLOW.csv` — 100 registros (más cabecera).

## Columnas

| Columna          | Tipo    | Obligatorio | Notas                                            |
| ---------------- | ------- | ----------- | ------------------------------------------------ |
| `id`             | string  | Sí          | Identificador de la incidencia.                  |
| `created_at`     | string  | No          | Fecha (YYYY-MM-DD).                              |
| `category`       | enum    | Sí          | Conjunto cerrado (ver abajo).                    |
| `status`         | enum    | Sí          | Conjunto cerrado (ver abajo).                    |
| `channel`        | string  | No          | Canal de entrada (informativo).                  |
| `satisfaction`   | entero  | No          | 1–5. Solo se computa en incidencias `cerrada`.   |
| `customer_email` | string  | No          | **Dato sensible**: no se procesa en métricas ni se imprime. |

## Categorías válidas (derivadas de los 3 servicios del CONTEXT)

- `almacen`
- `ultima_milla`
- `logistica_inversa`

## Estados válidos

- `recibida`
- `en_proceso`
- `resuelta`
- `cerrada`  ← estado "cerrado" a efectos del índice de satisfacción
- `descartada`

## Reglas de validación

Un registro es **inválido** si:

1. Le falta algún **campo obligatorio** (`id`, `category` o `status` vacío), o
2. `category` tiene un valor **fuera del conjunto** válido, o
3. `status` tiene un valor **fuera del conjunto** válido.

**Clasificación de motivos (decisión documentada):** si un registro tiene varios
problemas, se contabiliza **un único motivo** por prioridad:
`missing_required` > `invalid_category` > `invalid_status`. Así la suma de motivos
es igual al número de registros inválidos (sin doble conteo).

Los registros inválidos se cuentan y clasifican, y se **excluyen** de las métricas
principales (categorías, estados, satisfacción); nunca se ignoran en silencio.

## Índice de satisfacción

Promedio de `satisfaction` calculado **solo** sobre registros **válidos** con
`status == "cerrada"` **y** con puntuación registrada. Las puntuaciones ausentes
no se convierten en 0: se excluyen del cálculo.

## Valores esperados (derivados del CSV determinista, semilla 20250928)

- Total procesados: **100**
- Válidos: **90** · Inválidos: **10**
- Motivos de invalidez: `missing_required` **4**, `invalid_category` **3**, `invalid_status` **3**
- Por categoría (solo válidos): `almacen` **24**, `ultima_milla` **37**, `logistica_inversa` **29**
- Por estado (solo válidos): `recibida` **14**, `en_proceso` **22**, `resuelta` **14**, `cerrada` **19**, `descartada` **21**
- Satisfacción: **12** casos incluidos, promedio **2.75**
