"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CreateCandidateInput } from "@/types/candidate";
import { createRecord, ApiError } from "@/services/candidates";
import CandidateForm from "@/components/CandidateForm";
import FeedbackMessage from "@/components/FeedbackMessage";

export default function NewCandidatePage() {
  const router = useRouter();
  const [success, setSuccess] = useState<boolean>(false);

  async function handleSubmit(input: CreateCandidateInput) {
    try {
      const created = await createRecord(input);
      setSuccess(true);
      // Navega al detalle de la nueva candidatura sin recarga completa.
      router.push(`/candidates/${created.id}`);
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new Error("No se pudo registrar la candidatura.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/" className="text-sm font-medium text-brand-700 hover:text-brand-800">
        ← Volver al pipeline
      </Link>

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Nueva candidatura
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Registra una candidatura en el pipeline de People &amp; Talent.
        </p>
      </header>

      {success ? (
        <FeedbackMessage kind="success" message="Candidatura registrada. Redirigiendo…" />
      ) : null}

      <CandidateForm submitLabel="Registrar candidatura" onSubmit={handleSubmit} />
    </div>
  );
}
