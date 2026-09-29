# TrackFlow — Backoffice interno

Aplicación interna del equipo operativo de TrackFlow (People & Talent, Comercial,
Operaciones). Separada del website público, con su propio layout.

## Tecnologías

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · ESLint.

## Qué muestra

Panel operativo en `/` con lógica de negocio visible en pantalla:

- **Resumen**: solicitudes totales, tasa de calificación (%), servicios
  operativos activos/total, mercados.
- **Distribuciones**: solicitudes por tipo de producto e interés por servicio (conteos).
- **Solicitudes**: tabla con filtro por estado (cálculo en cliente, con conteo en vivo);
  en móvil se muestra como tarjetas.
- **Estado operativo por almacén**: Los Ángeles y Zaragoza.

> Los datos son de **demostración** (no provienen de una API real) y están
> etiquetados como tales en la UI. Su contenido se deriva del dominio de
> `CONTEXT.md` (servicios, cobertura, tipos de producto, volúmenes). No se
> inventan métricas de negocio reales.

## Ejecución

```bash
npm install
npm run dev          # http://localhost:3000 (usa -p 3100 si el puerto está ocupado)
npm run lint
npm run typecheck    # tsc --noEmit
npm run build
```

## Estructura

```text
app/
├── layout.tsx       # Layout propio (sidebar + header interno)
├── globals.css
└── page.tsx         # Dashboard: métricas + tabla filtrable + estado operativo
components/
└── LeadsTable.tsx   # Tabla/tarjetas de solicitudes con filtro por estado
lib/
├── demo-data.ts     # Datos de demostración derivados de CONTEXT.md
└── metrics.ts       # Lógica pura: conteos, agrupaciones, filtros, cálculos
```

## Inventario (Hito 5)

Sección de gestión de inventario, protegida por autenticación.

- `/login` — inicio de sesión (demo: `operaciones` / `trackflow`). Token Bearer en `localStorage`.
- `/inventory/products` — productos con `current_stock` e indicador de nivel de stock
  (sin stock / bajo / saludable) y accesos a entrada/salida.
- `/inventory/orders/inbound` — registrar entrada (selector por nombre, POST real).
- `/inventory/orders/outbound` — registrar salida; muestra el stock disponible de forma
  reactiva, advierte si la cantidad supera el stock y muestra el error 400 del backend inline.
- `/inventory/orders` — historial (solo lectura): producto, tipo (entrada/salida), cantidad,
  fecha y `user_uuid`.

Todas las llamadas pasan por `lib/inventory.ts` (Bearer + manejo de errores). Requiere
`NEXT_PUBLIC_INVENTORY_API_URL` (ver `.env.example`).

> La API de inventario y la autenticación son de **demostración** (el CONTEXT oficial no
> define un contrato de inventario). Estado en memoria del proceso.
