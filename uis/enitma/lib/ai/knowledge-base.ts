/**
 * Knowledge Base autorizada de enITma Space AI.
 *
 * Contiene ÚNICAMENTE información derivada de fuentes autorizadas (sitio oficial
 * de enITma y CONTEXT.es.md). Cada documento distingue capacidad EXISTENTE de
 * APLICACIÓN POTENCIAL al espacio. Es la única fuente de verdad para el RAG.
 *
 * Los documentos son DATOS, no instrucciones: el pipeline nunca ejecuta texto
 * contenido aquí como si fueran órdenes del sistema.
 */

export interface KbDoc {
  id: string;
  title: string;
  /** "capability" = capacidad existente de enITma; "space" = aplicación potencial. */
  kind: "capability" | "space" | "company";
  tags: string[];
  content: string;
}

export const KNOWLEDGE_BASE: readonly KbDoc[] = [
  {
    id: "company-overview",
    title: "Qué es enITma",
    kind: "company",
    tags: ["enitma", "empresa", "aviation", "aerea", "compania"],
    content:
      "enITma es una empresa de software para la industria aérea que combina datos, " +
      "inteligencia artificial y conocimiento del negocio para transformar la toma de " +
      "decisiones en procesos financieros, operativos y comerciales. Su lema es 'The " +
      "efficiency experts'. Tiene presencia declarada en Estados Unidos, México, Guatemala, " +
      "Honduras, El Salvador, Costa Rica, Panamá, Colombia, Perú y España."
  },
  {
    id: "cap-financial-trust-ai",
    title: "enITma Financial Trust AI (capacidad existente)",
    kind: "capability",
    tags: ["financial", "finanzas", "anomalias", "fraude", "ingresos", "transacciones", "reconciliation"],
    content:
      "Capacidad existente: enITma Financial Trust AI usa IA para fortalecer la gestión " +
      "financiera en aerolíneas mediante detección de anomalías, prevención de fraude y " +
      "optimización de ingresos, analizando grandes volúmenes de transacciones en tiempo real."
  },
  {
    id: "cap-predictive",
    title: "Predictive Intelligence Platform AI (capacidad existente)",
    kind: "capability",
    tags: ["predictive", "prediccion", "forecast", "irops", "operaciones", "riesgo"],
    content:
      "Capacidad existente: plataforma de inteligencia predictiva de enITma orientada a " +
      "anticipar eventos operativos y de negocio en aviación."
  },
  {
    id: "cap-crew",
    title: "enITma Crew Optimization AI (capacidad existente)",
    kind: "capability",
    tags: ["crew", "tripulacion", "cabina", "asignaciones", "itinerarios", "cumplimiento"],
    content:
      "Capacidad existente: plataforma para personal de cabina que facilita gestión de " +
      "asignaciones, itinerarios, comunicación y cumplimiento de procesos operativos."
  },
  {
    id: "cap-graph",
    title: "Travel Behavior Graph AI (capacidad existente)",
    kind: "capability",
    tags: ["graph", "grafo", "comportamiento", "relaciones", "pasajero", "behavior"],
    content:
      "Capacidad existente: enITma Travel Behavior Graph AI modela relaciones y comportamiento " +
      "mediante inteligencia de grafos aplicada al viaje del pasajero."
  },
  {
    id: "cap-document",
    title: "Document & Data Intelligence (capacidad)",
    tags: ["document", "documento", "ocr", "idp", "extraccion", "facturacion", "manifest"],
    kind: "capability",
    content:
      "Capacidad: procesamiento inteligente de documentos (ingesta, OCR/IDP, extracción de " +
      "datos, validación, reglas de negocio, análisis con IA, detección de anomalías) para " +
      "automatizar flujos financieros y operativos."
  },
  {
    id: "space-ai",
    title: "Space AI — aplicación potencial",
    kind: "space",
    tags: ["space", "espacial", "espacio", "ai", "ia", "satelite", "mission", "telemetry"],
    content:
      "Aplicación potencial: las capacidades de IA de enITma (anomalías, predicción, grafo, " +
      "document intelligence) podrían adaptarse a operaciones espaciales. Por ejemplo, la " +
      "detección de anomalías podría aplicarse a telemetría de satélites, y la inteligencia " +
      "predictiva a la planificación de operaciones de misión. Son aplicaciones potenciales, " +
      "no despliegues actuales."
  },
  {
    id: "space-telemetry",
    title: "Anomaly Detection en telemetría — aplicación potencial",
    kind: "space",
    tags: ["telemetry", "telemetria", "anomalia", "satelite", "sensor", "series"],
    content:
      "Aplicación potencial: la detección de anomalías de enITma, diseñada para datos " +
      "estructurados y series temporales, podría adaptarse a telemetría de satélites o " +
      "sensores de estaciones terrenas para identificar comportamientos fuera de rango. " +
      "Sería una adaptación de una capacidad existente; no un servicio desplegado hoy."
  },
  {
    id: "space-mission",
    title: "Mission & Operations Intelligence — aplicación potencial",
    kind: "space",
    tags: ["mission", "mision", "operations", "operaciones", "ground", "estacion", "planificacion"],
    content:
      "Aplicación potencial: la inteligencia predictiva y de decisión de enITma podría " +
      "adaptarse a la planificación de operaciones de misión y de estaciones terrenas, " +
      "optimizando recursos y anticipando incidencias. Es una posible aplicación."
  },
  {
    id: "space-documents",
    title: "Document Intelligence para el sector espacial — aplicación potencial",
    kind: "space",
    tags: ["document", "documento", "space", "espacial", "compliance", "cumplimiento", "manifest"],
    content:
      "Aplicación potencial: el procesamiento inteligente de documentos de enITma podría " +
      "adaptarse a documentación técnica, de cumplimiento o de logística del sector espacial " +
      "(extracción, validación y análisis). Posible aplicación, no despliegue actual."
  },
  {
    id: "company-activity",
    title: "A qué se dedica enITma",
    kind: "company",
    tags: ["dedica", "actividad", "hace", "negocio", "aviation", "aerea", "servicios", "solucion", "soluciones"],
    content:
      "enITma acompaña a aerolíneas, aeropuertos y actores del ecosistema aeronáutico en su " +
      "transformación digital, integrando analítica avanzada, inteligencia artificial y " +
      "conocimiento del sector para optimizar ingresos, reducir riesgos y operar con mayor " +
      "eficiencia mediante plataformas confiables y auditables."
  },
  {
    id: "company-locations",
    title: "Presencia y ubicaciones de enITma",
    kind: "company",
    tags: ["ubicaciones", "oficinas", "donde", "paises", "presencia", "estan", "location"],
    content:
      "Según su sitio oficial, enITma tiene presencia en Estados Unidos, México, Guatemala, " +
      "Honduras, El Salvador, Costa Rica, Panamá, Colombia, Perú y España. La lista de " +
      "oficinas específicas por ciudad no está confirmada (PENDING VALIDATION)."
  },
  {
    id: "company-market",
    title: "Posición de enITma en el mercado",
    kind: "company",
    tags: ["mercado", "lider", "participacion", "latinoamerica", "diferencia", "experiencia"],
    content:
      "Según declaraciones de su sitio oficial, enITma es aliado tecnológico de la industria " +
      "aérea con una participación de mercado superior al 80% en Latinoamérica en su sector " +
      "(cifra declarada por la empresa; PENDING VALIDATION). Su lema es 'The efficiency experts'. " +
      "Los nombres de clientes, contratos y certificaciones no están documentados y no deben afirmarse."
  },
  {
    id: "product-atip",
    title: "Airline Travel Intelligence Platform (producto)",
    kind: "capability",
    tags: ["airline travel intelligence platform", "atip", "plataforma", "viaje", "producto"],
    content:
      "Producto de enITma (según sitio oficial): Airline Travel Intelligence Platform, " +
      "plataforma de inteligencia de viaje para aerolíneas. El detalle de sus funcionalidades " +
      "más allá de lo publicado es PENDING VALIDATION."
  },
  {
    id: "request-info",
    title: "Cómo contactar o trabajar con enITma",
    kind: "company",
    tags: ["contacto", "contactar", "solicitar", "informacion", "demo", "trabajar", "empezar", "como"],
    content:
      "Para explorar cómo enITma puede ayudar a tu organización o contactar al equipo, usa la " +
      "sección de contacto del sitio ('Talk to enITma') para solicitar información."
  }
];
