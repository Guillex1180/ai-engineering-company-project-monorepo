# TrackFlow — Technical Context

> Active technical context of the monorepo. Update this file when a new technical
> or architectural decision is made.

## Arquitectura del monorepo

Monorepo con responsabilidades por carpeta de primer nivel (ver `README.md`):

- `uis/` — frontends (website público, backoffice, apps internas).
- `services/` — servicios backend (APIs, workers). Aún sin servicios implementados.
- `data/` — datos crudos, pipelines, procesados, evaluación.
- `agents/` — agentes de IA **de producto** de TrackFlow.
- `skills/` — skills **de producto** (capacidades reutilizables de agentes de producto).
- `mcps/` — servidores MCP.
- `workflows/` — automatización/orquestación (n8n, etc.).
- `packages/` — librerías reutilizables (`@repo/shared-types`, `@repo/trackflow-core`).
- `shared/` — esquemas, plantillas y assets sueltos.
- `docs/`, `infra/`, `scripts/`, `internal/` — documentación y operaciones.
- `memory-bank/` — contexto persistente para agentes **de desarrollo**.
- `.agents/` — configuración (reglas y skills) para agentes **de desarrollo**.

## Frontend público

`./uis/website` — landing corporativa + formulario de solicitud de información +
Asistente Virtual. Stack: HTML estático + Tailwind CSS (compilado con Tailwind
CLI) + JavaScript vanilla en módulos ES. Sin backend: envío de formulario y
respuestas del asistente simulados en el cliente.

## Aplicación interna

`./uis/backoffice` — aplicación interna del equipo operativo de TrackFlow.
Stack: Next.js (App Router) + React + TypeScript + Tailwind CSS + ESLint.
Layout propio, distinto del website público. Muestra un panel operativo con
lógica visible (conteos, agrupaciones, filtros) sobre datos de demostración
claramente identificados, derivados del dominio de `CONTEXT.md`.

## Backend

`/services` — ubicación única para todo servicio backend (APIs, workers). Ningún
backend debe vivir dentro de `uis/`.

- `services/api` — API centralizada (FastAPI). Módulos:
  - Analizador de Incidencias (`POST /api/incidents/analyze`, `GET /api/incidents/results/export`).
    Último análisis en memoria del proceso (sin base de datos).
  - Auth de demostración (`POST /auth/login` → token Bearer opaco en memoria) e
    Inventario (`/inventory/products`, `/inventory/orders`, `POST /inventory/orders/inbound|outbound`).
    Estado de inventario en memoria (productos seed + órdenes). `outbound` devuelve
    400 si la cantidad supera el stock. **Contrato de DEMOSTRACIÓN**: el CONTEXT no
    define inventario; el esquema (categorías/almacenes) se deriva del dominio de
    TrackFlow.

## Contenedorización (Docker Compose)

`docker compose up` desde la raíz levanta la plataforma de desarrollo. Archivos:
`docker-compose.yml` (raíz), `uis/Dockerfile` + `uis/start.sh` + `uis/.dockerignore`,
`services/Dockerfile` + `services/.dockerignore`, `.env` / `.env.example`.

- **Servicio `interfaces`** (build `./uis`, `node:20-alpine`): un contenedor con
  las dos apps. `start.sh` arranca el website (Tailwind watch + `serve` estático)
  en `0.0.0.0:3000` y el backoffice (`next dev -H 0.0.0.0 -p 3001`) en :3001, con
  manejo de señales (trap TERM/INT) para no dejar huérfanos. Dependencias de cada
  app instaladas por separado con `npm ci`.
- **Servicio `backend`** (build `./services`, `python:3.12-slim`): instala deps con
  `uv pip install --system -r requirements.txt` y arranca `uvicorn app.main:app
  --host 0.0.0.0 --port 8000 --reload --app-dir /app/api`. El paquete compartido
  `packages/incident-analysis` se monta en `/shared/incident-analysis` y se expone
  con `PYTHONPATH` (la API lo importa como `incident_analysis`).
- **Red** `trackflow-network` (bridge, nombre explícito). Ambos servicios en ella.
- **Puertos**: 3000, 3001, 8000 (configurables vía `.env`).
- **Hot reload**: bind mounts del código (`./uis/website`, `./uis/backoffice`,
  `./services/api`, y el paquete compartido). `node_modules` y `.next` se preservan
  con volúmenes anónimos para que el bind mount del host no los tape. `WATCHPACK_POLLING`
  y `CHOKIDAR_USEPOLLING` activan file watching por polling (fiable en Docker Desktop/macOS).
- **Navegador vs red Docker**: el tráfico frontend→backend es client-side (navegador
  en el host), por eso `NEXT_PUBLIC_*=http://localhost:8000`. No hay tráfico
  contenedor→contenedor actualmente; si se añadiera, usaría `http://backend:8000`.
