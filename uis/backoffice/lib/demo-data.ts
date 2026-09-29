/**
 * Datos de DEMOSTRACIÓN del backoffice de TrackFlow.
 *
 * IMPORTANTE: estos datos son de demostración (no provienen de una API real) y
 * están claramente etiquetados como tales en la UI. Su contenido se deriva
 * únicamente del dominio definido en CONTEXT.md: los tres servicios, la
 * cobertura en Estados Unidos y España, los tipos de producto y los tramos de
 * volumen del formulario de solicitud de información. No se inventan métricas de
 * negocio reales.
 */

export type OperatingCountry = "Estados Unidos" | "España" | "Ambos";
export type ProductType = "Moda" | "Electrónica" | "Cosmética" | "Alimentación";
export type ShippingVolume = "0-100" | "101-500" | "501-2000" | "2000+";
export type InterestService = "Almacenaje" | "Última milla" | "Logística inversa";
export type LeadStatus = "nuevo" | "en_revision" | "calificado" | "descartado";

/** Solicitud de información (lead) capturada por el website. */
export interface DemoLead {
  id: string;
  company: string;
  country: OperatingCountry;
  product: ProductType;
  volume: ShippingVolume;
  services: InterestService[];
  status: LeadStatus;
  receivedAt: string;
}

/** Servicio operativo (derivado de CONTEXT.md). */
export interface ServiceStatus {
  name: string;
  country: OperatingCountry;
  warehouseCity: string;
  operational: boolean;
}

/** Leads de demostración (coherentes con el dominio de CONTEXT.md). */
export const DEMO_LEADS: readonly DemoLead[] = [
  { id: "L-1001", company: "ModaViva", country: "España", product: "Moda", volume: "501-2000", services: ["Almacenaje", "Última milla"], status: "calificado", receivedAt: "2025-09-20" },
  { id: "L-1002", company: "GadgetPro", country: "Estados Unidos", product: "Electrónica", volume: "2000+", services: ["Almacenaje", "Última milla", "Logística inversa"], status: "en_revision", receivedAt: "2025-09-22" },
  { id: "L-1003", company: "BellaSkin", country: "Ambos", product: "Cosmética", volume: "101-500", services: ["Logística inversa"], status: "nuevo", receivedAt: "2025-09-24" },
  { id: "L-1004", company: "UrbanWear", country: "Estados Unidos", product: "Moda", volume: "0-100", services: ["Última milla"], status: "descartado", receivedAt: "2025-09-25" },
  { id: "L-1005", company: "NutriGo", country: "España", product: "Alimentación", volume: "501-2000", services: ["Almacenaje", "Logística inversa"], status: "nuevo", receivedAt: "2025-09-26" },
  { id: "L-1006", company: "TechNova", country: "Estados Unidos", product: "Electrónica", volume: "101-500", services: ["Almacenaje"], status: "calificado", receivedAt: "2025-09-27" },
  { id: "L-1007", company: "PureGlow", country: "España", product: "Cosmética", volume: "0-100", services: ["Última milla"], status: "descartado", receivedAt: "2025-09-27" }
];

/** Estado operativo de los almacenes/servicios (derivado de CONTEXT.md). */
export const DEMO_SERVICES: readonly ServiceStatus[] = [
  { name: "Gestión de Almacenes", country: "Estados Unidos", warehouseCity: "Los Ángeles", operational: true },
  { name: "Entregas de Última Milla", country: "Estados Unidos", warehouseCity: "Los Ángeles", operational: true },
  { name: "Logística Inversa", country: "Estados Unidos", warehouseCity: "Los Ángeles", operational: true },
  { name: "Gestión de Almacenes", country: "España", warehouseCity: "Zaragoza", operational: true },
  { name: "Entregas de Última Milla", country: "España", warehouseCity: "Zaragoza", operational: true },
  { name: "Logística Inversa", country: "España", warehouseCity: "Zaragoza", operational: false }
];

/** Etiquetas legibles para el estado de un lead. */
export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  nuevo: "Nuevo",
  en_revision: "En revisión",
  calificado: "Calificado",
  descartado: "Descartado"
};
