"use client";

import { useState } from "react";
import type { CandidateStatus } from "@/types/candidate";
import { STATUS_LABELS, STATUS_OPTIONS } from "@/lib/labels";
import { patchRecord, ApiError } from "@/services/candidates";
import FeedbackMessage from "./FeedbackMessage";

/**
 * Control para cambiar el ESTADO de una candidatura (PATCH /records/:id).
 * Muestra loading (deshabilita el select), éxito y error. Al actualizar,
 * informa al padre para reflejar el nuevo estado en la UI sin recargar.
 */
export default function StatusControl({
  recordId,
  value,
  onUpdated
}: {
  recordId: string;
  value: CandidateStatus;
  onUpdated: (status: CandidateStatus) => void;
}) {
  const [saving, setSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  async function handleChange(next: CandidateStatus) {
    if (next === value) return;
    setSaving(true);
    setFeedback(null);
    try {
      const updated = await patchRecord(recordId, { status: next });
      onUpdated(updated.status);
      setFeedback({ kind: "success", message: "Estado actualizado." });
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "No se pudo actualizar el estado.";
      setFeedback({ kind: "error", message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-2">
      <label htmlFor="status-control" className="field-label">
        Estado
      </label>
      <select
        id="status-control"
        className="field-input"
        value={value}
        disabled={saving}
        onChange={(event) => handleChange(event.target.value as CandidateStatus)}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {STATUS_LABELS[option]}
          </option>
        ))}
      </select>
      {saving ? <p className="text-sm text-slate-500">Guardando…</p> : null}
      {feedback ? <FeedbackMessage kind={feedback.kind} message={feedback.message} /> : null}
    </div>
  );
}
