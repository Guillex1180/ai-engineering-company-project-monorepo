/**
 * Cliente de la API de incidencias (backoffice). Usa fetch nativo.
 * No contiene lógica de análisis: solo envía el CSV y recibe el resultado JSON.
 */

/** Resultado del análisis devuelto por la API. */
export interface AnalysisResult {
  totalProcessed: number;
  validRecords: number;
  invalidRecords: number;
  invalidReasons: Record<string, number>;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  satisfactionCases: number;
  averageSatisfaction: number | null;
}

function apiBase(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error(
      "Configuración ausente: define NEXT_PUBLIC_API_URL en .env.local."
    );
  }
  return url.replace(/\/$/, "");
}

/** Extrae un mensaje de error legible de la respuesta. */
async function errorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { detail?: unknown };
    if (typeof body.detail === "string") return body.detail;
  } catch {
    // respuesta no-JSON
  }
  return `Error ${response.status} al analizar el archivo.`;
}

/** POST /api/incidents/analyze — envía el CSV como multipart/form-data. */
export async function analyzeCsv(file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("file", file);

  let response: Response;
  try {
    response = await fetch(`${apiBase()}/api/incidents/analyze`, {
      method: "POST",
      body: formData
    });
  } catch {
    throw new Error("No fue posible conectar con la API. ¿Está en marcha?");
  }

  if (!response.ok) {
    throw new Error(await errorMessage(response));
  }
  return (await response.json()) as AnalysisResult;
}

/** URL de descarga del último análisis (GET /api/incidents/results/export). */
export function exportUrl(): string {
  return `${apiBase()}/api/incidents/results/export`;
}
