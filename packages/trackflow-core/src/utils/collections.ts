/**
 * Utilidades de colecciones para las solicitudes de TrackFlow.
 *
 * Todas las funciones son puras: reciben datos, no mutan los argumentos y
 * devuelven una nueva colección. No acceden al DOM ni a estado global.
 */
import type {
  InformationRequest,
  InterestService,
  OperatingCountry,
  ProductType,
  ShippingVolume
} from "../types/models.js";

/* ------------------------------- Filtros ------------------------------- */

/** Filtra solicitudes por país de operación. */
export function filterByCountry(
  requests: readonly InformationRequest[],
  country: OperatingCountry
): InformationRequest[] {
  return requests.filter((request) => request.country === country);
}

/** Filtra solicitudes por tipo de producto. */
export function filterByProductType(
  requests: readonly InformationRequest[],
  productType: ProductType
): InformationRequest[] {
  return requests.filter((request) => request.productType === productType);
}

/** Filtra solicitudes que incluyan un servicio de interés concreto. */
export function filterByService(
  requests: readonly InformationRequest[],
  service: InterestService
): InformationRequest[] {
  return requests.filter((request) => request.services.includes(service));
}

/** Orden canónico de los tramos de volumen, de menor a mayor. */
const VOLUME_ORDER: readonly ShippingVolume[] = [
  "0-100",
  "101-500",
  "501-2000",
  "2000+",
  "No estoy seguro"
];

/** Índice del tramo en el orden canónico (para comparar rangos). */
function volumeRank(volume: ShippingVolume): number {
  return VOLUME_ORDER.indexOf(volume);
}

/**
 * Filtra solicitudes cuyo tramo de volumen esté dentro de un rango inclusivo
 * definido por dos tramos. "No estoy seguro" queda fuera de cualquier rango
 * cuantitativo salvo que se indique explícitamente como extremo.
 */
export function filterByVolumeRange(
  requests: readonly InformationRequest[],
  minVolume: ShippingVolume,
  maxVolume: ShippingVolume
): InformationRequest[] {
  const min = volumeRank(minVolume);
  const max = volumeRank(maxVolume);
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  return requests.filter((request) => {
    const rank = volumeRank(request.monthlyVolume);
    return rank >= low && rank <= high;
  });
}

/* ------------------------------- Ordenamiento ------------------------------- */

export type SortDirection = "asc" | "desc";

/** Compara dos strings con locale español (case-insensitive). */
function compareStrings(a: string, b: string): number {
  return a.localeCompare(b, "es", { sensitivity: "base" });
}

/**
 * Ordena solicitudes por nombre de empresa.
 * Devuelve una nueva colección (no muta el array original).
 */
export function sortByCompanyName(
  requests: readonly InformationRequest[],
  direction: SortDirection = "asc"
): InformationRequest[] {
  const factor = direction === "asc" ? 1 : -1;
  return [...requests].sort(
    (a, b) => compareStrings(a.companyName, b.companyName) * factor
  );
}

/**
 * Ordena solicitudes por volumen mensual usando el orden canónico de tramos.
 * Devuelve una nueva colección.
 */
export function sortByMonthlyVolume(
  requests: readonly InformationRequest[],
  direction: SortDirection = "asc"
): InformationRequest[] {
  const factor = direction === "asc" ? 1 : -1;
  return [...requests].sort(
    (a, b) => (volumeRank(a.monthlyVolume) - volumeRank(b.monthlyVolume)) * factor
  );
}

/** Un criterio de ordenamiento por campo con dirección. */
export interface SortCriterion {
  field: "companyName" | "country" | "productType" | "monthlyVolume";
  direction: SortDirection;
}

/** Compara dos solicitudes según un único criterio. */
function compareByCriterion(
  a: InformationRequest,
  b: InformationRequest,
  criterion: SortCriterion
): number {
  const factor = criterion.direction === "asc" ? 1 : -1;
  switch (criterion.field) {
    case "companyName":
      return compareStrings(a.companyName, b.companyName) * factor;
    case "country":
      return compareStrings(a.country, b.country) * factor;
    case "productType":
      return compareStrings(a.productType, b.productType) * factor;
    case "monthlyVolume":
      return (volumeRank(a.monthlyVolume) - volumeRank(b.monthlyVolume)) * factor;
  }
}

/**
 * Ordena por múltiples campos en orden de prioridad. El primer criterio que
 * arroje una diferencia decide; si empatan, se pasa al siguiente.
 * Devuelve una nueva colección.
 */
export function sortByMultipleFields(
  requests: readonly InformationRequest[],
  criteria: readonly SortCriterion[]
): InformationRequest[] {
  return [...requests].sort((a, b) => {
    for (const criterion of criteria) {
      const result = compareByCriterion(a, b, criterion);
      if (result !== 0) return result;
    }
    return 0;
  });
}

/* ------------------------------- Agrupación ------------------------------- */

/**
 * Agrupa elementos por una clave derivada de cada elemento.
 * Función genérica y pura: devuelve un mapa clave -> elementos.
 */
export function groupBy<TItem, TKey extends string>(
  items: readonly TItem[],
  getKey: (item: TItem) => TKey
): Record<TKey, TItem[]> {
  const groups = {} as Record<TKey, TItem[]>;
  for (const item of items) {
    const key = getKey(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  }
  return groups;
}

/** Agrupa solicitudes por país de operación. */
export function groupByCountry(
  requests: readonly InformationRequest[]
): Record<OperatingCountry, InformationRequest[]> {
  return groupBy(requests, (request) => request.country) as Record<
    OperatingCountry,
    InformationRequest[]
  >;
}

/** Agrupa solicitudes por tipo de producto. */
export function groupByProductType(
  requests: readonly InformationRequest[]
): Record<ProductType, InformationRequest[]> {
  return groupBy(requests, (request) => request.productType) as Record<
    ProductType,
    InformationRequest[]
  >;
}
