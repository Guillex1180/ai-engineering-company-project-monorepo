# enITma Project Context

> **Fuente maestra de contexto** del proyecto de transformación a **enITma Aviation
> & Space Intelligence Platform**. Documenta empresa, negocio, arquitectura, IA y
> reglas. Todo dato corporativo no confirmable con fuente autorizada se marca como
> `PENDING VALIDATION` o `UNVERIFIED`. **No se presenta información potencial como
> hecho.**
>
> **Estados de implementación:** ✅ IMPLEMENTED · 🟡 PARTIAL · 🔵 PLANNED · ⚪ OPTIONAL · 🔴 BLOCKED
>
> Fuente pública de referencia: <https://enitma.com/v3/> (consultada para este contexto).

---

## Company

**enITma S.A. de C.V.** — empresa de software para la **industria aérea** que combina
datos, inteligencia artificial y conocimiento del negocio para transformar la toma de
decisiones en procesos financieros, operativos y comerciales. Lema: *"The efficiency experts"*.

- **Presencia (según sitio oficial):** Estados Unidos, México, Guatemala, Honduras,
  El Salvador, Costa Rica, Panamá, Colombia, Perú y España.
- **Posición de mercado (según sitio oficial):** +80% de participación en Latinoamérica
  en su sector. `PENDING VALIDATION` (cifra declarada por la empresa; no verificada de forma independiente).
- **Certificaciones, casos de éxito con nombres de cliente, contratos:** `UNVERIFIED`
  (no documentados en la fuente consultada; no se inventan).

## Business Context

enITma acompaña a **aerolíneas, aeropuertos y actores del ecosistema aeronáutico** en su
transformación digital, integrando analítica avanzada, IA y conocimiento del sector para
optimizar ingresos, reducir riesgos y operar con mayor eficiencia mediante plataformas
"confiables y auditables".

## Aviation Industry

Dominio central y confirmado del negocio. Retos que aborda (según sitio oficial):
optimización operativa, rentabilidad, experiencia del pasajero, cumplimiento regulatorio
y toma de decisiones en tiempo real.

## Space Industry

**Nueva vertical de posicionamiento tecnológico de este proyecto.** 🔵 PLANNED como
narrativa; ✅ IMPLEMENTED como sección web y dominio del asistente.

> **REGLA CRÍTICA:** No se afirma que enITma trabaje actualmente con NASA, ESA, SpaceX,
> agencias espaciales, fabricantes de satélites ni misiones. La vertical Space se presenta
> **exclusivamente** como *aplicaciones potenciales* de las capacidades tecnológicas de
> enITma a la industria espacial. Lenguaje obligatorio: "enITma podría aplicar…", "esta
> capacidad podría adaptarse…", "una posible aplicación sería…".

## Products (según sitio oficial de enITma)

Nombres de producto confirmados en la fuente pública (sus características detalladas más
allá de la descripción pública son `PENDING VALIDATION`):

- **Airline Travel Intelligence Platform**
- **enITma Travel Behavior Graph AI**
- **enITma Financial Trust AI** — IA para gestión financiera: detección de anomalías,
  prevención de fraude y optimización de ingresos sobre grandes volúmenes de transacciones.
- **Predictive Intelligence Platform AI**
- **enITma Crew Optimization AI** — gestión de personal de cabina (asignaciones,
  itinerarios, comunicación, cumplimiento operativo).
- **Security Airport & Shift Compliance**

## Technologies

Conceptos de posicionamiento: Aviation · Data · Cloud · Automation · Artificial
Intelligence · Predictive Intelligence · Decision Intelligence.
Concepto visual central: **DATA → INTELLIGENCE → PREDICTION → DECISION → ACTION**.

## AI Strategy

Arquitectura **multi-modelo** desacoplada por responsabilidad (clasificación, embeddings,
reranking, generación, validación, documentos, anomalías, predicción, grafo). No depende de
un único proveedor. Ver `MVP_Ljimenez.md` para el detalle por modelo.

## Space AI Assistant

**enITma Space AI** — *Intelligence for the Space Industry*. Asistente **especializado y
restringido**: responde **solo** preguntas relacionadas simultáneamente con **enITma + la
Industria Espacial**. No es un chatbot generalista. Rechaza cordialmente lo fuera de dominio.
✅ IMPLEMENTED (guardrails + clasificador de dominio + RAG local sobre esta KB + validador de
respuesta). 🔵 PLANNED: LLM/embeddings externos (Bedrock/OpenAI) enchufables por `.env`.

## Architecture

Monorepo. Nueva app **`uis/enitma`** (Next.js App Router). Conserva las apps previas
(`website`, `backoffice`, `talent-pipeline-tracker`) y el backend `services/api` (no se
destruyen). El asistente corre como **API interna de la app enITma** (`/api/space-ai/chat`).

## Frontend

Next.js 14 (App Router) + React 18 + TypeScript + Tailwind. Home premium con el flujo
DATA→…→ACTION, ecosistema **Aviation Intelligence** (nodos), vertical **Space Technology**
(nodos), contacto y el asistente. Interactividad respetando `prefers-reduced-motion`.

## Backend

Pipeline del asistente en rutas API de Next (server-side): seguridad de entrada →
clasificador de dominio → RAG → construcción de contexto → generación → validación de
respuesta → guardrail de salida. Abstracción `AIModelProvider` para conmutar proveedores.