- **Healthcheck** del backend contra `/health`. `interfaces` declara `depends_on: backend`.
- **Persistencia**: la API guarda su estado (incidencias, inventario) en memoria; no
  hay base de datos ni ficheros de datos que proteger en volúmenes.

## Backoffice — autenticación

El backoffice usa un token Bearer guardado en `localStorage` (`lib/auth.ts`), obtenido
vía `POST /auth/login`. Las vistas protegidas se envuelven con `components/AuthGuard.tsx`,
que redirige a `/login` si no hay sesión. Toda llamada a inventario pasa por
`lib/inventory.ts`, que añade `Authorization: Bearer` y ante 401 limpia la sesión.

## Lógica compartida (CLI ↔ API)

`packages/incident-analysis` (paquete Python `incident_analysis`) contiene TODA la
lógica de análisis de incidencias: parsing, validación, clasificación de errores,
cálculo de métricas y serialización. La consumen **tanto el CLI** (`scripts/analyze.py`)
**como la API** (`services/api`), de modo que no hay algoritmo duplicado. El mismo
dataset produce el mismo resultado en ambos (verificado por tests). Procesamiento
100% local y determinista: sin servicios externos ni IA, y sin datos personales en
la salida.

## Agentes de producto

`/agents` — agentes de IA de producto de TrackFlow (p. ej. asistentes de soporte
u operaciones). Es **código/producto**, no configuración de agentes de desarrollo.

## Skills de producto

`/skills` — capacidades reutilizables de los agentes de producto. También es
**producto**, no configuración de desarrollo.

## Distinción clave: `.agents/` vs `/agents` y `/skills`

- `.agents/` → **configuración para los agentes DE DESARROLLO** (reglas y skills
  que guían a un agente de programación cuando trabaja en este repo).
- `/agents` y `/skills` → **código/producto** del monorepo (agentes y capacidades
  que TrackFlow ofrece o ejecuta).

No deben confundirse ni mezclarse sus responsabilidades.

## Stack tecnológico

- **Website**: HTML + Tailwind CSS + JavaScript (módulos ES). Node/npm para el
  build de Tailwind.
- **Backoffice**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS,
  ESLint. `fetch` nativo; sin librerías de estado global.
- **Talent Pipeline Tracker** (`uis/talent-pipeline-tracker`): Next.js 14,
  React 18, TypeScript, Tailwind, ESLint; consume la Talent Tracker API pública.
- **Capa lógica** (`packages/trackflow-core`): TypeScript (strict), tsx para demo.

## Convenciones

- "Si tiene UI → `uis/`; si expone API/corre en segundo plano → `services/`"
  (según `README.md` raíz).
- Cada app/paquete nuevo se documenta con su propio README.
- Nombres de campo de APIs externas se mantienen tal cual; la UI traduce al
  lenguaje de negocio de TrackFlow (separación modelo/API vs presentación).
- Idioma base de producto: español.

## Restricciones técnicas

- No introducir secretos ni credenciales en archivos versionados.
- `.env*.local` no se versiona; `.env.example` sí.
- No usar `any` para ocultar errores de TypeScript ni desactivar ESLint para que
  pase el build.
- El monorepo no tiene un runner de workspaces en la raíz: cada app/paquete
  gestiona sus dependencias en su propia carpeta.

## Decisiones de arquitectura (este hito)

- **CONTEXT.md**: estaba como placeholder genérico y el briefing oficial en inglés
  referenciado (`CONTEXT-trackflow-briefing.md` en `00-general-contexts`) no
  existe en el repo. El briefing oficial de TrackFlow realmente presente es
  `CONTEXT.es.md`. Decisión: poblar `CONTEXT.md` con el briefing oficial de
  TrackFlow (mismo contenido canónico que `CONTEXT.es.md`), sin inventar datos, y
  declarar `CONTEXT.es.md` como fuente autoritativa en caso de divergencia.
- **Backoffice**: se crea como app Next.js independiente (no reutiliza el layout
  del website) para reflejar propósitos distintos (interno vs público).
- **Datos del backoffice**: sin API real disponible para operaciones internas, se
  usan datos de demostración locales claramente etiquetados, derivados del
  dominio de `CONTEXT.md` (servicios, cobertura, tipos de producto, volúmenes).
- **Analizador de Incidencias**: el CONTEXT oficial no define un dominio de
  incidencias. Se creó un dataset de **demostración** (`scripts/incidents-TRACKFLOW.csv`,
  esquema en `scripts/INCIDENTS_SCHEMA.md`) coherente con los tres servicios de
  TrackFlow, generado de forma determinista para que los valores esperados se
  deriven del dato y no se inventen. La lógica se ubicó en `packages/` (reutilizable
  por CLI y API) en lugar de duplicarla.
