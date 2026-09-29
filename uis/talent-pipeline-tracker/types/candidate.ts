/**
 * Tipos de la Talent Tracker API (https://playground.4geeks.com/tracker/api/v1).
 * Los nombres de campo corresponden EXACTAMENTE a la API real (snake_case).
 * La capa de presentación traduce estos valores al contexto de TrackFlow.
 */

/** Estados válidos de una candidatura (API: status). */
export type CandidateStatus =
  | "received"
  | "in_progress"
  | "selected"
  | "discarded";

/** Etapas válidas del pipeline (API: stage). */
export type CandidateStage =
  | "pending"
  | "review"
  | "personal_interview"
  | "technical_interview"
  | "offer_presented";

/** Nota interna asociada a una candidatura. */
export interface CandidateNote {
  id: string;
  record_id: string;
  content: string;
  created_at: string;
}

/**
 * Candidatura tal como la devuelve la API (RecordOut).
 * En el listado la API incluye además `notes`; en el detalle no.
 */
export interface Candidate {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string | null;
  cv_url: string | null;
  status: CandidateStatus;
  stage: CandidateStage;
  experience_years: number;
  notes_count: number;
  applied_at: string;
  updated_at: string;
  /** Presente en GET /records (listado); ausente en GET /records/:id. */
  notes?: CandidateNote[];
}

/** Payload para crear (POST /records) y reemplazar (PUT /records/:id). */
export interface CreateCandidateInput {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  experience_years: number;
  linkedin_url?: string | null;
  cv_url?: string | null;
}

export type UpdateCandidateInput = CreateCandidateInput;

/** Payload para PATCH /records/:id (status y/o stage). */
export interface PatchCandidateInput {
  status?: CandidateStatus;
  stage?: CandidateStage;
}

/** Payload para crear una nota (POST /records/:id/notes). */
export interface CreateNoteInput {
  content: string;
}

/** Respuesta paginada de GET /records. */
export interface PaginatedRecords {
  total: number;
  page: number;
  limit: number;
  data: Candidate[];
}

/** Respuesta de GET /records/:id/notes. */
export interface NotesResponse {
  data: CandidateNote[];
  meta: { total: number };
}

/** Detalle de un error de validación de la API (FastAPI). */
export interface ApiValidationErrorItem {
  loc: (string | number)[];
  msg: string;
  type: string;
}

/** Parámetros de consulta soportados por GET /records. */
export interface RecordsQuery {
  status?: CandidateStatus;
  stage?: CandidateStage;
  search?: string;
  page?: number;
  limit?: number;
}
