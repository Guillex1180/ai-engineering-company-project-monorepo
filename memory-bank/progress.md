# TrackFlow — Progress

> Estado real del proyecto. No marcar como completado nada que no exista o no se
> haya verificado.

## Completado

- **Website público** (`uis/website`) — landing corporativa completa + formulario
  de solicitud de información (validaciones, restricción de volumen, mensaje de
  éxito, envío simulado) + SEO + Schema.org. Verificado: build de Tailwind OK.
- **Asistente Virtual** (`uis/website`) — chat con Mock Agent desacoplado
  (Chat UI → Agent Service → Mock Agent → futura API), con prefill del formulario
  sin autoenvío. Verificado: flujo del agente probado en Node; recursos sirven 200.
- **Capa lógica TypeScript** (`packages/trackflow-core`) — modelos + utilidades
  (collections, search, transformations, validations) + demo. Verificado:
  `tsc --noEmit` OK y demo ejecuta.
- **Talent Pipeline Tracker** (`uis/talent-pipeline-tracker`) — app Next.js
  (listado, filtros por query params, búsqueda, detalle, PATCH estado/etapa,
  notas CRUD, crear/editar). Verificado: lint/typecheck/build OK y endpoints
  probados contra la API real.
- **Infraestructura de agentes de desarrollo** — `CONTEXT.md` poblado con el
  briefing oficial, `memory-bank/` (projectbrief, techContext, progress),
  `AGENTS.md`, `.agents/rules/project-context.md` y
  `.agents/skills/verify-delivery/SKILL.md`.

- **Backoffice** (`uis/backoffice`) — aplicación interna Next.js con layout propio
  (barra lateral + header), ruta `/` que renderiza un panel operativo con lógica
  visible (conteos por producto, interés por servicio, tasa de calificación,
  filtro de solicitudes por estado, estado operativo por almacén) sobre datos de
  demostración etiquetados, derivados de `CONTEXT.md`. Verificado:
  lint OK, `tsc --noEmit` OK, build OK, `/` responde 200 con contenido visible.

## En progreso

- (Sin trabajo a medias en este hito.)

- **Contenedorización (Docker Compose)** — `docker-compose.yml` (raíz) +
  `uis/Dockerfile`/`start.sh`/`.dockerignore` + `services/Dockerfile`/`.dockerignore`
  + `.env`/`.env.example`. Servicios `interfaces` (website :3000 + backoffice :3001)
  y `backend` (FastAPI :8000) en la red `trackflow-network`, con bind mounts para hot
  reload y `node_modules` preservados en volúmenes anónimos. Estado de verificación:
  archivos validados estáticamente (YAML parsea; `sh -n start.sh` OK; módulo FastAPI
  `app.main:app` importa con PYTHONPATH al paquete compartido; sin secretos). **Docker
  no está instalado en la máquina actual**, por lo que `docker compose config/build/up`
  y las pruebas de contenedores/hot reload quedan PENDIENTES de ejecutarse donde haya Docker.

- **Hito 5 — Inventario (Backoffice)** — API de inventario en `services/api`
  (`/auth/login`, `/inventory/products`, `/inventory/orders`, `POST inbound/outbound`
  con validación de stock y 400 por stock insuficiente, auth Bearer) y frontend en
  `uis/backoffice` (`/login` + rutas protegidas `/inventory/products`,
  `/inventory/orders/inbound`, `/inventory/orders/outbound`, `/inventory/orders`).
  Capa `lib/inventory.ts` centraliza el acceso (sin fetch en componentes) con Bearer
  y manejo de errores 4xx/5xx; indicador de stock (sin/bajo/saludable), stock reactivo
  en salida, 400 inline, historial solo lectura. Verificado: backend probado por HTTP
  (login/401, products, inbound, outbound OK y 400, orders); backoffice
  lint/typecheck/build OK; 4 rutas sirven y protegidas por AuthGuard. **API e auth de
  DEMOSTRACIÓN** (el CONTEXT no define contrato de inventario), estado en memoria.

- **Analizador de Incidencias** — lógica compartida en Python
  (`packages/incident-analysis`: parser, validator, analyzer, results) consumida
  por el **CLI** (`scripts/analyze.py`) y la **API** (`services/api`, FastAPI:
  `POST /api/incidents/analyze` + `GET /api/incidents/results/export`) y la
  **página del backoffice** (`/incidents`). Verificado: script coincide con los
  valores esperados del dataset de demostración; 14 tests del paquete y 4 de la
  API en verde; backoffice lint/typecheck/build OK; endpoints probados por HTTP.
  Dataset de incidencias de **demostración** (el CONTEXT oficial no define este
  dominio) — ver `scripts/INCIDENTS_SCHEMA.md`.

## Pendiente

- **Otros servicios backend** (`services/`) — solo existe `services/api`
  (incidencias); el resto del backend queda como punto de extensión.
- **Agentes y skills de producto** (`/agents`, `/skills`) — sin componentes de
  producto todavía (solo READMEs y plantillas del template).
- Integración futura del Asistente Virtual con una API de IA real vía backend
  seguro.

## Decisiones recientes

- `CONTEXT.md` estaba en placeholder; se pobló con el briefing oficial de
  TrackFlow (contenido canónico de `CONTEXT.es.md`) sin inventar datos.
- Se estableció el Memory Bank y el protocolo `AGENTS.md` para agentes de
  desarrollo, más una regla de alcance ALWAYS y una skill `verify-delivery`.
- El backoffice se implementa como app Next.js independiente con layout propio.

## Problemas conocidos

- El briefing oficial en inglés (`CONTEXT-trackflow-briefing.md`) y la carpeta
  `00-general-contexts` referenciados por el placeholder original no existen en
  el repositorio; se usó `CONTEXT.es.md` como briefing oficial presente.
- `npm install` en apps Next.js reporta vulnerabilidades de dependencias
  transitivas del ecosistema Next (no del código propio); no se aplicó
  `audit fix --force` por ser potencialmente rompiente.

## Última actualización

Hito de configuración inicial del monorepo: CONTEXT.md poblado, Memory Bank,
AGENTS.md, `.agents/rules` y `.agents/skills` creados, y `uis/backoffice`
implementado y verificado (lint/typecheck/build/render). Website y demás hitos
conservados intactos.
