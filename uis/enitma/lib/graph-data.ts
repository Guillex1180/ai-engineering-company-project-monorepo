import type { GraphNode } from "@/components/IntelligenceGraph";

/**
 * Datos de los ecosistemas de inteligencia (Aviation y Space).
 * Centralizados aquí para que Home, /aviation y /space no dupliquen contenido.
 * Space se describe SIEMPRE como aplicación potencial (regla del CONTEXT).
 */
export const AVIATION_NODES: GraphNode[] = [
  {
    key: "financial",
    label: "Financial Intelligence",
    status: "existing",
    description:
      "IA para fortalecer la gestión financiera en aerolíneas: detección de anomalías, prevención de fraude y optimización de ingresos sobre grandes volúmenes de transacciones.",
    technologies: ["Anomaly Detection", "Machine Learning", "Data Engineering"],
    applications: ["Revenue Accounting", "Reconciliación financiera", "Facturación electrónica"],
    benefits: ["Mayor control y transparencia", "Reducción de riesgo de fraude"]
  },
  {
    key: "operational",
    label: "Operations",
    status: "existing",
    description: "Analítica e IA aplicadas a la eficiencia operativa de la aerolínea.",
    technologies: ["Predictive Analytics", "Decision Intelligence"],
    applications: ["Optimización operativa", "Gestión de IROPs"],
    benefits: ["Decisiones en tiempo real", "Eficiencia operativa"]
  },
  {
    key: "passenger",
    label: "Passengers",
    status: "existing",
    description: "Inteligencia de grafo sobre el comportamiento del viaje del pasajero.",
    technologies: ["Graph Intelligence", "Travel Behavior Graph AI"],
    applications: ["Segmentación", "Experiencia del pasajero"],
    benefits: ["Personalización", "Insights de comportamiento"]
  },
  {
    key: "crew",
    label: "Crew",
    status: "existing",
    description: "Gestión de personal de cabina: asignaciones, itinerarios, comunicación y cumplimiento.",
    technologies: ["Optimization", "Compliance"],
    applications: ["Crew Optimization AI", "Cumplimiento de turnos"],
    benefits: ["Operación organizada", "Alineación con estándares de servicio"]
  },
  {
    key: "airport",
    label: "Airport",
    status: "existing",
    description: "Cumplimiento de seguridad y turnos en aeropuerto.",
    technologies: ["Compliance", "Automation"],
    applications: ["Security Airport & Shift Compliance"],
    benefits: ["Cumplimiento regulatorio"]
  },
  {
    key: "cargo",
    label: "Cargo",
    status: "potential",
    description:
      "Aplicación potencial: analítica y automatización de enITma podrían apoyar operaciones de carga aérea.",
    applications: ["Optimización de carga", "Trazabilidad"]
  },
  {
    key: "predictive",
    label: "Prediction",
    status: "existing",
    description: "Plataforma predictiva para anticipar eventos operativos y de negocio.",
    technologies: ["Predictive Models", "Forecasting"],
    applications: ["Predicción operativa", "Estimación de riesgo"],
    benefits: ["Anticipación", "Optimización de recursos"]
  }
];

export const SPACE_NODES: GraphNode[] = [
  {
    key: "mission",
    label: "Mission",
    status: "potential",
    description:
      "Aplicación potencial: inteligencia predictiva y de decisión de enITma adaptada a la planificación de operaciones de misión.",
    applications: ["Planificación de misión", "Optimización de recursos"]
  },
  {
    key: "satellite",
    label: "Satellite",
    status: "potential",
    description:
      "Aplicación potencial: detección de anomalías de enITma adaptada a telemetría de satélites.",
    applications: ["Anomalías de telemetría", "Salud de la constelación"]
  },
  {
    key: "ground",
    label: "Ground",
    status: "potential",
    description: "Aplicación potencial: analítica para operaciones de estaciones terrenas.",
    applications: ["Programación de contactos", "Detección de incidencias"]
  },
  {
    key: "space-data",
    label: "Data",
    status: "potential",
    description: "Aplicación potencial: ingeniería de datos para grandes volúmenes de datos espaciales.",
    applications: ["Pipelines de datos", "Data platform"]
  },
  {
    key: "space-ai",
    label: "AI",
    status: "potential",
    description:
      "Aplicación potencial: las capacidades de IA de enITma podrían adaptarse a operaciones espaciales.",
    applications: ["Análisis de datos de misión", "Automatización inteligente"]
  },
  {
    key: "space-automation",
    label: "Automation",
    status: "potential",
    description:
      "Aplicación potencial: automatización de procesos de enITma adaptada a flujos operativos espaciales.",
    applications: ["Automatización de flujos", "Orquestación"]
  },
  {
    key: "space-prediction",
    label: "Prediction",
    status: "potential",
    description:
      "Aplicación potencial: modelos predictivos de enITma para anticipar eventos en operaciones espaciales.",
    applications: ["Predicción de eventos", "Planificación anticipada"]
  }
];
