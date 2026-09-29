/**
 * Mock Agent — Asistente Virtual TrackFlow (primera versión, sin API externa).
 *
 * Responsabilidad ÚNICA: dado un texto del usuario (y un estado de lead
 * acumulado), decidir una respuesta usando SOLO la información de TrackFlow
 * (knowledge.js) y extraer datos útiles para prellenar el formulario.
 *
 * No conoce el DOM ni la UI. No hace llamadas de red. Implementa la misma
 * forma de interfaz que tendría un cliente de API real:
 *
 *     async respond({ message, lead }) -> { reply, lead, matched }
 *
 * De este modo el Agent Service puede sustituir este Mock por un cliente de
 * Bedrock/OpenAI sin cambiar nada aguas arriba.
 */
import {
  TOPICS,
  FALLBACK_MESSAGE,
  FORM_OPTIONS
} from "./knowledge.js";

/** Normaliza texto: minúsculas y sin acentos, para comparar palabras clave. */
function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Reglas de intención: la primera cuyo patrón coincida gana.
 * El orden importa (de más específico a más general).
 */
const INTENT_RULES = [
  { topic: "coberturaUS", test: (t) => /(estados unidos|ee\.? ?uu|usa|eeuu|los angeles|california)/.test(t) && /(cobertura|carrier|envio|almacen|opera)/.test(t) },
  { topic: "coberturaES", test: (t) => /(espana|zaragoza|peninsular|islas)/.test(t) && /(cobertura|carrier|envio|almacen|opera)/.test(t) },
  { topic: "cobertura", test: (t) => /(cobertura|donde operan|paises|carrier|zona)/.test(t) },
  { topic: "almacenes", test: (t) => /(almacen|picking|packing|inventario|storage|fulfillment)/.test(t) },
  { topic: "ultimaMilla", test: (t) => /(ultima milla|last mile|entrega|reparto|seguimiento|incidencia)/.test(t) },
  { topic: "logisticaInversa", test: (t) => /(logistica inversa|devolucion|reacondicion|retorno|reverse)/.test(t) },
  { topic: "solicitud", test: (t) => /(solicitar|solicitud|formulario|contratar|presupuesto|cotizacion|informacion|contacto comercial|contactar)/.test(t) },
  { topic: "porQue", test: (t) => /(por que|porque|ventaja|diferencia|mejor|confiar)/.test(t) },
  { topic: "servicios", test: (t) => /(servicio|que hacen|que ofrecen|ayuda|soluciones)/.test(t) },
  { topic: "saludo", test: (t) => /^(hola|buenas|buenos dias|buenas tardes|hey|que tal|saludos)/.test(t) }
];

/** Detecta la intención principal del mensaje. Devuelve la clave de TOPICS o null. */
function detectIntent(normalized) {
  for (const rule of INTENT_RULES) {
    if (rule.test(normalized)) return rule.topic;
  }
  return null;
}

/**
 * Extrae datos del lead a partir del mensaje, mapeándolos a valores válidos
 * del formulario. Devuelve un objeto parcial (solo lo detectado).
 */
