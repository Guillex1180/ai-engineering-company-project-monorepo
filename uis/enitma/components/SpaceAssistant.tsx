"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const WELCOME =
  "Hola, soy enITma Space AI. Respondo exclusivamente sobre las capacidades tecnológicas de " +
  "enITma aplicadas a la Industria Espacial: Space AI, Mission Intelligence, Satellite Operations, " +
  "Space Data, Ground Operations, Predictive Intelligence y Automation. ¿En qué puedo ayudarte?";

const QUICK = [
  "¿Cómo puede enITma aplicar IA a operaciones espaciales?",
  "¿Cómo usar IA para detectar anomalías de telemetría de satélites?",
  "¿Cómo aplicar Document Intelligence al sector espacial?",
  "¿Cómo usar inteligencia predictiva en operaciones de misión?"
];

export default function SpaceAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", text: WELCOME }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(QUICK);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const typingTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement as HTMLElement;
      window.requestAnimationFrame(() => inputRef.current?.focus());
    } else if (lastFocus.current) {
      lastFocus.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, busy, typing]);

  // Limpia el temporizador de "typing" al desmontar.
  useEffect(() => {
    return () => {
      if (typingTimer.current) clearInterval(typingTimer.current);
    };
  }, []);

  /**
   * Muestra la respuesta del asistente con un efecto de escritura progresiva.
   * Respeta prefers-reduced-motion: si el usuario lo pide, imprime de golpe.
   */
  function typeOut(full: string) {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Añade el mensaje del asistente vacío y lo va rellenando.
    setMessages((m) => [...m, { role: "assistant", text: prefersReduced ? full : "" }]);
    if (prefersReduced || !full) return;

    setTyping(true);
    let i = 0;
    const step = Math.max(1, Math.round(full.length / 120)); // ~120 frames como máximo
    if (typingTimer.current) clearInterval(typingTimer.current);
    typingTimer.current = setInterval(() => {
      i += step;
      const slice = full.slice(0, i);
      setMessages((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        if (last && last.role === "assistant") next[next.length - 1] = { role: "assistant", text: slice };
        return next;
      });
      if (i >= full.length) {
        if (typingTimer.current) clearInterval(typingTimer.current);
        typingTimer.current = null;
        setMessages((m) => {
          const next = [...m];
          const last = next[next.length - 1];
          if (last && last.role === "assistant") next[next.length - 1] = { role: "assistant", text: full };
          return next;
        });
        setTyping(false);
        window.requestAnimationFrame(() => inputRef.current?.focus());
      }
    }, 18);
  }

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy || typing) return;
    // Historial de contexto: turnos previos (sin el mensaje de bienvenida vacío).
    const history = messages.map((m) => ({ role: m.role, text: m.text }));
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/space-ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, history })
      });
      const data = (await res.json()) as {
        reply?: string;
        error?: string;
        suggestions?: string[];
      };
      setBusy(false);
      typeOut(data.reply ?? data.error ?? "No fue posible obtener respuesta.");
      if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      }
    } catch {
      setBusy(false);
      typeOut("No fue posible conectar con el asistente. Inténtalo de nuevo.");
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="space-ai-panel"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition-transform hover:scale-105"
      >
        <span aria-hidden="true">🛰️</span> Ask enITma Space AI
      </button>

      {open ? (
        <div
          id="space-ai-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="space-ai-title"
          onKeyDown={onKeyDown}
          className="fixed inset-x-0 bottom-0 z-50 sm:inset-auto sm:bottom-24 sm:right-5"
        >
          <div className="flex h-[80vh] max-h-[620px] w-full flex-col overflow-hidden border border-white/10 bg-space-900 shadow-2xl sm:h-[600px] sm:w-[400px] sm:rounded-2xl">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-white/10 bg-space-800 px-4 py-3">
              <div>
                <h2 id="space-ai-title" className="text-sm font-semibold text-white">enITma Space AI</h2>
                <p className="flex items-center gap-1.5 text-xs text-emerald-300">
                  <span aria-hidden="true" className="pulse-dot" /> AI ONLINE · Intelligence for the Space Industry
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
              >
                <span className="sr-only">Cerrar asistente</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </header>

            {/* Historial */}
            <div
              ref={logRef}
              role="log"
              aria-live="polite"
              aria-label="Conversación con enITma Space AI"
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-2xl rounded-br-sm bg-sky-500 px-4 py-2 text-sm text-white"
                        : "max-w-[85%] whitespace-pre-line rounded-2xl rounded-bl-sm bg-white/10 px-4 py-2 text-sm text-slate-200"
                    }
                  >
                    <span className="sr-only">{m.role === "user" ? "Tú: " : "enITma Space AI: "}</span>
                    {m.text}
                  </div>
                </div>
              ))}
              {busy ? (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-white/10 px-4 py-3 text-sm text-slate-400">
                    <span className="sr-only">enITma Space AI está analizando…</span>
                    <span aria-hidden="true" className="typing-dot" />
                    <span aria-hidden="true" className="typing-dot" style={{ animationDelay: "0.15s" }} />
                    <span aria-hidden="true" className="typing-dot" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              ) : null}
            </div>

            {/* Preguntas de seguimiento (dinámicas según la última respuesta) */}
            <div className="border-t border-white/10 px-4 py-2">
              <p className="mb-1.5 text-[10px] uppercase tracking-wider text-slate-500">
                {messages.length > 1 ? "Puedes seguir con" : "Preguntas rápidas"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    disabled={busy || typing}
                    onClick={() => send(q)}
                    className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-slate-300 hover:border-signal-400 hover:text-signal-400 disabled:opacity-50"
                  >
                    {q.length > 34 ? q.slice(0, 32) + "…" : q}
                  </button>
                ))}
              </div>
            </div>

            {/* Entrada */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="flex items-end gap-2 border-t border-white/10 p-3"
            >
              <label htmlFor="space-ai-input" className="sr-only">Escribe tu pregunta</label>
              <textarea
                id="space-ai-input"
                ref={inputRef}
                rows={1}
                value={input}
                disabled={busy || typing}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
                placeholder="Pregunta sobre enITma + espacio…"
                className="block w-full resize-none rounded-xl border border-white/15 bg-space-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-signal-400 disabled:opacity-60"
              />
              <button type="submit" disabled={busy || typing} className="btn-primary shrink-0 px-4 py-2">Enviar</button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
