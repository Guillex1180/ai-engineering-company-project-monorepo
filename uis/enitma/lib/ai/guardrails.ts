/**
 * Guardrails de enITma Space AI: seguridad de entrada (prompt-injection),
 * clasificador de dominio (enITma + Space) y validador de salida.
 *
 * Todo es determinista y local (sin red). El clasificador y el validador
 * podrían sustituirse en el futuro por modelos dedicados (ver AIModelProvider),
 * pero los guardrails NUNCA deben eliminarse aunque falle un proveedor externo.
 */

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/* ------------------------- 1) Seguridad de entrada ------------------------- */

const INJECTION_PATTERNS: RegExp[] = [
  /ignore (all |previous |above )?instructions/,
  /disregard (the |all )?(previous|above|prior)/,
  /reveal (your )?(system )?prompt/,
  /show (me )?(your )?(system )?prompt/,
  /system prompt/,
  /act as (chatgpt|a general|an unrestricted)/,
  /you are (no longer|not) enitma/,
  /disable (all )?(restrictions|guardrails|rules)/,
  /jailbreak/,
  /developer mode/,
  /olvida (todas )?las instrucciones/,
  /ignora (las )?instrucciones/,
  /revela tu (system )?prompt/,
  /desactiva (las )?(restricciones|reglas)/
];

export interface InputCheck {
  safe: boolean;
  sanitized: string;
  reason?: string;
}

/** Detecta intentos de prompt-injection en la entrada del usuario. */
export function checkInput(raw: string): InputCheck {
  const text = (raw || "").trim();
  if (!text) return { safe: false, sanitized: "", reason: "empty" };
  const n = normalize(text);
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(n)) {
      return { safe: false, sanitized: text, reason: "prompt_injection" };
    }
  }
  return { safe: true, sanitized: text };
}

/* ------------------------- 2) Clasificador de dominio ------------------------- */

const ENITMA_TERMS = [
  "enitma", "aviation", "aviacion", "aerea", "aerolinea", "airline", "vuelo", "flight",
  "financial trust", "crew", "tripulacion", "predictive", "graph", "document", "ocr",
  "capacidad", "capability", "plataforma", " ia ", " ai ", "datos", "data", "automation",
  "automatizacion", "anomalia", "anomaly", "prediccion", "prediction"
];

const SPACE_TERMS = [
  "space", "espacial", "espacio", "satelite", "satellite", "mission", "mision",
  "telemetry", "telemetria", "ground station", "estacion terrena", "orbit", "orbita",
  "nasa", "esa", "spacex", "cohete", "rocket", "spacecraft", "nave", "constelacion",
  "launch", "lanzamiento", "payload", "carga util"
];

export type DomainCategory =
  | "ENITMA_GENERAL"
  | "ENITMA_AVIATION"
  | "ENITMA_AI"
  | "ENITMA_FINANCIAL"
  | "ENITMA_OPERATIONS"
  | "ENITMA_SPACE"
  | "ENITMA_TECHNOLOGY"
  | "OUT_OF_DOMAIN";

export interface DomainResult {
  enitma: boolean;
  space: boolean;
  category: DomainCategory;
  allowed: boolean;
  confidence: number;
}

// Términos que, por sí solos, indican que la consulta es sobre enITma (empresa,
// aviación, IA, datos…). No se exige mencionar "enITma" literalmente si el tema
// es claramente una de sus capacidades/dominios.
const GENERAL_ENITMA_HINTS = [
  "enitma", "aviation", "aviacion", "aerea", "aerolinea", "airline", "vuelo", "flight",
  "aeropuerto", "airport", "empresa", "compania", "servicios", "productos", "tecnologia",
  "oficinas", "ubicaciones", "clientes", "certificaciones", "contacto", "solucion", "soluciones"
];

const FINANCIAL_HINTS = ["financial", "financiera", "finanzas", "ingresos", "fraude", "reconciliation", "reconciliacion", "facturacion", "transaccion", "revenue"];
// Nota: los términos muy cortos y ambiguos ("ia", "ai") se comparan como palabra
// completa (rodeada de espacios) para evitar falsos positivos como "mundial".
const AI_HINTS = [" ia ", " ai ", "inteligencia artificial", "machine learning", "generative", "prediccion", "predictive", "anomalia", "anomaly", "grafo", "graph", "automation", "automatizacion", "document", "ocr", " idp ", "data", "datos"];
const OPS_HINTS = ["operacion", "operational", "crew", "tripulacion", "cumplimiento", "compliance", "turnos", "irops"];

function countHits(n: string, terms: string[]): number {
  return terms.filter((t) => n.includes(t)).length;
}

