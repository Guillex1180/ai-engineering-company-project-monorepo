import type { CandidateNote } from "@/types/candidate";
import { formatDate } from "@/lib/labels";

/**
 * Lista de notas internas. Cada nota puede eliminarse; el botón se deshabilita
 * mientras esa nota se está borrando (deletingId).
 */
export default function NotesList({
  notes,
  deletingId,
  onDelete
}: {
  notes: CandidateNote[];
  deletingId: string | null;
  onDelete: (noteId: string) => void;
}) {
  if (notes.length === 0) {
    return <p className="text-sm text-slate-500">Aún no hay notas internas.</p>;
  }

  return (
    <ul className="space-y-3">
      {notes.map((note) => (
        <li
          key={note.id}
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <p className="whitespace-pre-line text-sm text-slate-800">
            {note.content}
          </p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              {formatDate(note.created_at)}
            </span>
            <button
              type="button"
              className="btn-danger px-3 py-1 text-xs"
              disabled={deletingId === note.id}
              onClick={() => onDelete(note.id)}
            >
              {deletingId === note.id ? "Eliminando…" : "Eliminar"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
