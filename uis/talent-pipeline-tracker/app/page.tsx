import { Suspense } from "react";
import Link from "next/link";
import CandidateFilters from "@/components/CandidateFilters";
import CandidateSearch from "@/components/CandidateSearch";
import CandidateList from "@/components/CandidateList";
import LoadingState from "@/components/LoadingState";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Pipeline de Talento
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Revisa y gestiona las candidaturas del equipo de People &amp; Talent.
          </p>
        </div>
        <Link href="/candidates/new" className="btn-primary">
          Nueva candidatura
        </Link>
      </div>

      <section
        aria-label="Filtros y búsqueda"
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-5"
      >
        <Suspense fallback={<LoadingState message="Cargando filtros..." />}>
          <CandidateSearch />
          <CandidateFilters />
        </Suspense>
      </section>

      <section aria-label="Listado de candidaturas" className="space-y-3">
        <Suspense fallback={<LoadingState message="Cargando candidaturas..." />}>
          <CandidateList />
        </Suspense>
      </section>
    </div>
  );
}
