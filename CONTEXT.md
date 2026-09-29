# CONTEXT.md — TrackFlow

> Official TrackFlow company briefing for this monorepo. This is the single
> source of truth for domain facts, field names, and constraints. It mirrors the
> canonical Spanish briefing in [`CONTEXT.es.md`](./CONTEXT.es.md); if the two
> ever diverge, `CONTEXT.es.md` is authoritative and this file must be re-synced.
> Read it completely before writing any code. Everything you build must reflect
> this context.

---

## The company

**TrackFlow** is a warehouse management and last-mile delivery company founded in
2009 in Los Angeles, United States. It operates in two markets — the United
States (Los Angeles) and Spain (Zaragoza) — and offers three services: warehouse
management for e-commerce brands, last-mile delivery (the final leg from the
warehouse to the end customer), and reverse logistics (returns and product
refurbishment). It has roughly 130 employees and generates around 9 million euros
in annual revenue. Its clients are mid-sized fashion, electronics, and cosmetics
brands that sell online.

---

## Department and problem to solve

You work in the **TrackFlow Tech** unit, reporting directly to CTO Andrés Kim.
TrackFlow's current corporate website was built years ago by an external agency
and is completely outdated. It does not reflect that the company operates in two
countries, does not clearly explain the services, and offers no structured way
for interested companies to request information. Miguel Torres (Commercial
Director) needs a professional website that presents TrackFlow's services and
captures leads from potential companies that want to outsource their logistics.

---

## Stakeholder

**Miguel Torres**, Commercial Director — needs a new website that presents
TrackFlow as a serious logistics operator with presence in the United States and
Spain; explains the three core services (warehouse management, last-mile, reverse
logistics); and provides a structured information-request form to capture:
company data, product type, estimated monthly shipping volume, countries of
operation, and services of interest. The site must be responsive, accessible, and
SEO-optimized, using Tailwind, with complete form validation.

---

## Services

1. **Warehouse Management** — storage, picking and packing; real-time inventory;
   warehouses operated in Los Angeles and Zaragoza.
2. **Last-Mile Delivery** — network of certified carriers in both countries;
   unified shipment tracking; incident and returns management.
3. **Reverse Logistics** — complete returns management; inspection and
   refurbishment; integration with the client's sales platform.

---

## Markets and coverage

- **United States** — warehouse in Los Angeles; nationwide coverage; carriers:
  UPS, FedEx, DHL.
- **Spain** — warehouse in Zaragoza; mainland and islands coverage; carriers:
  MRW, SEUR, DHL.

---

## Why TrackFlow (key differentiators)

- **Binational operation** — the only operator with its own infrastructure in the
  United States and Spain.
- **+130 professionals** dedicated to client logistics.
- **Proprietary technology** for full inventory visibility.
- **E-commerce specialization** in fashion, electronics, and cosmetics.

---

## Contact

- Email: comercial@trackflow.com
- Los Angeles: +1 213 555 0147
- Zaragoza: +34 976 123 456

---

## Main entities

Derived from the information-request form and services (see `CONTEXT.es.md` for
the exact field-level contract):

- **Information request (lead)** — company name, contact person, corporate email,
  phone, company website (optional), primary operating country, product type,
  estimated monthly shipping volume, services of interest, current 3PL status,
  comments (optional), privacy acceptance.
- **Logistics service** — one of the three services above.
- **Coverage area** — United States / Spain.
- Enumerations: operating country (Estados Unidos / España / Ambos / Otro),
  product type (Moda / Electrónica / Cosmética / Alimentación / Otro), monthly
  volume (0-100 / 101-500 / 501-2000 / 2000+ / No estoy seguro), interest services
  (Almacenaje / Última milla / Logística inversa).

---

## Constraints

- The information-request form targets **e-commerce companies looking to
  outsource logistics**, not end consumers tracking a package or making a return.
  Special rule: if monthly volume is "0-100 shipments/month", show a warning that
  the service may not be the most efficient fit.
- Base language for the public experience is Spanish; multilingual support is
  optional and additive (it must not reduce the quality of the base language).
- Do not invent services, locations, statistics, or requirements not backed by
  this briefing.

---

## Roadmap (components planned in the monorepo)

Only components backed by the project so far:

- Public website (landing + information-request form) — `uis/website`.
- Virtual Assistant (chat with a local Mock Agent, decoupled from the UI) — part
  of `uis/website`, prepared to connect a future AI backend.
- Reusable TypeScript logic layer (`@repo/trackflow-core`) — domain models and
  pure utilities (collections, search, transformations, business validations).
- Internal People & Talent tool (Talent Pipeline Tracker) — `uis/talent-pipeline-tracker`.
- Internal backoffice application — `uis/backoffice`.
- Future backend services under `services/`.

---

_The canonical Spanish briefing lives in [`CONTEXT.es.md`](./CONTEXT.es.md)._
