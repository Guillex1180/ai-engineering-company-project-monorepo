/**
 * Capa de integración con la API de inventario de TrackFlow.
 *
 * TODAS las llamadas a /inventory se centralizan aquí: ningún componente/página
 * ejecuta fetch() directamente. Añade Authorization: Bearer con el token de
 * sesión y traduce errores 4xx/5xx a mensajes legibles (soporta el formato
 * {detail: ...} de FastAPI). Ante 401 limpia la sesión para forzar re-login.
 */
import { clearSession, getToken } from "./auth";

/* ------------------------------- Tipos ------------------------------- */

export interface InventoryProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  warehouse: string;
  current_stock: number;
}

export type OrderType = "inbound" | "outbound";

export interface InventoryOrder {
  id: string;
  product_id: string;
  product_name: string;
  type: OrderType;
  quantity: number;
  user_uuid: string;
  created_at: string;
}

export interface OrderInput {
  product_id: string;
  quantity: number;
}

/** Error de API con status HTTP y mensaje legible. */
export class InventoryApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "InventoryApiError";
    this.status = status;
  }
}

/* ------------------------------- Cliente ------------------------------- */

function apiBase(): string {
  const url = process.env.NEXT_PUBLIC_INVENTORY_API_URL;
  if (!url) {
    throw new Error(
      "Configuración ausente: define NEXT_PUBLIC_INVENTORY_API_URL en .env.local."
    );
  }
  return url.replace(/\/$/, "");
}

/** Extrae un mensaje legible del cuerpo de error (formato FastAPI). */
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
  return `Error ${response.status} al comunicar con la API de inventario.`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  let response: Response;
  try {
    response = await fetch(`${apiBase()}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers ?? {})
      },
      cache: "no-store"
    });
  } catch {
    throw new InventoryApiError(
      "No fue posible conectar con la API de inventario.",
      0
    );
  }

  if (response.status === 401) {
    // Sesión inválida: se limpia para que el guard redirija al login.
    clearSession();
    throw new InventoryApiError("Tu sesión ha expirado. Inicia sesión de nuevo.", 401);
  }

  if (!response.ok) {
    throw new InventoryApiError(await readErrorMessage(response), response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

/* ------------------------------- Funciones ------------------------------- */

/** GET /inventory/products */
export function getProducts(): Promise<InventoryProduct[]> {
  return request<InventoryProduct[]>("/inventory/products");
}

/** GET /inventory/orders */
export function getOrders(): Promise<InventoryOrder[]> {
  return request<InventoryOrder[]>("/inventory/orders");
}

/** POST /inventory/orders/inbound */
export function createInboundOrder(input: OrderInput): Promise<InventoryOrder> {
  return request<InventoryOrder>("/inventory/orders/inbound", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

/** POST /inventory/orders/outbound */
export function createOutboundOrder(input: OrderInput): Promise<InventoryOrder> {
  return request<InventoryOrder>("/inventory/orders/outbound", {
    method: "POST",
    body: JSON.stringify(input)
  });
}
