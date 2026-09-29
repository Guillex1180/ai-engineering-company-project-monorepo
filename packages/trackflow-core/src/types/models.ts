/**
 * Modelos de dominio de TrackFlow.
 *
 * Las entidades y campos se derivan directamente de CONTEXT.es.md:
 *  - Los tres servicios logísticos (almacenes, última milla, logística inversa).
 *  - Los campos del formulario de solicitud de información.
 *  - La cobertura por país (Estados Unidos / España).
 *
 * No se inventan campos que contradigan el contexto. Donde el contexto no da un
 * nombre canónico (p. ej. la entidad "solicitud"), se usa un nombre descriptivo
 * coherente con el dominio y se documenta en el README del paquete.
 */

/* ----------------------------- Uniones de dominio ----------------------------- */

/** Países de operación ofrecidos en el formulario (campo "País de operación principal"). */
export type OperatingCountry = "Estados Unidos" | "España" | "Ambos" | "Otro";

/** Tipos de producto ofrecidos en el formulario (campo "Tipo de producto"). */
export type ProductType =
  | "Moda"
  | "Electrónica"
  | "Cosmética"
  | "Alimentación"
  | "Otro";

/** Tramos de volumen mensual de envíos (campo "Volumen mensual estimado de envíos"). */
export type ShippingVolume =
  | "0-100"
  | "101-500"
  | "501-2000"
  | "2000+"
  | "No estoy seguro";

/** Servicios de interés seleccionables en el formulario (campo "Servicios de interés"). */
export type InterestService = "Almacenaje" | "Última milla" | "Logística inversa";

/** Respuesta a "¿Actualmente trabajas con otro 3PL?". */
export type ThirdPartyLogisticsStatus = "Sí" | "No" | "Estoy evaluando opciones";

/** Los tres servicios que ofrece TrackFlow según CONTEXT.es.md. */
export type ServiceKey = "warehousing" | "lastMile" | "reverseLogistics";

/* ----------------------------- Entidades ----------------------------- */

/**
 * Solicitud de información enviada por una empresa interesada.
 * Refleja 1:1 los campos del formulario de CONTEXT.es.md.
 */
export interface InformationRequest {
  /** Nombre de la empresa (obligatorio, mínimo 2 caracteres). */
  companyName: string;
  /** Persona de contacto (obligatorio, nombre y apellido). */
  contactPerson: string;
  /** Email corporativo (obligatorio). */
  email: string;
  /** Teléfono con código de país (obligatorio, formato "+..."). */
  phone: string;
  /** Sitio web de la empresa (opcional; si existe, debe ser URL válida). */
  website?: string;
  /** País de operación principal (obligatorio). */
  country: OperatingCountry;
  /** Tipo de producto (obligatorio). */
  productType: ProductType;
  /** Volumen mensual estimado de envíos (obligatorio). */
  monthlyVolume: ShippingVolume;
  /** Servicios de interés (obligatorio, al menos uno). */
  services: InterestService[];
  /** ¿Trabaja actualmente con otro 3PL? (obligatorio). */
  currentThirdPartyLogistics: ThirdPartyLogisticsStatus;
  /** Comentarios o necesidades específicas (opcional, máx. 500 caracteres). */
  comments?: string;
  /** Aceptación de la política de privacidad (obligatorio: debe ser true). */
  privacyAccepted: boolean;
}

/**
 * Servicio logístico que ofrece TrackFlow.
 * Derivado de la sección "Servicios" de CONTEXT.es.md.
 */
export interface LogisticsService {
  key: ServiceKey;
  name: string;
  /** Puntos descriptivos del servicio. */
  features: string[];
}

/**
 * Cobertura de TrackFlow en un país.
 * Derivado de la sección "Cobertura" de CONTEXT.es.md.
 */
export interface CoverageArea {
  country: "Estados Unidos" | "España";
  /** Ciudad donde TrackFlow tiene almacén (Los Ángeles / Zaragoza). */
  warehouseCity: string;
  /** Descripción de la cobertura (p. ej. "Cobertura nacional"). */
  coverage: string;
  /** Carriers disponibles en ese país. */
  carriers: string[];
}

/**
 * Estimación numérica de envíos mensuales asociada a un tramo de volumen.
 * Útil para agregaciones (totales/promedios) cuando el dato es un rango.
 * El punto medio se usa como estimación; "2000+" y "No estoy seguro" se
 * documentan como casos especiales en transformations.ts.
 */
export interface VolumeEstimate {
  volume: ShippingVolume;
  /** Estimación puntual de envíos/mes; null cuando no es cuantificable. */
  estimatedShipments: number | null;
}
