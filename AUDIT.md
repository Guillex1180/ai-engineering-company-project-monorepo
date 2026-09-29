# Auditoría de Rendimiento Frontend — TrackFlow

## Metodología

**MEDIR → ANALIZAR → CORREGIR → VOLVER A MEDIR.** Todas las puntuaciones de este
documento provienen de ejecuciones reales de Lighthouse (no se inventan valores).
El baseline se tomó **antes** de tocar código de `website` o `backoffice`.

## Entorno de medición

- **Fecha:** 28 de septiembre de 2026.
- **Entorno:** contenedores Docker del monorepo (`docker compose up`), servicios
  `interfaces` (website :3000, backoffice :3001) y `backend` (:8000).
- **Herramienta:** Lighthouse 12 (CLI) sobre `chrome-headless-shell` (Chromium arm64).
- **Modos:** Desktop (`--preset=desktop`) y Mobile (`--form-factor=mobile`).
- **Categorías:** Performance, Accessibility, Best Practices, SEO.
- **URLs auditadas:**
  - Website: `http://localhost:3000` (desktop y mobile).
  - Backoffice: `http://localhost:3001/login` (desktop). `/` redirige al login por
    el `AuthGuard`, por lo que `/login` es la vista de entrada representativa que se
    puede medir sin eliminar la autenticación.

## Lighthouse inicial (BEFORE)

| Aplicación | Página   | Modo    | Performance | Accessibility | Best Practices | SEO |
| ---------- | -------- | ------- | ----------- | ------------- | -------------- | --- |
| Website    | `/`      | Desktop | 100         | 100           | 100            | 100 |
| Website    | `/`      | Mobile  | 100         | 100           | 100            | 100 |
| Backoffice | `/login` | Desktop | 97          | **96**        | 100            | 100 |

Core Web Vitals / métricas (backoffice `/login`, desktop):

- LCP: 0.4 s · CLS: 0 · TBT: 150 ms · FCP: 0.2 s · Speed Index: 0.2 s

Evidencia: `audit/before/*.report.json`, `*.report.html` y capturas `*.png`.

## Problemas encontrados (con evidencia)

### 1. Contraste de color insuficiente (Accessibility) — backoffice `/login`

- **Métrica afectada:** Accessibility (96) — auditoría `color-contrast` con score 0.
- **Evidencia (Lighthouse):** 3 elementos fallan. El texto de ayuda
  `<p class="text-xs text-slate-400">` y sus `<code>` tienen contraste **2.56**
  (foreground `#94a3b8` slate-400 sobre fondo `#ffffff`), por debajo del mínimo 4.5:1.
- **Ubicación:** `uis/backoffice/app/login/page.tsx` (línea del texto "Demo: usuario…").
- **Causa raíz:** uso de `text-slate-400`, demasiado claro sobre blanco para texto pequeño.
- **Impacto esperado:** subir el contraste ≥4.5:1 corrige la auditoría y sube Accessibility.
- **Corrección propuesta:** usar un tono más oscuro (`text-slate-600`, contraste ~7:1).

### 2. Website ya optimizado (sin margen artificial)

- El website es HTML estático + Tailwind con SEO, Schema.org y accesibilidad ya
  trabajados en hitos previos: **100/100/100/100** en desktop y mobile. No se fuerza
  ninguna "mejora" artificial aquí; el foco de corrección es el backoffice.

### 3. Diagnósticos de performance del backoffice (Next.js dev)

- `render-blocking-resources`, `unminified-javascript`, `legacy-javascript`: propios
  del **modo desarrollo** de Next.js (sin minificar, con overlay de dev). No se
  corrigen tocando el código de producto; se documentan como contexto. Performance
  ya es 97 con LCP 0.4 s.

## Análisis de duplicación (mínimo dos casos)

### Caso 1 — Patrón de carga asíncrona con fases (loading/success/empty/error)

- **Archivos afectados:** `uis/backoffice/components/ProductsView.tsx` y
  `uis/backoffice/components/OrdersView.tsx` (el mismo patrón aparece además en
  varios componentes del Talent Pipeline Tracker).
- **Duplicación:** ambos declaran `type Phase = "loading" | "success" | "empty" | "error"`,
  un `useState` de datos, un `load()` con `try/catch` que setea fase y error, un
  `useEffect(() => void load(), [load])`, y el mismo `ErrorState`/mensajes.
- **Por qué conviene abstraer:** es lógica idéntica de orquestación de fetch repetida;
  centralizarla reduce errores y estandariza el manejo de loading/empty/error.
- **Solución propuesta:** un Custom Hook `useAsyncData(fetcher)` que devuelve
  `{ phase, data, error, reload }`.

### Caso 2 — Carga de productos + selector en formularios de órdenes

- **Archivos afectados:** `uis/backoffice/components/InboundForm.tsx` y
  `uis/backoffice/components/OutboundForm.tsx`.
- **Duplicación:** ambos mantienen `const [products, setProducts] = useState<InventoryProduct[]>([])`,
  fase de carga, y una llamada a `getProducts()` en el arranque para poblar el `<select>`.
- **Por qué conviene abstraer:** misma responsabilidad (traer productos para el
  selector) duplicada en dos formularios.
- **Solución propuesta:** un Custom Hook `useProducts()` construido sobre `useAsyncData`.

## Refactor implementado

Se extrae el Custom Hook **`useAsyncData`** (`uis/backoffice/lib/useAsyncData.ts`) y
se integra en `ProductsView` y `OrdersView`, sin cambiar el comportamiento observable
(mismos estados loading/empty/error y misma UI). Ver `REPORT.md` para el detalle.

## Skills

No se utilizaron skills externas de rendimiento: el entorno del agente no tenía una
skill de core-web-vitals/web-perf instalada y compatible. El análisis se apoyó en las
auditorías reales de Lighthouse (JSON) y en la inspección del código, evitando instalar
herramientas arbitrarias.
