"use client";

import { useState } from "react";

/**
 * Formulario para añadir una nota interna. Valida que el contenido no esté
 * vacío antes de enviar y muestra el estado de envío. La llamada a la API la
 * realiza el componente padre (NotesSection) a través de onSubmit.
 */
export default function NoteForm({
  onSubmit
}: {
  onSubmit: (content: string) => Promise<boolean>;
}) {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (content.trim().length === 0) {
      setError("La nota no puede estar vacía.");
      return;
    }
    setError("");
    setSubmitting(true);
    const ok = await onSubmit(content.trim());
    setSubmitting(false);
    if (ok) {
      setContent("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label htmlFor="note-content" className="field-label">
        Añadir nota interna
      </label>
      <textarea
        id="note-content"
        className="field-input"
        rows={3}
        value={content}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? "note-error" : undefined}
        placeholder="Escribe una observación para el equipo…"
        onChange={(event) => {
          setContent(event.target.value);
          if (error) setError("");
        }}
      />
      {error ? (
        <p id="note-error" className="field-error">
          {error}
        </p>
      ) : null}
      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? "Guardando…" : "Guardar nota"}
      </button>
    </form>
  );
}
