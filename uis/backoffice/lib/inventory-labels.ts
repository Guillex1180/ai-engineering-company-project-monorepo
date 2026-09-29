/**
 * Etiquetas de presentación y umbrales de stock del inventario de TrackFlow.
 * Separa el vocabulario técnico de la API del texto mostrado al operador.
 */
import type { OrderType } from "./inventory";

export const CATEGORY_LABELS: Record<string, string> = {
  moda: "Moda",
  electronica: "Electrónica",
  cosmetica: "Cosmética",
  alimentacion: "Alimentación"
};

export const WAREHOUSE_LABELS: Record<string, string> = {
  los_angeles: "Los Ángeles",
  zaragoza: "Zaragoza"
};

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  inbound: "Entrada",
  outbound: "Salida"
};

export function labelFor(map: Record<string, string>, key: string): string {
  return map[key] ?? key;
}

/**
 * Umbrales de stock (documentados):
 *   0        -> sin stock
 *   1..10    -> stock bajo
 *   > 10     -> stock saludable
 */
export const LOW_STOCK_THRESHOLD = 10;

export type StockLevel = "out" | "low" | "healthy";

export function stockLevel(currentStock: number): StockLevel {
  if (currentStock <= 0) return "out";
  if (currentStock <= LOW_STOCK_THRESHOLD) return "low";
  return "healthy";
}

export const STOCK_LEVEL_LABELS: Record<StockLevel, string> = {
  out: "Sin stock",
  low: "Stock bajo",
  healthy: "Stock saludable"
};

export const STOCK_LEVEL_BADGE: Record<StockLevel, string> = {
  out: "bg-red-100 text-red-700",
  low: "bg-amber-100 text-amber-800",
  healthy: "bg-green-100 text-green-800"
};

/** Icono textual (no depende solo del color, por accesibilidad). */
export const STOCK_LEVEL_ICON: Record<StockLevel, string> = {
  out: "●",
  low: "▲",
  healthy: "✔"
};

/** Formatea una fecha ISO a texto legible (locale es-ES). No muta el valor. */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
