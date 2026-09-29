"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Candidate, RecordsQuery } from "@/types/candidate";
import { getRecords, ApiError } from "@/services/candidates";
import { isCandidateStage, isCandidateStatus } from "@/lib/labels";
import CandidateCard from "./CandidateCard";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

type Phase = "loading" | "success" | "error";

/**
 * Lista de candidaturas. Lee los filtros (status, stage, search) desde la URL
 * y refetchea cuando cambian. Maneja loading / success / error y el caso de
 * "sin resultados". El backend aplica los filtros (query params).
 */
export default function CandidateList() {
  const searchParams = useSearchParams();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [phase, setPhase] = useState<Phase>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Deriva la query tipada desde la URL, validando los valores contra la API.
  const statusParam = searchParams.get("status");
  const stageParam = searchParams.get("stage");
  const searchParam = searchParams.get("search");

  const load = useCallback(async () => {
    setPhase("loading");
    setErrorMessage("");

    const query: RecordsQuery = { limit: 100 };
    if (statusParam && isCandidateStatus(statusParam)) query.status = statusParam;
    if (stageParam && isCandidateStage(stageParam)) query.stage = stageParam;
    if (searchParam && searchParam.trim()) query.search = searchParam.trim();

    try {
      const response = await getRecords(query);
      setCandidates(response.data);
      setPhase("success");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No fue posible cargar las candidaturas.";
      setErrorMessage(message);
      setPhase("error");
    }
  }, [statusParam, stageParam, searchParam]);

  useEffect(() => {
    void load();
  }, [load]);

  if (phase === "loading") {
    return <LoadingState message="Cargando candidaturas..." />;
  }

  if (phase === "error") {
    return (
      <ErrorState
        message={errorMessage || "No fue posible cargar las candidaturas."}
        onRetry={() => void load()}
      />
    );
  }

  if (candidates.length === 0) {
    return (
      <div
        role="status"
        className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600"
      >
        No se encontraron candidaturas con estos filtros.
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-slate-500">
        {candidates.length}{" "}
        {candidates.length === 1 ? "candidatura" : "candidaturas"}
      </p>
      <ul className="grid gap-3">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </ul>
    </>
  );
}
