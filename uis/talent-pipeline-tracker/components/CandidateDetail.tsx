"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Candidate, CandidateStage, CandidateStatus } from "@/types/candidate";
import { getRecordById, ApiError } from "@/services/candidates";
import { formatDate } from "@/lib/labels";
import { StageBadge, StatusBadge } from "./Badges";
import StatusControl from "./StatusControl";
import StageControl from "./StageControl";
import NotesSection from "./NotesSection";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

type Phase = "loading" | "success" | "error";

/** Fila de dato del detalle (etiqueta + valor). */
function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-slate-100 py-2 last:border-0 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-slate-900 sm:col-span-2 sm:mt-0">{children}</dd>
    </div>
  );
}

/**
 * Detalle de una candidatura: carga por id, muestra todos los campos, permite
 * cambiar estado y etapa (PATCH) y gestiona las notas. Todo sin recargas.
 */
export default function CandidateDetail({ id }: { id: string }) {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const load = useCallback(async () => {
    setPhase("loading");
    setErrorMessage("");
    try {
      const data = await getRecordById(id);
      setCandidate(data);
      setPhase("success");
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : "No fue posible cargar la candidatura."
      );
      setPhase("error");
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleStatusUpdated = useCallback((status: CandidateStatus) => {
    setCandidate((current) => (current ? { ...current, status } : current));
  }, []);

  const handleStageUpdated = useCallback((stage: CandidateStage) => {
    setCandidate((current) => (current ? { ...current, stage } : current));
  }, []);

  if (phase === "loading") {
    return <LoadingState message="Cargando candidatura..." />;
  }

  if (phase === "error" || !candidate) {
    return (
      <ErrorState
        message={errorMessage || "No fue posible cargar la candidatura."}
        onRetry={() => void load()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="text-sm font-medium text-brand-700 hover:text-brand-800">
          ← Volver al pipeline
        </Link>
        <Link href={`/candidates/${candidate.id}/edit`} className="btn-secondary">
          Editar candidatura
        </Link>
      </div>

      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {candidate.full_name}
          </h1>
          <StatusBadge status={candidate.status} />
          <StageBadge stage={candidate.stage} />
        </div>
        <p className="text-slate-600">{candidate.position}</p>
      </header>

      <section aria-label="Datos de la candidatura" className="rounded-xl border border-slate-200 bg-white p-5">
        <dl>
          <DetailRow label="Nombre">{candidate.full_name}</DetailRow>
          <DetailRow label="Email">
            <a className="text-brand-700 underline" href={`mailto:${candidate.email}`}>
              {candidate.email}
            </a>
          </DetailRow>
          <DetailRow label="Teléfono">
            <a className="text-brand-700 underline" href={`tel:${candidate.phone}`}>
              {candidate.phone}
            </a>
          </DetailRow>
          <DetailRow label="Puesto">{candidate.position}</DetailRow>
          <DetailRow label="LinkedIn">
            {candidate.linkedin_url ? (
              <a
                className="text-brand-700 underline"
                href={candidate.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver perfil de LinkedIn
              </a>
            ) : (
              "—"
            )}
          </DetailRow>
          <DetailRow label="CV">
            {candidate.cv_url ? (
              <a
                className="text-brand-700 underline"
                href={candidate.cv_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Descargar CV
              </a>
            ) : (
              "—"
            )}
          </DetailRow>
          <DetailRow label="Años de experiencia">{candidate.experience_years}</DetailRow>
          <DetailRow label="Fecha de aplicación">{formatDate(candidate.applied_at)}</DetailRow>
          <DetailRow label="Última actualización">{formatDate(candidate.updated_at)}</DetailRow>
        </dl>
      </section>

      <section aria-label="Gestión de estado y etapa" className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <StatusControl recordId={candidate.id} value={candidate.status} onUpdated={handleStatusUpdated} />
        <StageControl recordId={candidate.id} value={candidate.stage} onUpdated={handleStageUpdated} />
      </section>

      <NotesSection recordId={candidate.id} />
    </div>
  );
}
