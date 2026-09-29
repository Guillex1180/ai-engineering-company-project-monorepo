# `packages` folder

This folder contains **shared packages** for the monorepo: internal libraries, utilities, types, shared components, SDKs, clients, and any code reused by multiple applications, agents, or pipelines.

Each subfolder under `packages/` should represent **one versionable package** (for example `shared-types`, `ui`, `analytics-sdk`) with its own README.

- **Main purpose**: encourage reuse and consistency across all company deliverables.
- **Recommendation**: document packages as you add them—their public API and how they are consumed from `apps/`, `agents/`, and `workflows/`.

## Packages in this folder

- **`shared/`** (`@repo/shared-types`) — base shared TypeScript types for the monorepo.
- **`trackflow-core/`** (`@repo/trackflow-core`) — reusable TypeScript logic layer for TrackFlow:
  domain models and pure utilities (collections, search, transformations, business validations).
  See [`trackflow-core/README.md`](./trackflow-core/README.md).
- **`incident-analysis/`** (`incident_analysis`, Python) — shared incident-analysis logic
  (parser, validator, analyzer, results) consumed by both the CLI (`scripts/analyze.py`) and the
  API (`services/api`). Local, deterministic processing; no external services.

> _Spanish version: [README.es.md](./README.es.md)._
