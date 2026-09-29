/**
 * Traducción de los valores técnicos de la API al lenguaje de negocio de
 * TrackFlow People & Talent. Separa modelo/API de presentación/UI.
 */
import type { CandidateStage, CandidateStatus } from "@/types/candidate";

/** Etiqueta visible en español para cada estado. */
export const STATUS_LABELS: Record<CandidateStatus, string> = {
  received: "Recibida",
  in_progress: "En proceso",
  selected: "Seleccionada",
  discarded: "Descartada"
};

/** Etiqueta visible en español para cada etapa del pipeline. */
export const STAGE_LABELS: Record<CandidateStage, string> = {
  pending: "Pendiente",
  review: "Revisión",
  personal_interview: "Entrevista personal",
  technical_interview: "Entrevista técnica",
  offer_presented: "Oferta presentada"
};

/** Estados en orden, para selects y filtros. */
export const STATUS_OPTIONS: CandidateStatus[] = [
  "received",
  "in_progress",
  "selected",
  "discarded"
];

/** Etapas en orden del pipeline, para selects y filtros. */
export const STAGE_OPTIONS: CandidateStage[] = [
  "pending",
  "review",
  "personal_interview",
  "technical_interview",
  "offer_presented"
];

/** Clases Tailwind para el badge de cada estado. */
export const STATUS_BADGE_CLASSES: Record<CandidateStatus, string> = {
  received: "bg-slate-100 text-slate-700",
  in_progress: "bg-amber-100 text-amber-800",
  selected: "bg-green-100 text-green-800",
  discarded: "bg-red-100 text-red-700"
};

/** Clases Tailwind para el badge de cada etapa. */
export const STAGE_BADGE_CLASSES: Record<CandidateStage, string> = {
  pending: "bg-slate-100 text-slate-700",
  review: "bg-blue-100 text-blue-800",
  personal_interview: "bg-indigo-100 text-indigo-800",
  technical_interview: "bg-violet-100 text-violet-800",
  offer_presented: "bg-emerald-100 text-emerald-800"
};

/** Comprueba si un string es un estado válido de la API. */
export function isCandidateStatus(value: string): value is CandidateStatus {
  return (STATUS_OPTIONS as string[]).includes(value);
}

/** Comprueba si un string es una etapa válida de la API. */
export function isCandidateStage(value: string): value is CandidateStage {
  return (STAGE_OPTIONS as string[]).includes(value);
}

/** Formatea una fecha ISO a una cadena legible en español (o "—"). */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
