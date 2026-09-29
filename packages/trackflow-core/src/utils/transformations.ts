/**
 * Transformaciones y agregaciones (reportes) sobre solicitudes de TrackFlow.
 *
 * Funciones puras basadas en map/filter/reduce. Manejan colecciones vacías sin
 * lanzar errores (p. ej. el promedio de una colección vacía es 0 y el máximo/
 * mínimo es null).
 */
import type {
  InformationRequest,
  InterestService,
  OperatingCountry,
  ProductType,
  ShippingVolume
} from "../types/models.js";

/**
 * Estimación puntual de envíos/mes por tramo, usada para totales y promedios.
 * Se toma el punto medio del rango. Casos especiales, documentados:
 *   - "2000+": no tiene tope; se estima en 2000 como cota inferior conservadora.
 *   - "No estoy seguro": no es cuantificable; se trata como null (se excluye).
 */
const VOLUME_MIDPOINT: Record<ShippingVolume, number | null> = {
  "0-100": 50,
  "101-500": 300,
  "501-2000": 1250,
  "2000+": 2000,
  "No estoy seguro": null
};

/** Devuelve la estimación de envíos/mes de una solicitud (o null si no aplica). */
export function estimatedShipments(request: InformationRequest): number | null {
  return VOLUME_MIDPOINT[request.monthlyVolume];
}

/* ------------------------------- Conteos ------------------------------- */

/**
 * Cuenta elementos por categoría según una clave derivada.
 * Genérica y pura: devuelve un mapa clave -> conteo.
 */
export function countByCategory<TItem, TKey extends string>(
  items: readonly TItem[],
  getKey: (item: TItem) => TKey
): Record<TKey, number> {
  return items.reduce<Record<TKey, number>>((acc, item) => {
    const key = getKey(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {} as Record<TKey, number>);
}

/** Cantidad de solicitudes por país. */
export function countByCountry(
  requests: readonly InformationRequest[]
): Record<OperatingCountry, number> {
  return countByCategory(requests, (request) => request.country);
}

/** Cantidad de solicitudes por tipo de producto. */
export function countByProductType(
  requests: readonly InformationRequest[]
): Record<ProductType, number> {
  return countByCategory(requests, (request) => request.productType);
}

/**
 * Cantidad de solicitudes que mencionan cada servicio de interés.
 * Una solicitud puede contar en varios servicios (selección múltiple).
 */
export function countByService(
  requests: readonly InformationRequest[]
): Record<InterestService, number> {
  const initial: Record<InterestService, number> = {
    Almacenaje: 0,
    "Última milla": 0,
    "Logística inversa": 0
  };
  return requests.reduce<Record<InterestService, number>>((acc, request) => {
    for (const service of request.services) {
      acc[service] += 1;
    }
    return acc;
  }, initial);
}

/* ------------------------------- Totales / promedios ------------------------------- */

/**
 * Total de envíos mensuales estimados en la colección.
 * Ignora las solicitudes cuyo volumen no es cuantificable ("No estoy seguro").
 */
export function totalEstimatedShipments(
  requests: readonly InformationRequest[]
): number {
  return requests.reduce((sum, request) => {
    const estimate = estimatedShipments(request);
    return estimate === null ? sum : sum + estimate;
  }, 0);
}

/**
 * Promedio de envíos mensuales estimados entre las solicitudes cuantificables.
 * Devuelve 0 si no hay solicitudes cuantificables (evita división por cero).
 */
export function averageEstimatedShipments(
  requests: readonly InformationRequest[]
): number {
  const quantifiable = requests
    .map(estimatedShipments)
    .filter((value): value is number => value !== null);

  if (quantifiable.length === 0) {
    return 0;
  }
  const total = quantifiable.reduce((sum, value) => sum + value, 0);
  return total / quantifiable.length;
}

/* ------------------------------- Máximo / mínimo ------------------------------- */

/**
 * Solicitud con MAYOR volumen estimado. Devuelve null si la colección está
 * vacía o si ninguna solicitud es cuantificable.
 */
export function requestWithHighestVolume(
  requests: readonly InformationRequest[]
): InformationRequest | null {
  return requests.reduce<InformationRequest | null>((best, request) => {
    const estimate = estimatedShipments(request);
    if (estimate === null) return best;
    if (best === null) return request;
    const bestEstimate = estimatedShipments(best) ?? -Infinity;
    return estimate > bestEstimate ? request : best;
  }, null);
}

/**
 * Solicitud con MENOR volumen estimado. Devuelve null si la colección está
 * vacía o si ninguna solicitud es cuantificable.
 */
export function requestWithLowestVolume(
  requests: readonly InformationRequest[]
): InformationRequest | null {
  return requests.reduce<InformationRequest | null>((best, request) => {
    const estimate = estimatedShipments(request);
    if (estimate === null) return best;
    if (best === null) return request;
    const bestEstimate = estimatedShipments(best) ?? Infinity;
    return estimate < bestEstimate ? request : best;
  }, null);
}

/* ------------------------------- Reporte combinado ------------------------------- */

/** Resumen agregado de un conjunto de solicitudes. */
export interface RequestsSummary {
  total: number;
  totalEstimatedShipments: number;
  averageEstimatedShipments: number;
  byCountry: Record<OperatingCountry, number>;
  byProductType: Record<ProductType, number>;
  byService: Record<InterestService, number>;
  highestVolumeCompany: string | null;
  lowestVolumeCompany: string | null;
}

/**
 * Construye un resumen agregado. Reutiliza las funciones anteriores (cada una
 * con responsabilidad única) en lugar de recalcular en un solo bucle.
 */
export function buildRequestsSummary(
  requests: readonly InformationRequest[]
): RequestsSummary {
  const highest = requestWithHighestVolume(requests);
  const lowest = requestWithLowestVolume(requests);
  return {
    total: requests.length,
    totalEstimatedShipments: totalEstimatedShipments(requests),
    averageEstimatedShipments: averageEstimatedShipments(requests),
    byCountry: countByCountry(requests),
    byProductType: countByProductType(requests),
    byService: countByService(requests),
    highestVolumeCompany: highest ? highest.companyName : null,
    lowestVolumeCompany: lowest ? lowest.companyName : null
  };
}
