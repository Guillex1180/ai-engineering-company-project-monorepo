/**
 * POST /api/space-ai/chat — endpoint del asistente enITma Space AI.
 *
 * Ejecuta el pipeline completo (seguridad → dominio → RAG → generación →
 * validación) en el servidor. Registra observabilidad mínima sin datos sensibles.
 */
import { NextResponse } from "next/server";
import { runChat } from "@/lib/ai/pipeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const obj = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const message = String(obj.message ?? "");

  // Historial opcional para memoria de conversación (se sanea a turnos válidos).
  const history = Array.isArray(obj.history)
    ? (obj.history as unknown[])
        .filter(
          (t): t is { role: "user" | "assistant"; text: string } =>
            !!t &&
            typeof t === "object" &&
            (("role" in t && ((t as { role: unknown }).role === "user" || (t as { role: unknown }).role === "assistant"))) &&
            "text" in t &&
            typeof (t as { text: unknown }).text === "string"
        )
        .slice(-8)
    : [];

  if (!message.trim()) {
    return NextResponse.json({ error: "El campo 'message' es obligatorio." }, { status: 400 });
  }

  const result = await runChat(message, history);

  // Observabilidad: log estructurado sin contenido sensible.
  console.info(
    JSON.stringify({
      at: new Date().toISOString(),
      requestId: result.meta.requestId,
      provider: result.meta.provider,
      status: result.meta.status,
      retrieved: result.meta.retrievedCount,
      validator: result.meta.validator,
      latencyMs: result.meta.latencyMs
    })
  );

  return NextResponse.json({
    reply: result.reply,
    suggestions: result.suggestions,
    meta: result.meta
  });
}
