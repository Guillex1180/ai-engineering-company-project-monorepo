/**
 * Lógica de negocio del backoffice (funciones puras) sobre los datos de
 * demostración. Produce conteos, agrupaciones y cálculos derivados que la UI
 * muestra en pantalla.
 */
import type {
  DemoLead,
  InterestService,
  LeadStatus,
  ProductType,
  ServiceStatus
} from "./demo-data";

/** Cuenta elementos por una clave derivada. */
export function countBy<T, K extends string>(
  items: readonly T[],
  getKey: (item: T) => K
): Record<K, number> {
  return items.reduce<Record<K, number>>((acc, item) => {
    const key = getKey(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {} as Record<K, number>);
}

/** Total de leads. */
export function totalLeads(leads: readonly DemoLead[]): number {
  return leads.length;
}

/** Leads por estado. */
export function leadsByStatus(leads: readonly DemoLead[]): Record<LeadStatus, number> {
  return countBy(leads, (lead) => lead.status);
}

/** Leads por tipo de producto. */
export function leadsByProduct(leads: readonly DemoLead[]): Record<ProductType, number> {
  return countBy(leads, (lead) => lead.product);
}

/** Interés por servicio (un lead puede sumar en varios). */
export function interestByService(
  leads: readonly DemoLead[]
): Record<InterestService, number> {
  const initial: Record<InterestService, number> = {
    Almacenaje: 0,
    "Última milla": 0,
    "Logística inversa": 0
  };
  return leads.reduce<Record<InterestService, number>>((acc, lead) => {
    for (const service of lead.services) acc[service] += 1;
    return acc;
  }, initial);
}

/** Tasa de calificación: % de leads en estado "calificado". */
export function qualificationRate(leads: readonly DemoLead[]): number {
  if (leads.length === 0) return 0;
  const qualified = leads.filter((lead) => lead.status === "calificado").length;
  return Math.round((qualified / leads.length) * 100);
}

/** Filtra leads por estado; "todos" devuelve la colección completa. */
export function filterLeadsByStatus(
  leads: readonly DemoLead[],
  status: LeadStatus | "todos"
): DemoLead[] {
  if (status === "todos") return [...leads];
  return leads.filter((lead) => lead.status === status);
}

/** Servicios operativos activos frente al total. */
export function operationalSummary(services: readonly ServiceStatus[]): {
  active: number;
  total: number;
} {
  return {
    active: services.filter((service) => service.operational).length,
    total: services.length
  };
}
