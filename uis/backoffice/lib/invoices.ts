/**
 * Capa de integración con la API de Facturas de TrackFlow — FASE 1.
 *
 * Flujo seguro de subida a S3:
 *   1) El backoffice pide al backend una URL prefirmada (presign). El backend
 *      custodia las credenciales de AWS; el frontend NUNCA las ve.
 *   2) El backoffice sube el PDF directamente a esa URL temporal (PUT) e informa
 *      el progreso.
 *
 * Si el backend no tiene bucket configurado, responde en modo "simulated" y la
 * subida va a un sumidero del propio backend (no persiste). La UI completa el
 * flujo igual, útil para la demo local.
 *
 * No incluye (fases posteriores): Textract, OCR, extracción, IA, historial.
 */
import { clearSession, getToken } from "./auth";

/* --------------------------------- Tipos --------------------------------- */

export type PresignMode = "s3" | "simulated";

export interface PresignResponse {
  mode: PresignMode;
  method: "PUT";
  upload_url: string;
  key: string;
  headers: Record<string, string>;
  expires_in: number;
  max_size: number;
}

export interface PresignInput {
  filename: string;
  content_type: string;
  size: number;
}

/** Resultado final de una subida completada. */
export interface UploadResult {
  key: string;
  mode: PresignMode;
}

/** Error de API con status HTTP y mensaje legible. */
export class InvoicesApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "InvoicesApiError";
    this.status = status;
  }
}

/* -------------------------------- Cliente -------------------------------- */

function apiBase(): string {
  const url = process.env.NEXT_PUBLIC_INVENTORY_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error(
      "Configuración ausente: define NEXT_PUBLIC_INVENTORY_API_URL en .env.local."
    );
  }
  return url.replace(/\/$/, "");
}

/** Convierte una URL de subida (posible relativa del modo simulado) en absoluta. */
function resolveUploadUrl(uploadUrl: string): string {
  if (/^https?:\/\//i.test(uploadUrl)) return uploadUrl;
  return `${apiBase()}${uploadUrl.startsWith("/") ? "" : "/"}${uploadUrl}`;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { detail?: unknown };
    const detail = body.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((item) =>
          item && typeof item === "object" && "msg" in item
            ? String((item as { msg: unknown }).msg)
            : String(item)
        )
        .join("; ");
    }
  } catch {
    // respuesta no-JSON
  }
  return `Error ${response.status} al comunicar con la API de facturas.`;
}

/**
 * POST /invoices/presign — solicita la URL temporal de subida.
 * El backend valida tipo/tamaño; aquí se propaga su mensaje si falla.
 */
export async function requestPresign(input: PresignInput): Promise<PresignResponse> {
  const token = getToken();
  let response: Response;
  try {
    response = await fetch(`${apiBase()}/invoices/presign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(input),
      cache: "no-store"
    });
  } catch {
    throw new InvoicesApiError("No fue posible conectar con la API de facturas.", 0);
  }

  if (response.status === 401) {
    clearSession();
    throw new InvoicesApiError("Tu sesión ha expirado. Inicia sesión de nuevo.", 401);
  }
  if (!response.ok) {
    throw new InvoicesApiError(await readErrorMessage(response), response.status);
  }
  return (await response.json()) as PresignResponse;
}

/**
 * Sube el PDF a la URL prefirmada mediante PUT, informando el progreso.
 * Usa XMLHttpRequest porque fetch() no expone progreso de subida.
 *
 * @param onProgress recibe un porcentaje 0-100 cuando el tamaño es computable.
 */
export function uploadToPresignedUrl(
  presign: PresignResponse,
  file: File,
  onProgress?: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(presign.method, resolveUploadUrl(presign.upload_url), true);

    for (const [name, value] of Object.entries(presign.headers ?? {})) {
      xhr.setRequestHeader(name, value);
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(
          new InvoicesApiError(
            "No se pudo cargar la factura en el almacenamiento.",
            xhr.status
          )
        );
      }
    };
    xhr.onerror = () =>
      reject(new InvoicesApiError("Error de red al subir la factura.", 0));
    xhr.onabort = () =>
      reject(new InvoicesApiError("La subida de la factura se canceló.", 0));

    xhr.send(file);
  });
}

/**
 * Orquesta el flujo completo: presign → upload. Devuelve la key almacenada.
 */
export async function uploadInvoice(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const presign = await requestPresign({
    filename: file.name,
    content_type: file.type || "application/pdf",
    size: file.size
  });
  await uploadToPresignedUrl(presign, file, onProgress);
  return { key: presign.key, mode: presign.mode };
}
