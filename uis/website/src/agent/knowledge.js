/**
 * Base de conocimiento del Asistente Virtual TrackFlow.
 *
 * Contiene EXCLUSIVAMENTE información de TrackFlow tomada de CONTEXT.es.md.
 * Es solo datos: no hay lógica de UI ni de conversación aquí.
 * Al conectar una API real en el futuro, este archivo puede seguir usándose
 * como contexto/documentos para el modelo, o descartarse sin tocar la UI.
 */

export const COMPANY = Object.freeze({
  name: "TrackFlow",
  foundedYear: 2009,
  foundedCity: "Los Ángeles",
  employees: "+130",
  markets: ["Estados Unidos (Los Ángeles)", "España (Zaragoza)"],
  salesEmail: "comercial@trackflow.com",
  phoneUS: "+1 213 555 0147",
  phoneES: "+34 976 123 456"
});

/**
 * Respuestas por tema. Cada entrada corresponde a una intención que el
 * Mock Agent sabe reconocer (ver mock-agent.js).
 */
export const TOPICS = Object.freeze({
  almacenes: {
    title: "Gestión de Almacenes",
    reply:
      "Gestionamos tu almacén de principio a fin: almacenamiento, picking y packing, " +
      "con inventario en tiempo real. Operamos almacenes propios en Los Ángeles y Zaragoza, " +
      "así que tu stock queda cubierto en Estados Unidos y España."
  },
  ultimaMilla: {
    title: "Entregas de Última Milla",
    reply:
      "Cubrimos el último tramo hasta tu cliente final con una red de carriers certificados " +
      "en ambos países, seguimiento unificado de envíos y gestión de incidencias y devoluciones. " +
      "En EE. UU. trabajamos con UPS, FedEx y DHL; en España con MRW, SEUR y DHL."
  },
  logisticaInversa: {
    title: "Logística Inversa",
    reply:
      "Nos encargamos de la gestión completa de devoluciones: inspección y reacondicionamiento " +
      "de productos, con integración directa con tu plataforma de ventas para que el proceso sea fluido."
  },
  cobertura: {
    title: "Cobertura",
    reply:
      "Operamos en dos mercados con infraestructura propia:\n" +
      "• Estados Unidos: almacén en Los Ángeles, cobertura nacional y carriers UPS, FedEx y DHL.\n" +
      "• España: almacén en Zaragoza, cobertura peninsular e islas y carriers MRW, SEUR y DHL."
  },
  coberturaUS: {
    title: "Cobertura en Estados Unidos",
    reply:
      "En Estados Unidos tenemos almacén en Los Ángeles, cobertura nacional y trabajamos " +
      "con los carriers UPS, FedEx y DHL."
  },
  coberturaES: {
    title: "Cobertura en España",
    reply:
      "En España tenemos almacén en Zaragoza, cobertura peninsular e islas y trabajamos " +
      "con los carriers MRW, SEUR y DHL."
  },
  servicios: {
    title: "Servicios",
    reply:
      "Ofrecemos tres servicios integrados:\n" +
      "1. Gestión de almacenes (almacenamiento, picking, packing e inventario en tiempo real).\n" +
      "2. Entregas de última milla (carriers certificados, seguimiento e incidencias).\n" +
      "3. Logística inversa (devoluciones, inspección y reacondicionamiento).\n" +
      "¿Sobre cuál quieres que profundice?"
  },
  solicitud: {
    title: "Solicitar información",
    reply:
      "Puedes solicitar información desde el formulario comercial de esta misma página. " +
      "Si me cuentas el nombre de tu empresa, país de operación, tipo de producto, volumen mensual " +
      "de envíos y qué servicios te interesan, preparo esos datos para que el formulario te quede " +
      "casi listo. Tú siempre revisas y pulsas Enviar."
  },
  porQue: {
    title: "Por qué TrackFlow",
    reply:
      "Somos el único operador con infraestructura propia en Estados Unidos y España, con más de " +
      "130 profesionales dedicados a tu logística, tecnología propia para visibilidad total de tu " +
      "inventario y especialización en e-commerce de moda, electrónica y cosmética."
  },
  saludo: {
    title: "Saludo",
    reply:
      "¡Hola! Puedo contarte sobre nuestros servicios de almacenes, última milla y logística inversa, " +
      "nuestra cobertura en Estados Unidos y España, o ayudarte a preparar la solicitud de información. " +
      "¿Qué te interesa?"
  }
});

/**
 * Mensaje de bienvenida inicial (literal de CONTEXT.es.md).
 */
export const WELCOME_MESSAGE =
  "¡Hola! Soy el asistente virtual de TrackFlow. Puedo ayudarte a conocer nuestros servicios " +
  "y orientarte según las necesidades logísticas de tu empresa. ¿En qué puedo ayudarte?";

/**
 * Mensaje de fallback (literal de CONTEXT.es.md) para consultas fuera de alcance.
 */
export const FALLBACK_MESSAGE =
  "Todavía no tengo información suficiente para responder esa consulta. Puedo ayudarte con nuestros " +
  "servicios de almacenes, última milla, logística inversa, cobertura o con el proceso para solicitar " +
  "información.";

/**
 * Valores permitidos para el formulario, usados para mapear lo que el usuario
 * dice en la conversación a las opciones válidas del formulario.
 */
export const FORM_OPTIONS = Object.freeze({
  country: ["Estados Unidos", "España", "Ambos", "Otro"],
  product: ["Moda", "Electrónica", "Cosmética", "Alimentación", "Otro"],
  volume: ["0-100", "101-500", "501-2000", "2000+", "No estoy seguro"],
  services: ["Almacenaje", "Última milla", "Logística inversa"]
});
