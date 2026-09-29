/**
 * Datos de ejemplo tipados de TrackFlow.
 *
 * Objetos literales válidos que representan escenarios razonables del negocio,
 * usados para demostrar filtros, ordenamientos, búsquedas, agregaciones y
 * validaciones. No dependen de APIs ni bases de datos externas.
 */
import type {
  CoverageArea,
  InformationRequest,
  LogisticsService
} from "../types/models.js";

/** Catálogo de los tres servicios de TrackFlow (de CONTEXT.es.md). */
export const SERVICES: readonly LogisticsService[] = [
  {
    key: "warehousing",
    name: "Gestión de Almacenes",
    features: [
      "Almacenamiento, picking y packing",
      "Inventario en tiempo real",
      "Operamos almacenes en Los Ángeles y Zaragoza"
    ]
  },
  {
    key: "lastMile",
    name: "Entregas de Última Milla",
    features: [
      "Red de carriers certificados en ambos países",
      "Seguimiento unificado de envíos",
      "Gestión de incidencias y devoluciones"
    ]
  },
  {
    key: "reverseLogistics",
    name: "Logística Inversa",
    features: [
      "Gestión completa de devoluciones",
      "Inspección y reacondicionamiento",
      "Integración con tu plataforma de ventas"
    ]
  }
];

/** Cobertura por país (de CONTEXT.es.md). */
export const COVERAGE: readonly CoverageArea[] = [
  {
    country: "Estados Unidos",
    warehouseCity: "Los Ángeles",
    coverage: "Cobertura nacional",
    carriers: ["UPS", "FedEx", "DHL"]
  },
  {
    country: "España",
    warehouseCity: "Zaragoza",
    coverage: "Cobertura peninsular e islas",
    carriers: ["MRW", "SEUR", "DHL"]
  }
];

/** Solicitudes de información de ejemplo (leads). */
export const SAMPLE_REQUESTS: readonly InformationRequest[] = [
  {
    companyName: "ModaViva",
    contactPerson: "Lucía Fernández",
    email: "lucia@modaviva.com",
    phone: "+34 976 000 111",
    website: "https://modaviva.com",
    country: "España",
    productType: "Moda",
    monthlyVolume: "501-2000",
    services: ["Almacenaje", "Última milla"],
    currentThirdPartyLogistics: "No",
    comments: "Buscamos externalizar toda la operación en España.",
    privacyAccepted: true
  },
  {
    companyName: "GadgetPro",
    contactPerson: "Mark Stevens",
    email: "mark@gadgetpro.com",
    phone: "+1 213 555 0199",
    country: "Estados Unidos",
    productType: "Electrónica",
    monthlyVolume: "2000+",
    services: ["Almacenaje", "Última milla", "Logística inversa"],
    currentThirdPartyLogistics: "Estoy evaluando opciones",
    privacyAccepted: true
  },
  {
    companyName: "BellaSkin",
    contactPerson: "Ana Ruiz",
    email: "ana@bellaskin.es",
    phone: "+34 600 222 333",
    country: "Ambos",
    productType: "Cosmética",
    monthlyVolume: "101-500",
    services: ["Logística inversa"],
    currentThirdPartyLogistics: "Sí",
    comments: "Muchas devoluciones estacionales.",
    privacyAccepted: true
  },
  {
    companyName: "UrbanWear",
    contactPerson: "Diego Marín",
    email: "diego@urbanwear.com",
    phone: "+1 305 555 0142",
    country: "Estados Unidos",
    productType: "Moda",
    monthlyVolume: "0-100",
    services: ["Última milla"],
    currentThirdPartyLogistics: "No",
    privacyAccepted: true
  },
  {
    companyName: "NutriGo",
    contactPerson: "Sofía Blanco",
    email: "sofia@nutrigo.es",
    phone: "+34 976 444 555",
    country: "España",
    productType: "Alimentación",
    monthlyVolume: "501-2000",
    services: ["Almacenaje", "Logística inversa"],
    currentThirdPartyLogistics: "Estoy evaluando opciones",
    privacyAccepted: true
  }
];
