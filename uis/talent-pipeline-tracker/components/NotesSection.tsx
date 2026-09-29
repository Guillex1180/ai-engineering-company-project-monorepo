"use client";

import { useCallback, useEffect, useState } from "react";
import type { CandidateNote } from "@/types/candidate";
import { addNote, deleteNote, getNotes, ApiError } from "@/services/candidates";
import NoteForm from "./NoteForm";
import NotesList from "./NotesList";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import FeedbackMessage from "./FeedbackMessage";

type Phase = "loading" | "success" | "error";

/**
 * Sección "Notas internas": carga (GET), creación (POST) y eliminación (DELETE)
 * de notas. Actualiza la lista en memoria tras cada operación, sin recargar.
 */
export default function NotesSection({ recordId }: { recordId: string }) {
  const [notes, setNotes] = useState<CandidateNote[]>([]);
  const [phase, setPhase] = useState<Phase>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  const load = useCallback(async () => {
    setPhase("loading");
    setErrorMessage("");
    try {
      const data = await getNotes(recordId);
      setNotes(data);
      setPhase("success");
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : "No fue posible cargar las notas."
      );
      setPhase("error");
    }
  }, [recordId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleCreate = useCallback(
    async (content: string): Promise<boolean> => {
      setFeedback(null);
      try {
        const created = await addNote(recordId, { content });
        setNotes((current) => [created, ...current]);
        setFeedback({ kind: "success", message: "Nota añadida." });
        return true;
      } catch (error) {
        setFeedback({
          kind: "error",
          message:
            error instanceof ApiError ? error.message : "No se pudo añadir la nota."
        });
        return false;
      }
    },
    [recordId]
  );

  const handleDelete = useCallback(
    async (noteId: string) => {
      if (!window.confirm("¿Eliminar esta nota interna? Esta acción no se puede deshacer.")) {
        return;
      }
      setDeletingId(noteId);
      setFeedback(null);
      try {
        await deleteNote(recordId, noteId);
        setNotes((current) => current.filter((note) => note.id !== noteId));
        setFeedback({ kind: "success", message: "Nota eliminada." });
      } catch (error) {
        setFeedback({
          kind: "error",
          message:
            error instanceof ApiError ? error.message : "No se pudo eliminar la nota."
        });
      } finally {
        setDeletingId(null);
      }
    },
    [recordId]
  );

  return (
    <section aria-label="Notas internas" className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Notas internas</h2>

      <NoteForm onSubmit={handleCreate} />

      {feedback ? <FeedbackMessage kind={feedback.kind} message={feedback.message} /> : null}

      {phase === "loading" ? (
        <LoadingState message="Cargando notas..." />
      ) : phase === "error" ? (
        <ErrorState message={errorMessage} onRetry={() => void load()} />
      ) : (
        <NotesList notes={notes} deletingId={deletingId} onDelete={handleDelete} />
      )}
    </section>
  );
}
