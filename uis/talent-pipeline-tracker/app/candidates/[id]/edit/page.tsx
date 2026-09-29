"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Candidate, CreateCandidateInput } from "@/types/candidate";
import { getRecordById, replaceRecord, ApiError } from "@/services/candidates";
import CandidateForm from "@/components/CandidateForm";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import FeedbackMessage from "@/components/FeedbackMessage";

type Phase = "loading" | "success" | "error";

export default function EditCandidatePage({
  params
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(false);

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

  async function handleSubmit(input: CreateCandidateInput) {
    try {
      await replaceRecord(id, input);
      setSaved(true);
      // Vuelve al detalle con los datos actualizados, sin recarga completa.
      router.push(`/candidates/${id}`);
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new Error("No se pudieron guardar los cambios.");
    }
  }

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
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href={`/candidates/${id}`}
        className="text-sm font-medium text-brand-700 hover:text-brand-800"
      >
        ← Volver al detalle
      </Link>

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Editar candidatura
        </h1>
        <p className="mt-1 text-sm text-slate-600">{candidate.full_name}</p>
      </header>

      {saved ? (
        <FeedbackMessage kind="success" message="Cambios guardados. Redirigiendo…" />
      ) : null}

      <CandidateForm
        submitLabel="Guardar cambios"
        initialValues={{
          full_name: candidate.full_name,
          email: candidate.email,
          phone: candidate.phone,
          position: candidate.position,
          experience_years: candidate.experience_years,
          linkedin_url: candidate.linkedin_url,
          cv_url: candidate.cv_url
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