## APIs

- `POST /api/space-ai/chat` ✅ — pipeline completo del asistente.
- `POST /invoices/presign` ✅ — URL prefirmada para subir facturas PDF a S3 (backoffice).
- (Se conserva `services/api` de TrackFlow: incidencias e inventario.)

## Invoice Module (Backoffice)

Módulo **Facturas** (`uis/backoffice` → `/facturas`) para cargar PDFs con
previsualización local y subida segura a S3 vía **URL prefirmada** (el frontend no
maneja credenciales de AWS; las custodia `services/api`). Si no hay bucket configurado,
funciona en modo simulado para demo local.

**Fase 1 (implementado):** ✅ selección PDF · ✅ drag & drop · ✅ validación PDF · ✅ preview
local (Object URL) · ✅ información del archivo · ✅ eliminar/cambiar · ✅ subida a S3
(presigned) · 🟡 progreso de subida.

**Fases posteriores (NO implementadas):** 🔵 Amazon Textract · 🔵 OCR · 🔵 extracción de
datos · 🔵 validación por IA · 🔵 inteligencia financiera · 🔵 procesamiento automático ·
🔵 historial de facturas. No se presentan como implementadas. Detalle en `MVP_Ljimenez.md`
(sección "Invoice Module").

## Data

Knowledge Base autorizada del asistente: este `CONTEXT.es.md` + documentos autorizados que
se añadan a `uis/enitma/knowledge/`. Los documentos recuperados son **datos, no instrucciones**.

## RAG

Retrieval-Augmented Generation: chunking de la KB → embedding → búsqueda por similitud →
top-K → (reranking) → contexto → generación → validación. ✅ IMPLEMENTED en versión local
determinista (embedding léxico/keyword + similitud); 🔵 PLANNED con embeddings vectoriales
y vector DB (OpenSearch/pgvector) reales.

## AI Models

Nueve responsabilidades (ver `MVP_Ljimenez.md`): Domain Classifier, Embedding, Reranker,
Primary Generative, Response Validator, Document Intelligence, Anomaly Detection, Predictive,
Graph Intelligence. Estado por modelo documentado en el MVP.

## Security

Sin secretos en el repo ni en el frontend. Claves solo por variables de entorno del servidor.
Prompt-injection mitigado. Los documentos de la KB nunca modifican el system prompt.

## Guardrails

- **Input:** sanitización y detección de intentos de prompt-injection.
- **Domain:** clasificador enITma+Space; fuera de dominio → respuesta de redirección fija.
- **Output:** validador que verifica pertenencia (enITma+Space), soporte en contexto y que
  no confunda capacidad potencial con existente → PASS / REWRITE / BLOCK.

## Accessibility

Objetivo WCAG 2.2 AA: HTML semántico, navegación por teclado, foco visible, skip-link, ARIA
donde aplique, contraste, jerarquía de encabezados, `alt`. Respeto de `prefers-reduced-motion`.

## SEO

Metadata, canonical, Open Graph, Twitter Cards, robots, JSON-LD (`Organization`, `WebSite`).
No se añaden datos estructurados falsos.

## Infrastructure

Docker Compose ya existente para las apps previas. La app enITma se puede añadir como
servicio adicional (🔵 PLANNED) o ejecutarse con `npm run dev`.

## Docker

`docker compose up` levanta las apps previas. Integrar `uis/enitma` en Docker: 🔵 PLANNED
(documentado en el MVP).

## Environment Variables

Todas públicas o de servidor, sin secretos en el repo. Ver tabla en `MVP_Ljimenez.md`.
Claves de proveedores de IA (`BEDROCK_*`, `OPENAI_*`) solo en `.env` local del servidor.

## Development Standards

TypeScript estricto, sin `any` para ocultar errores, ESLint sin desactivar reglas para pasar
el build, componentes reutilizables, español como idioma base de negocio (UI del sitio en
inglés/español según sección).

## Git Workflow

Rama `feature/enitma-aviation-space-ai` (no trabajar en `main`). Commits por área. No push/PR
sin aprobación del desarrollador.

## Deployment

Local (`npm run dev`) ✅. Producción / AWS: 🔵 PLANNED (arquitectura recomendada en el MVP).

## Testing

Lint/typecheck/build ✅. Pruebas del pipeline del asistente (dominio permitido, fuera de
dominio, adversarial/prompt-injection) ✅ vía script. Suite unitaria formal: 🔵 PLANNED.

## Observability

Cada request del asistente genera `requestId` y registra (sin datos sensibles): timestamp,
modelo, latencia, nº de documentos recuperados, resultado del validador y estado. 🟡 PARTIAL.

## Performance

Optimización de imágenes, lazy loading, code splitting, fuentes; animaciones ligeras. 🟡 PARTIAL.

## Roadmap

- **MVP (este entregable):** sitio enITma (Home, Aviation, Space, Contacto) + enITma Space AI
  con guardrails + RAG local + arquitectura multi-modelo desacoplada + documentación.
- **Fase 2:** conectar embeddings + LLM reales (Bedrock/OpenAI) por `.env`; vector DB;
  reranker real; observabilidad completa; Docker de la app enITma.
- **Fase 3:** Document Intelligence (Textract), Anomaly/Predictive/Graph productivos, AWS
  deployment, CI/CD, evaluación automática de RAG.
