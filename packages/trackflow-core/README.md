# @repo/trackflow-core

Capa lógica **TypeScript** reutilizable de TrackFlow: modelos de dominio y
utilidades puras para procesar los datos principales del negocio (solicitudes de
información, servicios y cobertura).

Sin dependencias del DOM ni de servicios externos: puede consumirse desde el
frontend (`uis/website`), un backend, el agente o pruebas.

## Estructura

```text
packages/trackflow-core/
├── src/
│   ├── types/
│   │   └── models.ts          # Interfaces y union types de TrackFlow
│   ├── data/
│   │   └── samples.ts         # Datos de ejemplo tipados (servicios, cobertura, solicitudes)
│   ├── utils/
│   │   ├── collections.ts     # Filtros, ordenamiento (asc/desc/multi), agrupación
│   │   ├── search.ts          # Búsqueda lineal + búsqueda binaria manual
│   │   ├── transformations.ts # Conteos, totales, promedios, máx/mín, reporte
│   │   └── validations.ts     # Reglas de negocio del formulario + restricción especial
│   ├── index.ts               # API pública (barrel)
│   └── demo.ts                # Demostración en consola
├── tsconfig.json              # strict: true, noImplicitAny, sin emitir
├── tsconfig.build.json        # (opcional) emitir a dist/ con declaraciones
└── package.json
```

## Entidades modeladas (derivadas de CONTEXT.es.md)

- `InformationRequest` — los 12 campos del formulario de solicitud de información.
- `LogisticsService` — los tres servicios (almacenes, última milla, logística inversa).
- `CoverageArea` — cobertura por país (Estados Unidos / España).
- Union types: `OperatingCountry`, `ProductType`, `ShippingVolume`,
  `InterestService`, `ThirdPartyLogisticsStatus`, `ServiceKey`.

> Decisión de modelado documentada: CONTEXT.es.md no da un nombre canónico a la
> entidad "solicitud"; se usa `InformationRequest` (traducción directa de
> "solicitud de información"). Los tramos de volumen son rangos de texto; para
> agregaciones numéricas se estima el punto medio de cada tramo, `"2000+"` se
> estima como 2000 (cota inferior) y `"No estoy seguro"` se trata como no
> cuantificable (se excluye de totales y promedios).

## Comandos

Requisitos: Node.js y npm. Instala dependencias una vez con `npm install`.

```bash
# Validar TypeScript (sin emitir)
npm run typecheck        # equivale a: tsc --noEmit

# Ejecutar la demostración en consola
npm run demo             # usa tsx

# (Opcional) compilar a dist/ con archivos de declaración
npm run build
```

## Uso

```ts
import {
  SAMPLE_REQUESTS,
  filterByCountry,
  sortByMonthlyVolume,
  binarySearchByCompanyName,
  buildRequestsSummary,
  validateInformationRequest
} from "@repo/trackflow-core";

const spanish = filterByCountry(SAMPLE_REQUESTS, "España");
const summary = buildRequestsSummary(SAMPLE_REQUESTS);
const result = validateInformationRequest(SAMPLE_REQUESTS[0]);
```

Todas las funciones son puras: reciben datos, no mutan los argumentos y
devuelven un nuevo resultado. La búsqueda binaria requiere que la colección
esté ordenada ascendentemente por el mismo criterio (ver `search.ts`).
