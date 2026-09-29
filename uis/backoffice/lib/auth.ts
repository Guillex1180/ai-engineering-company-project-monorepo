/**
 * Autenticación del backoffice (demostración).
 *
 * El token Bearer se guarda en localStorage. Es el único mecanismo de auth del
 * backoffice; las páginas protegidas lo reutilizan mediante el hook useAuth.
 * No se registran ni imprimen tokens.
 */
const TOKEN_KEY = "trackflow.backoffice.token";
const USER_KEY = "trackflow.backoffice.user_uuid";

function inventoryApiBase(): string {
  const url = process.env.NEXT_PUBLIC_INVENTORY_API_URL;
  if (!url) {
    throw new Error(
      "Configuración ausente: define NEXT_PUBLIC_INVENTORY_API_URL en .env.local."
    );
  }
  return url.replace(/\/$/, "");
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getUserUuid(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

/** POST /auth/login. Guarda el token si las credenciales son válidas. */
export async function login(username: string, password: string): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${inventoryApiBase()}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
  } catch {
    throw new Error("No fue posible conectar con la API. ¿Está en marcha?");
  }

  if (!response.ok) {
    let message = "Credenciales inválidas.";
    try {
      const body = (await response.json()) as { detail?: unknown };
      if (typeof body.detail === "string") message = body.detail;
    } catch {
      // respuesta no-JSON
    }
    throw new Error(message);
  }

  const data = (await response.json()) as { token: string; user_uuid: string };
  window.localStorage.setItem(TOKEN_KEY, data.token);
  window.localStorage.setItem(USER_KEY, data.user_uuid);
}
