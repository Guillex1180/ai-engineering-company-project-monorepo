/**
 * Capa de acceso a la Talent Tracker API.
 *
 * Centraliza todas las llamadas HTTP con fetch + async/await. Cada función
 * comprueba response.ok y lanza un ApiError descriptivo ante fallos, para que
 * la UI pueda mostrar loading / success / error sin fallos silenciosos.
 */
import type {
  Candidate,
  CandidateNote,
  CreateCandidateInput,
  CreateNoteInput,
  NotesResponse,
  PaginatedRecords,
  PatchCandidateInput,
  RecordsQuery,
  UpdateCandidateInput,
  ApiValidationErrorItem
} from "@/types/candidate";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** Error de API con mensaje legible y, si existe, el status HTTP. */
export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Devuelve la base de la API o lanza un error de configuración claro. */
function baseUrl(): string {
  if (!API_URL) {
    throw new ApiError(
      "Configuración ausente: define NEXT_PUBLIC_API_URL en tu .env.local."
    );
  }
  return API_URL.replace(/\/$/, "");
}

/** Intenta extraer un mensaje de error legible del cuerpo de la respuesta. */
async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as unknown;
    if (body && typeof body === "object" && "detail" in body) {
      const detail = (body as { detail: unknown }).detail;
      if (typeof detail === "string") return detail;
      if (Array.isArray(detail)) {
        return (detail as ApiValidationErrorItem[])
          .map((item) => `${item.loc.join(".")}: ${item.msg}`)
          .join("; ");
      }
    }
  } catch {
    // Cuerpo no-JSON o vacío: se usa el mensaje genérico de abajo.
  }
  return `Error ${response.status} al comunicar con la API.`;
}

/** Realiza una petición y devuelve el JSON tipado, o lanza ApiError. */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl()}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      },
      cache: "no-store"
    });
  } catch {
    throw new ApiError(
      "No fue posible conectar con la API. Revisa tu conexión e inténtalo de nuevo."
    );
  }

  if (!response.ok) {
    throw new ApiError(await extractErrorMessage(response), response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

/** Construye la query string a partir de los filtros soportados. */
function buildRecordsQuery(query: RecordsQuery): string {
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  if (query.stage) params.set("stage", query.stage);
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/* ------------------------------- Records ------------------------------- */

/** GET /records — listado paginado con filtros opcionales. */
export async function getRecords(
  query: RecordsQuery = {}
): Promise<PaginatedRecords> {
  return request<PaginatedRecords>(`/records${buildRecordsQuery(query)}`);
}

/** GET /records/:id — detalle de una candidatura. */
export async function getRecordById(id: string): Promise<Candidate> {
  return request<Candidate>(`/records/${encodeURIComponent(id)}`);
}

/** POST /records — crea una candidatura. */
export async function createRecord(
  input: CreateCandidateInput
): Promise<Candidate> {
  return request<Candidate>("/records", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

/** PUT /records/:id — reemplaza (edita) una candidatura. */
export async function replaceRecord(
  id: string,
  input: UpdateCandidateInput
): Promise<Candidate> {
  return request<Candidate>(`/records/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(input)
  });
}

/** PATCH /records/:id — actualiza estado y/o etapa. */
export async function patchRecord(
  id: string,
  input: PatchCandidateInput
): Promise<Candidate> {
  return request<Candidate>(`/records/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

/* -------------------------------- Notes -------------------------------- */

/** GET /records/:id/notes — notas internas de una candidatura. */
export async function getNotes(recordId: string): Promise<CandidateNote[]> {
  const response = await request<NotesResponse>(
    `/records/${encodeURIComponent(recordId)}/notes`
  );
  return response.data;
}

/** POST /records/:id/notes — añade una nota interna. */
export async function addNote(
  recordId: string,
  input: CreateNoteInput
): Promise<CandidateNote> {
  return request<CandidateNote>(
    `/records/${encodeURIComponent(recordId)}/notes`,
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

/** DELETE /records/:id/notes/:note_id — elimina una nota. */
export async function deleteNote(
  recordId: string,
  noteId: string
): Promise<void> {
  await request<void>(
    `/records/${encodeURIComponent(recordId)}/notes/${encodeURIComponent(noteId)}`,
    { method: "DELETE" }
  );
}
