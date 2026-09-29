/**
 * RAG local determinista.
 *
 * Versión del MVP sin dependencias externas: "embedding" léxico (bag-of-words
 * normalizado) + similitud por solapamiento/coseno sobre la Knowledge Base
 * autorizada. Devuelve los top-K documentos más relevantes.
 *
 * 🔵 PLANNED: sustituir por embeddings vectoriales reales (Titan/OpenAI) + vector
 * DB (OpenSearch/pgvector) + reranker, manteniendo esta misma interfaz `retrieve`.
 */
import { KNOWLEDGE_BASE, type KbDoc } from "./knowledge-base";

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

/** Similitud tipo coseno sobre vectores de frecuencia de términos. */
function similarity(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const freq = (arr: string[]) => {
    const m = new Map<string, number>();
    for (const w of arr) m.set(w, (m.get(w) ?? 0) + 1);
    return m;
  };
  const fa = freq(a);
  const fb = freq(b);
  let dot = 0;
  for (const [w, va] of fa) {
    const vb = fb.get(w);
    if (vb) dot += va * vb;
  }
  const mag = (m: Map<string, number>) =>
    Math.sqrt([...m.values()].reduce((s, v) => s + v * v, 0));
  const denom = mag(fa) * mag(fb);
  return denom === 0 ? 0 : dot / denom;
}

export interface RetrievedDoc {
  doc: KbDoc;
  score: number;
}

/**
 * Recupera los top-K documentos de la KB para una consulta. Combina similitud
 * léxica con un pequeño refuerzo por coincidencia de tags.
 */
export function retrieve(query: string, topK = 4): RetrievedDoc[] {
  const q = tokens(query);
  const qset = new Set(q);

  const qphrase = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const scored = KNOWLEDGE_BASE.map((doc) => {
    const titleTokens = tokens(doc.title);
    const base = similarity(q, tokens(doc.title + " " + doc.content));
    // Coincidencia de términos de la query con los tokens del título (más peso).
    const titleBoost = titleTokens.reduce((s, t) => (qset.has(t) ? s + 0.25 : s), 0);
    // Coincidencia de tags: exacta por token, y fuerte si el tag (frase, ≥5 chars)
    // aparece literalmente en la consulta (p. ej. "financial trust", "telemetria").
    const tagBoost = doc.tags.reduce((s, t) => {
      if (t.length > 4 && qphrase.includes(t)) return s + 0.6;
      if (qset.has(t)) return s + 0.15;
      return s;
    }, 0);
    return { doc, score: base + titleBoost + tagBoost };
  })
    .filter((r) => r.score > 0.05)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored;
}
