"use client";

import { useState } from "react";
import type { CandidateStage } from "@/types/candidate";
import { STAGE_LABELS, STAGE_OPTIONS } from "@/lib/labels";
import { patchRecord, ApiError } from "@/services/candidates";
import FeedbackMessage from "./FeedbackMessage";

/**
 * Control para cambiar la ETAPA de una candidatura (PATCH /records/:id).
 * Maneja loading (deshabilita el select), éxito y error, y refleja de
 * inmediato la nueva etapa mediante el callback del padre.
 */
export default function StageControl({
  recordId,
  value,
  onUpdated
}: {
  recordId: string;
  value: CandidateStage;
  onUpdated: (stage: CandidateStage) => void;
}) {
  const [saving, setSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  async function handleChange(next: CandidateStage) {
    if (next === value) return;
    setSaving(true);
    setFeedback(null);
    try {
      const updated = await patchRecord(recordId, { stage: next });
      onUpdated(updated.stage);
      setFeedback({ kind: "success", message: "Etapa actualizada." });
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "No se pudo actualizar la etapa.";
      setFeedback({ kind: "error", message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-2">
      <label htmlFor="stage-control" className="field-label">
        Etapa
      </label>
      <select
        id="stage-control"
        className="field-input"
        value={value}
        disabled={saving}
        onChange={(event) => handleChange(event.target.value as CandidateStage)}
      >
        {STAGE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {STAGE_LABELS[option]}
          </option>
        ))}
      </select>
      {saving ? <p className="text-sm text-slate-500">Guardando…</p> : null}
      {feedback ? <FeedbackMessage kind={feedback.kind} message={feedback.message} /> : null}
    </div>
  );
}
