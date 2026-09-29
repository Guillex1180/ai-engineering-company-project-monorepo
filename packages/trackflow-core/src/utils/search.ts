/**
 * Algoritmos de búsqueda para colecciones de TrackFlow.
 *
 * Incluye búsqueda lineal (sobre colecciones desordenadas) y búsqueda binaria
 * implementada manualmente (sobre colecciones previamente ordenadas).
 * Funciones puras: no mutan los argumentos ni acceden a estado global.
 */
import type { InformationRequest } from "../types/models.js";

/** Resultado tipado de una búsqueda: índice y elemento, o ausencia clara. */
export interface SearchResult<TItem> {
  /** true si se encontró el elemento. */
  found: boolean;
  /** Índice del elemento (-1 si no se encontró). */
  index: number;
  /** El elemento encontrado, o null. */
  item: TItem | null;
}

/**
 * Búsqueda lineal genérica sobre una colección DESORDENADA.
 *
 * Recorre la colección de principio a fin y devuelve el primer elemento que
 * satisface el predicado. Maneja arrays vacíos (devuelve no encontrado) y
 * elementos inexistentes (índice -1).
 *
 * @param items Colección a recorrer (puede estar desordenada o vacía).
 * @param predicate Criterio de coincidencia.
 */
export function linearSearch<TItem>(
  items: readonly TItem[],
  predicate: (item: TItem) => boolean
): SearchResult<TItem> {
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    if (predicate(item)) {
      return { found: true, index, item };
    }
  }
  return { found: false, index: -1, item: null };
}

/** Atajo de búsqueda lineal: primera solicitud de una empresa por nombre exacto. */
export function findRequestByCompanyName(
  requests: readonly InformationRequest[],
  companyName: string
): SearchResult<InformationRequest> {
  return linearSearch(requests, (request) => request.companyName === companyName);
}

/**
 * Búsqueda binaria manual sobre una colección ORDENADA ASCENDENTEMENTE según
 * el comparador `compare` proporcionado.
 *
 * REQUISITO DE ORDEN: la colección debe estar ordenada de menor a mayor de
 * acuerdo con el mismo comparador que se pasa aquí. Si no lo está, el resultado
 * no está definido. `compare(a, b)` debe devolver:
 *   - un número negativo si a < b,
 *   - 0 si a == b,
 *   - un número positivo si a > b.
 *
 * No usa Array.find / indexOf: calcula el punto medio y reduce el rango a la
 * mitad en cada iteración. Maneja arrays vacíos y elementos inexistentes.
 *
 * @returns índice del elemento que compara igual al objetivo, o -1 si no existe.
 */
export function binarySearch<TItem>(
  sortedItems: readonly TItem[],
  target: TItem,
  compare: (a: TItem, b: TItem) => number
): number {
  let low = 0;
  let high = sortedItems.length - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    const comparison = compare(sortedItems[mid], target);

    if (comparison === 0) {
      return mid;
    }
    if (comparison < 0) {
      // El elemento medio es menor que el objetivo: busca en la mitad derecha.
      low = mid + 1;
    } else {
      // El elemento medio es mayor que el objetivo: busca en la mitad izquierda.
      high = mid - 1;
    }
  }

  return -1;
}

/**
 * Búsqueda binaria por nombre de empresa.
 *
 * ESPERA que `sortedRequests` esté ordenado ASCENDENTEMENTE por `companyName`
 * usando localeCompare (es, sensitivity base) — el mismo criterio que
 * `sortByCompanyName(requests, "asc")`.
 *
 * @returns índice de la solicitud, o -1 si no existe.
 */
export function binarySearchByCompanyName(
  sortedRequests: readonly InformationRequest[],
  companyName: string
): number {
  return binarySearch(
    sortedRequests,
    { companyName } as InformationRequest,
    (a, b) => a.companyName.localeCompare(b.companyName, "es", { sensitivity: "base" })
  );
}
