# `uis` folder

This folder contains **all projects with a user interface** for the cross-functional AI Engineering company project — for example: a public website, admin dashboard frontend, ecommerce UI, customer portals, Streamlit/Gradio app or other frontend-only tools.

The projects stored here are:

- **`website`** — the company's public-facing web presence (landing + Asistente Virtual).
- **`talent-pipeline-tracker`** — internal People & Talent app (Next.js) to manage the hiring
  pipeline against the Talent Tracker API. See [`talent-pipeline-tracker/README.md`](./talent-pipeline-tracker/README.md).
- **`backoffice`** — the internal admin application (Next.js, App Router). Operational dashboard
  with its own layout and visible business logic (counts, grouping, filtering) over clearly
  labeled demo data derived from `CONTEXT.md`. See [`backoffice/README.md`](./backoffice/README.md). This is the ideal place to develop multiple solutions within a single project: authentication, people management, operations management, internal communication, and other back-office capabilities.

Organize `uis/` by **different concerns** — each subfolder covers a distinct area of the company (for example, public web vs internal operations) and includes its own technical and functional documentation.

- **Main purpose**: to centralize in a single place all frontend applications that support the company's use cases.
- **Recommendation**: document in this file (or in sub-READMEs) the applications you add, their objective, the technology used, and how to run them.

## Aplicaciones en esta carpeta

- **`website/`** — Sitio web público de TrackFlow (Hito 1) + **Asistente Virtual**. Landing page
  corporativa con formulario de solicitud de información y un chat con Mock Agent local (arquitectura
  desacoplada Chat UI → Agent Service → Mock Agent → futura API). Tecnología: HTML + Tailwind CSS +
  JavaScript vanilla (módulos ES); formulario y asistente simulados (sin backend, sin credenciales).
  Ver [`website/README.md`](./website/README.md).

> _Estas instrucciones también están disponibles en [español](./README.es.md)._