function extractLeadData(rawMessage, normalized) {
  const found = {};

  // País de operación.
  const mentionsUS = /(estados unidos|ee\.? ?uu|usa|eeuu)/.test(normalized);
  const mentionsES = /(espana|zaragoza)/.test(normalized);
  if (mentionsUS && mentionsES) found.country = "Ambos";
  else if (mentionsUS) found.country = "Estados Unidos";
  else if (mentionsES) found.country = "España";

  // Tipo de producto.
  if (/(moda|ropa|textil|fashion)/.test(normalized)) found.product = "Moda";
  else if (/(electronica|electronic|gadget|tecnolog)/.test(normalized)) found.product = "Electrónica";
  else if (/(cosmetica|cosmetic|belleza|makeup|maquillaje)/.test(normalized)) found.product = "Cosmética";
  else if (/(alimentacion|comida|food|alimento)/.test(normalized)) found.product = "Alimentación";

  // Volumen mensual: buscamos un número de envíos y lo mapeamos a un tramo.
  const volMatch = normalized.match(/(\d[\d.,]*)\s*(envios|paquetes|pedidos|unidades|al mes|mensual)?/);
  if (volMatch && /(envio|paquete|pedido|unidad|mes|volumen)/.test(normalized)) {
    const n = parseInt(volMatch[1].replace(/[.,]/g, ""), 10);
    if (!Number.isNaN(n)) {
      if (n <= 100) found.volume = "0-100";
      else if (n <= 500) found.volume = "101-500";
      else if (n <= 2000) found.volume = "501-2000";
      else found.volume = "2000+";
    }
  }
  // Tramos escritos literalmente.
  for (const tramo of FORM_OPTIONS.volume) {
    if (rawMessage.includes(tramo)) found.volume = tramo;
  }

  // Servicios de interés (múltiple).
  const services = [];
  if (/(almacen|almacenaje|storage|fulfillment)/.test(normalized)) services.push("Almacenaje");
  if (/(ultima milla|last mile|entrega|reparto)/.test(normalized)) services.push("Última milla");
  if (/(logistica inversa|devolucion|reverse|reacondicion)/.test(normalized)) services.push("Logística inversa");
  if (services.length) found.services = services;

  // Nombre de empresa: patrones "mi empresa es X", "empresa se llama X", "somos X".
  const companyMatch =
    rawMessage.match(/(?:mi\s+)?empresa(?:\s+se\s+llama|\s+es)?\s+([A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑñ&.\- ]{1,40})/i) ||
    rawMessage.match(/somos\s+([A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑñ&.\- ]{1,40})/i);
  if (companyMatch) {
    const candidate = companyMatch[1].trim().replace(/[.,;].*$/, "").trim();
    if (candidate.length >= 2) found.company = candidate;
  }

  return found;
}

/**
 * Fusiona datos nuevos del lead sobre los existentes. Los servicios se unen
 * sin duplicar; el resto se sobrescribe con el último valor detectado.
 */
function mergeLead(current, incoming) {
  const merged = { ...current };
  for (const [key, value] of Object.entries(incoming)) {
    if (key === "services") {
      const set = new Set([...(current.services || []), ...value]);
      merged.services = Array.from(set);
    } else {
      merged[key] = value;
    }
  }
  return merged;
}

/**
 * Genera un cierre que invita a seguir capturando datos del lead sin ser
 * intrusivo. Pregunta solo por el siguiente dato que falte.
 */
function nextLeadPrompt(lead) {
  if (!lead.company) return "Por cierto, ¿cuál es el nombre de tu empresa?";
  if (!lead.country) return "¿En qué país opera principalmente tu empresa: Estados Unidos, España o ambos?";
  if (!lead.product) return "¿Qué tipo de productos manejas (moda, electrónica, cosmética, alimentación u otro)?";
  if (!lead.volume) return "¿Cuál es aproximadamente tu volumen mensual de envíos?";
  if (!lead.services) return "¿Qué servicios de TrackFlow te interesan: almacenaje, última milla o logística inversa?";
  return null;
}

/**
 * Punto de entrada del Mock Agent.
 * @param {{message: string, lead: object}} input
 * @returns {Promise<{reply: string, lead: object, matched: boolean}>}
 */
export async function respond({ message, lead = {} }) {
  const raw = (message || "").trim();
  const normalized = normalize(raw);

  // Actualiza el lead con lo que se pueda extraer del mensaje.
  const extracted = extractLeadData(raw, normalized);
  const updatedLead = mergeLead(lead, extracted);

  const intent = detectIntent(normalized);
  let reply;
  let matched = true;

  if (intent && TOPICS[intent]) {
    reply = TOPICS[intent].reply;
  } else if (Object.keys(extracted).length > 0) {
    // No hubo intención temática, pero sí capturamos datos del lead.
    reply = "Anotado, gracias por el dato.";
  } else {
    reply = FALLBACK_MESSAGE;
    matched = false;
  }

  // Si detectamos datos, confirmamos e invitamos a seguir (salvo en fallback).
  if (matched) {
    const prompt = nextLeadPrompt(updatedLead);
    if (Object.keys(extracted).length > 0 && prompt) {
      reply += "\n\n" + prompt;
    } else if (intent === "solicitud" && prompt) {
      reply += "\n\n" + prompt;
    }
  }

  return { reply, lead: updatedLead, matched };
}

// Identificador del backend, útil para depurar y para el Agent Service.
export const AGENT_ID = "mock-agent";
