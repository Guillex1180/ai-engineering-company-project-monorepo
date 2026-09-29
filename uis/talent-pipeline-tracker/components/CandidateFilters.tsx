"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { STAGE_LABELS, STATUS_LABELS, STAGE_OPTIONS, STATUS_OPTIONS } from "@/lib/labels";

/**
 * Filtros por estado y etapa. Reflejan el estado en la URL mediante query
 * parameters (useSearchParams + router.replace), sin recargar la página.
 * Los filtros se combinan entre sí y con la búsqueda.
 */
export default function CandidateFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = searchParams.get("status") ?? "";
  const stage = searchParams.get("stage") ?? "";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="filter-status" className="field-label">
          Estado
        </label>
        <select
          id="filter-status"
          className="field-input"
          value={status}
          onChange={(event) => updateParam("status", event.target.value)}
        >
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {STATUS_LABELS[value]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-stage" className="field-label">
          Etapa
        </label>
        <select
          id="filter-stage"
          className="field-input"
          value={stage}
          onChange={(event) => updateParam("stage", event.target.value)}
        >
          <option value="">Todas las etapas</option>
          {STAGE_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {STAGE_LABELS[value]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
