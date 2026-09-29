# Reporte de Mejoras de Rendimiento — TrackFlow

Complementa a [`AUDIT.md`](./AUDIT.md). Todas las cifras provienen de ejecuciones
reales de Lighthouse 12 (evidencia en `audit/before/` y `audit/after/`).

## Correcciones aplicadas

### 1. Contraste de color en el login (Accessibility)

- **Problema original:** auditoría `color-contrast` con score 0 en `/login`;
  Accessibility 96.
- **Causa raíz:** el texto de ayuda usaba `text-slate-400` (#94a3b8) sobre fondo
  blanco → contraste 2.56 (< 4.5:1 requerido para texto pequeño).
- **Archivo:** `uis/backoffice/app/login/page.tsx`.
- **Cambio aplicado:** `text-slate-400` → `text-slate-600` (contraste ~7:1).
- **Métrica objetivo:** Accessibility (auditoría color-contrast).

### 2. Refactor: Custom Hook `useAsyncData` (mantenibilidad, sin cambiar UX)

- **Problema original:** patrón de carga async (fases loading/success/empty/error)
  duplicado en `ProductsView` y `OrdersView`.
- **Causa raíz:** cada componente reimplementaba `useState` de datos/fase/error,
  un `load()` con try/catch y un `useEffect`.
- **Archivos:** nuevo `uis/backoffice/lib/useAsyncData.ts`; refactor de
  `uis/backoffice/components/ProductsView.tsx` y
  `uis/backoffice/components/OrdersView.tsx`.
- **Cambio aplicado:** se extrajo el hook `useAsyncData(fetcher, { isEmpty, mapError })`
  que devuelve `{ phase, data, error, reload }`, y ambos componentes lo consumen.
  El comportamiento observable (estados y UI) no cambia.
- **Métrica objetivo:** no es una mejora de Lighthouse sino de calidad/duplicación
  (requisito académico de refactor). Verificado sin regresiones.

> El **website** no se modificó: ya puntuaba 100/100/100/100. No se forzaron cambios
> artificiales para inflar métricas.

## Comparación BEFORE / AFTER

| Aplicación | Página   | Modo    | Métrica        | Antes | Después | Cambio |
| ---------- | -------- | ------- | -------------- | ----- | ------- | ------ |
| Website    | `/`      | Desktop | Performance    | 100   | 100     | =      |
| Website    | `/`      | Desktop | Accessibility  | 100   | 100     | =      |
| Website    | `/`      | Desktop | Best Practices | 100   | 100     | =      |
| Website    | `/`      | Desktop | SEO            | 100   | 100     | =      |
| Website    | `/`      | Mobile  | Performance    | 100   | 100     | =      |
| Website    | `/`      | Mobile  | Accessibility  | 100   | 100     | =      |
| Website    | `/`      | Mobile  | Best Practices | 100   | 100     | =      |
| Website    | `/`      | Mobile  | SEO            | 100   | 100     | =      |
| Backoffice | `/login` | Desktop | Performance    | 97    | 97      | =      |
| Backoffice | `/login` | Desktop | **Accessibility** | **96** | **100** | **+4** |
| Backoffice | `/login` | Desktop | Best Practices | 100   | 100     | =      |
| Backoffice | `/login` | Desktop | SEO            | 100   | 100     | =      |

Core Web Vitals (backoffice `/login`, desktop):

| Métrica | Antes  | Después | Cambio |
| ------- | ------ | ------- | ------ |
| LCP     | 0.4 s  | 0.4 s   | =      |
| CLS     | 0      | 0       | =      |
| TBT     | 150 ms | 140 ms  | −10 ms |

Detalle clave: la auditoría `color-contrast` pasó de **score 0 → 1**.

## Impacto

El cambio de mayor impacto medible fue la **corrección de contraste en `/login`**:
subió Accessibility del backoffice de **96 a 100** (evidencia directa: la auditoría
`color-contrast` pasó a score 1). Es una relación causa-efecto clara porque fue el
único fallo de accesibilidad reportado y el único cambio que afecta a esa categoría.

El refactor `useAsyncData` no busca mover Lighthouse; su impacto es de mantenibilidad
(elimina duplicación en dos componentes) sin alterar el comportamiento.

La variación de TBT (150→140 ms) es pequeña y está dentro del ruido de medición del
modo desarrollo de Next.js; no se le atribuye causalidad fuerte.

## Problemas restantes

- Diagnósticos de performance del backoffice (`render-blocking`, `unminified-javascript`,
  `legacy-javascript`) provienen del **modo desarrollo** de Next.js. En una build de
  producción (`next start`) desaparecerían en gran parte; no se corrigen tocando el
  código de producto.
- No se auditaron vistas internas tras login (inventario/órdenes) con sesión real:
  el hito pide no eliminar la autenticación y Lighthouse headless no la inicia. La
  vista representativa medible fue `/login`.

## Conclusión

Con evidencia real de Lighthouse se demostró el ciclo MEDIR → ANALIZAR → CORREGIR →
VOLVER A MEDIR. Se logró una **mejora medible** (+4 en Accessibility del backoffice,
96→100) sin regresiones: website intacto en 100/100/100/100, backoffice sin romper
rutas, y build/lint/typecheck en verde. Además se cumplió el requisito de refactor
extrayendo e integrando el Custom Hook `useAsyncData`.