/**
 * Clasifica la consulta. REGLA (nueva): cualquier consulta directamente
 * relacionada con enITma es IN DOMAIN. El espacio es una especialización, no un
 * requisito. Se permite además Space cuando hay relación con enITma/tecnología.
 * Salida estructurada (misma forma que tendría un modelo clasificador real).
 */
export function classifyDomain(text: string): DomainResult {
  const n = " " + normalize(text) + " ";

  const spaceHits = countHits(n, SPACE_TERMS);
  const enitmaHits = countHits(n, ENITMA_TERMS);
  const generalHits = countHits(n, GENERAL_ENITMA_HINTS);
  const financialHits = countHits(n, FINANCIAL_HINTS);
  const aiHits = countHits(n, AI_HINTS);
  const opsHits = countHits(n, OPS_HINTS);

  const space = spaceHits > 0;
  // enITma se considera dominio si menciona la empresa, aviación, o una de sus
  // capacidades tecnológicas (IA/datos/finanzas/operaciones). El espacio también
  // cuenta como dominio de enITma (especialización) SIEMPRE que haya alguna señal
  // enITma/tecnología; el espacio "puro" sin relación tecnológica no basta.
  const techSignal = generalHits + enitmaHits + financialHits + aiHits + opsHits > 0;
  const enitma = techSignal;

  const allowed = enitma || (space && techSignal);

  let category: DomainCategory;
  if (!allowed) category = "OUT_OF_DOMAIN";
  else if (space) category = "ENITMA_SPACE";
  else if (financialHits > 0) category = "ENITMA_FINANCIAL";
  else if (opsHits > 0) category = "ENITMA_OPERATIONS";
  else if (aiHits > 0) category = "ENITMA_AI";
  else if (n.includes("aviation") || n.includes("aviacion") || n.includes("aerea") || n.includes("aerolinea") || n.includes("airline") || n.includes("vuelo") || n.includes("aeropuerto"))
    category = "ENITMA_AVIATION";
  else if (n.includes("tecnolog") || n.includes("producto") || n.includes("plataforma"))
    category = "ENITMA_TECHNOLOGY";
  else category = "ENITMA_GENERAL";

  const total = spaceHits + enitmaHits + generalHits + financialHits + aiHits + opsHits;
  const confidence = allowed
    ? Math.min(0.99, 0.6 + total * 0.07)
    : Math.max(0.5, 0.85 - total * 0.05);

  return { enitma, space, category, allowed, confidence: Number(confidence.toFixed(2)) };
}

export const OUT_OF_DOMAIN_MESSAGE =
  "Soy enITma AI, el asistente especializado en enITma. Puedo ayudarte con información " +
  "sobre la empresa, sus soluciones de aviación, inteligencia artificial, tecnología, " +
  "automatización, datos y aplicaciones para la Industria Espacial.";

/* ------------------------- 3) Validador de salida ------------------------- */

export type ValidationVerdict = "PASS" | "REWRITE" | "BLOCK";

export interface ValidationResult {
  verdict: ValidationVerdict;
  reason?: string;
}

// Afirmaciones prohibidas: convertir una posibilidad espacial en un hecho actual.
// Nota: se detectan afirmaciones POSITIVAS. Las negaciones defensivas del propio
// asistente ("no es un despliegue/misión actual") NO deben dispararlas.
const HALLUCINATION_PATTERNS: RegExp[] = [
  // enITma + verbo de acción/posesión + (agencia | misión/satélite/cliente espacial),
  // salvo cuando va precedido de una negación ("no ...").
  /enitma\s+(?:trabaja|colabora|opera|tiene|cuenta con|desplego|firmo|mantiene)\b[^.]*\b(nasa|esa|spacex|mision|misiones|satelite|satelites|clientes espaciales)\b/
];

/** Devuelve true si el fragmento va negado ("no ..."). */
function isNegated(text: string, index: number): boolean {
  const before = text.slice(Math.max(0, index - 40), index);
  return /\bno\b[^.]*$/.test(before);
}

/**
 * Valida la respuesta generada: debe hablar de enITma+Space y no afirmar como
 * hechos alianzas/misiones/clientes espaciales inexistentes.
 */
export function validateOutput(answer: string): ValidationResult {
  const n = normalize(answer);
  for (const pattern of HALLUCINATION_PATTERNS) {
    const match = pattern.exec(n);
    if (match && !isNegated(n, match.index)) {
      return { verdict: "BLOCK", reason: "unverified_space_claim" };
    }
  }
  // Debe mencionar el marco enITma/espacio o el aviso de datos insuficientes.
  const mentionsFrame =
    n.includes("enitma") || n.includes("espac") || n.includes("space") || n.includes("no contiene informacion");
  if (!mentionsFrame) {
    return { verdict: "REWRITE", reason: "off_frame" };
  }
  return { verdict: "PASS" };
}
