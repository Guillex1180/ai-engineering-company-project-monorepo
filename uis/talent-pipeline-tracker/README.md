# Talent Pipeline Tracker — TrackFlow People & Talent

Herramienta interna de **People & Talent de TrackFlow** para gestionar el
pipeline de candidaturas. Hito 3 del monorepo.

Consume la Talent Tracker API pública:
`https://playground.4geeks.com/tracker/api/v1` ([docs](https://playground.4geeks.com/tracker/api/v1/docs)).

## Tecnologías

Next.js (App Router) · React · TypeScript · Tailwind CSS · ESLint · `fetch` nativo.
Sin librerías de estado global (solo hooks de React). Sin secretos en el frontend.

## Requisitos y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar el entorno (la URL pública de la API, sin secretos)
cp .env.example .env.local

# 3. Desarrollo
npm run dev            # http://localhost:3000

# Verificaciones
npm run lint
npm run typecheck      # tsc --noEmit
npm run build
```

> `.env.local` está excluido por `.gitignore` (`.env*.local`). `.env.example` sí se versiona.

## Rutas

- `/` — listado del pipeline con filtros (estado, etapa) por query params, búsqueda y "Nueva candidatura".
- `/candidates/[id]` — detalle: todos los campos, cambio de estado y etapa (PATCH) y notas internas (GET/POST/DELETE).
- `/candidates/new` — registrar candidatura (POST).
- `/candidates/[id]/edit` — editar candidatura (PUT), formulario prellenado.

## Estructura

```text
app/
├── layout.tsx                 # Header/branding TrackFlow People & Talent
├── globals.css
├── page.tsx                   # Listado (Suspense + filtros + búsqueda)
└── candidates/
    ├── new/page.tsx           # POST /records
    └── [id]/
        ├── page.tsx           # Detalle
        └── edit/page.tsx      # PUT /records/:id
components/                     # CandidateList/Card/Filters/Search/Detail/Form,
                                # StatusControl, StageControl, NotesSection/List, NoteForm,
                                # Badges, LoadingState, ErrorState, FeedbackMessage
services/candidates.ts         # Capa de acceso a la API (fetch + async/await)
types/candidate.ts             # Tipos exactos de la API
lib/labels.ts                  # Traducción status/stage al lenguaje de TrackFlow
```

## Contrato de la API (real)

- **status**: `received`, `in_progress`, `selected`, `discarded`
- **stage**: `pending`, `review`, `personal_interview`, `technical_interview`, `offer_presented`
- **Record**: `id`, `full_name`, `email`, `phone`, `position`, `linkedin_url?`, `cv_url?`,
  `status`, `stage`, `experience_years`, `notes_count`, `applied_at`, `updated_at`
- **Crear/editar** requieren: `full_name`, `email`, `phone`, `position`, `experience_years`.
- **Nota**: `{ content }`.

Los nombres de campo de la API se mantienen en `snake_case`; la UI los traduce al
contexto de TrackFlow (Estado, Etapa, Notas internas, etc.).
