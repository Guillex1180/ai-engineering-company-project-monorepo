import Link from "next/link";
import type { Candidate } from "@/types/candidate";
import { StageBadge, StatusBadge } from "./Badges";

/** Tarjeta de una candidatura en el listado. Enlaza al detalle sin recarga. */
export default function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <li>
      <Link
        href={`/candidates/${candidate.id}`}
        className="block rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-brand-300 hover:bg-brand-50/40"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {candidate.full_name}
            </h3>
            <p className="text-sm text-slate-600">{candidate.position}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={candidate.status} />
            <StageBadge stage={candidate.stage} />
          </div>
        </div>
        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500">
          <div className="flex gap-1">
            <dt className="sr-only">Email</dt>
            <dd>{candidate.email}</dd>
          </div>
          <div className="flex gap-1">
            <dt>Experiencia:</dt>
            <dd>{candidate.experience_years} años</dd>
          </div>
        </dl>
      </Link>
    </li>
  );
}
